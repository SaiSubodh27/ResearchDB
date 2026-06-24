"""
Arxiv automation pipeline.
Fetch → Analyze → Save → Delete PDF
"""

import logging
from typing import List, Dict
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Paper, PaperAnalysis
from services.arxiv_fetcher import fetch_papers_by_domain, DOMAIN_CATEGORIES
from services.analyze_paper import analyze_paper_text

logger = logging.getLogger(__name__)


def run_pipeline_for_domain(domain: str) -> Dict:
    """
    Full pipeline for one domain:
    1. Fetch papers from arxiv
    2. Analyze each paper
    3. Save to database
    4. Return summary of what was processed
    """
    logger.info(f"Starting pipeline for domain: {domain}")
    results = {
        "domain": domain,
        "fetched": 0,
        "saved": 0,
        "skipped": 0,
        "errors": 0,
        "papers": []
    }

    # Step 1 — Fetch papers
    papers = fetch_papers_by_domain(domain, max_results=5)
    results["fetched"] = len(papers)

    if not papers:
        logger.warning(f"No papers fetched for domain: {domain}")
        return results

    # Step 2 — Process each paper
    db = SessionLocal()
    try:
        for paper_data in papers:
            try:
                result = _process_single_paper(db, paper_data)
                if result == "saved":
                    results["saved"] += 1
                    results["papers"].append({
                        "title": paper_data["title"],
                        "arxiv_id": paper_data["arxiv_id"],
                        "status": "saved"
                    })
                elif result == "skipped":
                    results["skipped"] += 1
            except Exception as e:
                logger.error(f"Error processing paper: {e}")
                results["errors"] += 1
    finally:
        db.close()

    logger.info(
        f"Pipeline complete for {domain}: "
        f"fetched={results['fetched']} "
        f"saved={results['saved']} "
        f"skipped={results['skipped']} "
        f"errors={results['errors']}"
    )
    return results


def run_pipeline_all_domains() -> List[Dict]:
    """Run pipeline for ALL domains — called by scheduler daily."""
    logger.info("Starting full pipeline for all domains")
    all_results = []

    for domain in DOMAIN_CATEGORIES.keys():
        try:
            result = run_pipeline_for_domain(domain)
            all_results.append(result)
        except Exception as e:
            logger.error(f"Pipeline failed for domain {domain}: {e}")
            all_results.append({
                "domain": domain,
                "error": str(e)
            })

    logger.info("Full pipeline complete for all domains")
    return all_results


def _process_single_paper(db: Session, paper_data: Dict) -> str:
    """
    Process one paper — analyze and save to DB.
    Returns 'saved', 'skipped', or raises exception.
    """
    # Check if paper already exists in DB
    existing = db.query(Paper).filter(
        Paper.arxiv_id == paper_data["arxiv_id"]
    ).first()

    if existing:
        logger.info(f"Skipping existing paper: {paper_data['arxiv_id']}")
        return "skipped"

    # Analyze paper text
    logger.info(f"Analyzing: {paper_data['title'][:50]}")
    analysis_result, logs = analyze_paper_text(paper_data["text"])

    # Save Paper to DB
    paper = Paper(
        filename=f"{paper_data['arxiv_id']}.pdf",
        file_path="arxiv",  # no actual file stored
        domain=paper_data["domain"],
        arxiv_id=paper_data["arxiv_id"],
        authors=", ".join(paper_data["authors"]),
        published_date=paper_data["published"],
        source="arxiv",
        paper_url=paper_data["pdf_url"]
    )
    db.add(paper)
    db.flush()  # get paper.id without committing

    # Save Analysis to DB
    analysis = PaperAnalysis(
        paper_id=paper.id,
        summary=analysis_result["summary"],
        research_problem=analysis_result["research_problem"],
        methodology=analysis_result["methodology"],
        key_findings=analysis_result["key_findings"],
        future_work=analysis_result["future_work"]
    )
    db.add(analysis)
    db.commit()

    logger.info(f"Saved paper: {paper_data['title'][:50]}")
    return "saved"