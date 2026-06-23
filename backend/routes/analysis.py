import re
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, joinedload
from starlette.concurrency import run_in_threadpool

from database import get_db
from models import Citation, Dataset, Paper, PaperAnalysis
from schemas import (
    AnalysisResponse,
    CitationItem,
    DatasetItem,
    PaperDetail,
    PaperSummary,
    AnalysisDetail,
)
from services.ai_provider import LLMProviderError, LLMTimeoutError
from services.analyze_paper import analyze_paper_text
from services.citation_extractor import extract_citations
from services.dataset_extractor import extract_datasets
from services.pdf_parser import extract_text

router = APIRouter()
logger = logging.getLogger(__name__)

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_UPLOAD_BYTES = 25 * 1024 * 1024


# ───────────────────────── LIST PAPERS ─────────────────────────


@router.get("/papers", response_model=list[PaperSummary])
def list_papers(db: Session = Depends(get_db)):
    """Return all analyzed papers, newest first."""
    papers = (
        db.query(Paper)
        .options(joinedload(Paper.analysis), joinedload(Paper.citations), joinedload(Paper.datasets))
        .order_by(Paper.uploaded_at.desc())
        .all()
    )

    results: list[PaperSummary] = []
    for paper in papers:
        summary_preview = None
        has_analysis = paper.analysis is not None
        if has_analysis and paper.analysis.summary:
            summary_preview = paper.analysis.summary[:160]

        results.append(
            PaperSummary(
                id=paper.id,
                filename=paper.filename,
                uploaded_at=paper.uploaded_at,
                has_analysis=has_analysis,
                summary_preview=summary_preview,
                citation_count=len(paper.citations),
                dataset_count=len(paper.datasets),
            )
        )

    return results


# ───────────────────── GET PAPER DETAIL ────────────────────────


@router.get("/papers/{paper_id}", response_model=PaperDetail)
def get_paper(paper_id: int, db: Session = Depends(get_db)):
    """Return full analysis, datasets, and citations for a paper."""
    paper = (
        db.query(Paper)
        .options(joinedload(Paper.analysis), joinedload(Paper.citations), joinedload(Paper.datasets))
        .filter(Paper.id == paper_id)
        .first()
    )
    if not paper:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found.")

    analysis_detail = None
    if paper.analysis:
        analysis_detail = AnalysisDetail(
            id=paper.analysis.id,
            summary=paper.analysis.summary,
            research_problem=paper.analysis.research_problem,
            methodology=paper.analysis.methodology,
            key_findings=paper.analysis.key_findings,
            future_work=paper.analysis.future_work,
            created_at=paper.analysis.created_at,
        )

    return PaperDetail(
        id=paper.id,
        filename=paper.filename,
        file_path=paper.file_path,
        uploaded_at=paper.uploaded_at,
        analysis=analysis_detail,
        datasets=[
            DatasetItem(name=d.name, source=d.source, url=d.url) for d in paper.datasets
        ],
        citations=[
            CitationItem(citation_type=c.citation_type, value=c.value)
            for c in paper.citations
        ],
    )


# ───────────────────── DELETE PAPER ────────────────────────────


@router.delete("/papers/{paper_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paper(paper_id: int, db: Session = Depends(get_db)):
    """Delete a paper and all related analysis/citations/datasets."""
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paper not found.")

    # Attempt to remove the uploaded file from disk
    try:
        uploaded_file = Path(paper.file_path)
        if uploaded_file.exists():
            uploaded_file.unlink()
    except OSError:
        logger.warning("Could not delete uploaded file: %s", paper.file_path)

    try:
        db.delete(paper)
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while deleting paper: {exc}",
        ) from exc


# ───────────────────── UPLOAD & ANALYZE ────────────────────────


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a PDF file.",
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded PDF is empty.",
        )
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="PDF is too large. Maximum size is 25 MB.",
        )

    safe_name = _safe_filename(file.filename)
    saved_name = f"{uuid4().hex}_{safe_name}"
    file_path = UPLOAD_DIR / saved_name
    file_path.write_bytes(contents)

    try:
        text = await run_in_threadpool(extract_text, str(file_path))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse PDF: {exc}",
        ) from exc

    progress_logs = [
        f"Saved upload: {file_path.name}",
        f"Extracted text length: {len(text)} characters",
    ]
    logger.info(
        "pdf_text_extracted filename=%s extracted_text_length=%s",
        file.filename,
        len(text),
    )

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No readable text was found in this PDF.",
        )

    try:
        analysis, analysis_logs = await run_in_threadpool(analyze_paper_text, text)
        progress_logs.extend(analysis_logs)
    except LLMTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={
                "message": "AI provider timed out while analyzing the paper.",
                "logs": progress_logs,
            },
        ) from exc
    except LLMProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "message": f"AI provider request failed: {exc}",
                "logs": progress_logs,
            },
        ) from exc

    datasets = extract_datasets(text)["datasets"]
    citations = extract_citations(text)["citations"]

    try:
        paper = Paper(filename=file.filename, file_path=str(file_path))
        db.add(paper)
        db.flush()

        db.add(PaperAnalysis(paper_id=paper.id, **analysis))
        db.add_all(
            Citation(
                paper_id=paper.id,
                citation_type=item["citation_type"],
                value=item["value"],
            )
            for item in citations
        )
        db.add_all(
            Dataset(
                paper_id=paper.id,
                name=item["name"],
                source=item["source"],
                url=item.get("url"),
            )
            for item in datasets
        )
        db.commit()
        db.refresh(paper)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving analysis: {exc}",
        ) from exc

    return {
        "paper_id": paper.id,
        "filename": paper.filename,
        **analysis,
        "datasets": datasets,
        "citations": citations,
        "logs": progress_logs,
    }


def _safe_filename(filename: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_.-]+", "_", Path(filename).name)
    return cleaned or "paper.pdf"
