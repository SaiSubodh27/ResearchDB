import arxiv
import tempfile
import os
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

# Domain to arxiv category mapping
DOMAIN_CATEGORIES = {
    "AI/ML":             "cs.AI",
    "Battery/Materials": "cond-mat.mtrl-sci",
    "Biomedical":        "q-bio",
    "Finance":           "q-fin.CP",
    "Cybersecurity":     "cs.CR"
}


def fetch_papers_by_domain(domain: str, max_results: int = 5) -> List[Dict]:
    """
    Fetch latest papers from arxiv for a given domain.
    Downloads PDF, extracts text, deletes PDF.
    Returns list of paper dicts with text included.
    """
    category = DOMAIN_CATEGORIES.get(domain)
    if not category:
        logger.error(f"Unknown domain: {domain}")
        return []

    papers = []

    # arxiv 4.0 style
    client = arxiv.Client()
    search = arxiv.Search(
        query=f"cat:{category}",
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    for result in client.results(search):
        try:
            paper_data = _process_paper(result, domain)
            if paper_data:
                papers.append(paper_data)
        except Exception as e:
            logger.error(f"Error processing paper {result.title}: {e}")
            continue

    logger.info(f"Fetched {len(papers)} papers for domain: {domain}")
    return papers


def _process_paper(result, domain: str) -> Dict | None:
    """Download PDF, extract text, delete PDF."""
    pdf_path = None
    try:
        with tempfile.NamedTemporaryFile(
            suffix=".pdf",
            delete=False
        ) as tmp:
            pdf_path = tmp.name

        # arxiv 4.0 — use urllib instead of download_pdf
        import urllib.request
        urllib.request.urlretrieve(result.pdf_url, pdf_path)
        logger.info(f"Downloaded: {result.title[:50]}")

        from services.pdf_parser import extract_text
        text = extract_text(pdf_path)

        if not text or len(text) < 100:
            logger.warning(f"No text extracted from: {result.title}")
            return None

        return {
            "title":     result.title,
            "authors":   [a.name for a in result.authors],
            "arxiv_id":  result.entry_id.split("/")[-1],
            "domain":    domain,
            "pdf_url":   result.pdf_url,
            "published": result.published.strftime("%Y-%m-%d"),
            "text":      text
        }

    except Exception as e:
        logger.error(f"Failed to process paper: {e}")
        return None

    finally:
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
            logger.info(f"Deleted temp PDF: {pdf_path}")
    """Download PDF, extract text, delete PDF."""
    pdf_path = None
    try:
        with tempfile.NamedTemporaryFile(
            suffix=".pdf",
            delete=False
        ) as tmp:
            pdf_path = tmp.name

        result.download_pdf(filename=pdf_path)
        logger.info(f"Downloaded: {result.title[:50]}")

        from services.pdf_parser import extract_text
        text = extract_text(pdf_path)

        if not text or len(text) < 100:
            logger.warning(f"No text extracted from: {result.title}")
            return None

        return {
            "title":     result.title,
            "authors":   [a.name for a in result.authors],
            "arxiv_id":  result.entry_id.split("/")[-1],
            "domain":    domain,
            "pdf_url":   result.pdf_url,
            "published": result.published.strftime("%Y-%m-%d"),
            "text":      text
        }

    except Exception as e:
        logger.error(f"Failed to process paper: {e}")
        return None

    finally:
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
            logger.info(f"Deleted temp PDF: {pdf_path}")
def fetch_papers_by_domain(domain: str, max_results: int = 5) -> List[Dict]:
    category = DOMAIN_CATEGORIES.get(domain)
    if not category:
        logger.error(f"Unknown domain: {domain}")
        return []

    papers = []

    client = arxiv.Client()
    search = arxiv.Search(
        query=f"cat:{category}",
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    # DEBUG — see what arxiv returns
    results_list = list(client.results(search))
    logger.info(f"Domain: {domain} | Category: {category} | Results: {len(results_list)}")

    for result in results_list:
        logger.info(f"Paper found: {result.title[:50]}")
        try:
            paper_data = _process_paper(result, domain)
            if paper_data:
                papers.append(paper_data)
        except Exception as e:
            logger.error(f"Error processing paper {result.title}: {e}")
            continue

    logger.info(f"Fetched {len(papers)} papers for domain: {domain}")
    return papers