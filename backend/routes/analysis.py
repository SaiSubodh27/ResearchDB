import re
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from backend.database import get_db
from backend.models import Citation, Dataset, Paper, PaperAnalysis
from backend.schemas import AnalysisResponse
from backend.services.ai_provider import LLMProviderError, LLMTimeoutError
from backend.services.analyze_paper import analyze_paper_text
from backend.services.citation_extractor import extract_citations
from backend.services.dataset_extractor import extract_datasets
from backend.services.pdf_parser import extract_text

router = APIRouter()
logger = logging.getLogger(__name__)

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_UPLOAD_BYTES = 25 * 1024 * 1024


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
