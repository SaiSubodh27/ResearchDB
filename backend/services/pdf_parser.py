"""PDF parser service."""

import fitz


def extract_text(pdf_path: str) -> str:
    """Extract normalized full text from a PDF using PyMuPDF."""
    text_parts = []

    with fitz.open(pdf_path) as doc:
        for page in doc:
            page_text = page.get_text("text")
            if page_text:
                text_parts.append(page_text.strip())

    return "\n\n".join(text_parts).strip()
