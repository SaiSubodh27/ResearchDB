"""Citation extraction helpers."""

import re
from typing import Dict, List

DOI_PATTERN = re.compile(r"\b10\.\d{4,9}/[-._;()/:A-Z0-9]+\b", re.IGNORECASE)
URL_PATTERN = re.compile(r"https?://[^\s)\]>\"']+", re.IGNORECASE)
REFERENCES_PATTERN = re.compile(
    r"(references|bibliography)\s*\n(?P<body>.+)$",
    re.IGNORECASE | re.DOTALL,
)


def extract_citations(text: str) -> Dict[str, List[dict]]:
    """Extract DOI, URL, and reference-section citation candidates."""
    citations = []

    for doi in _unique(DOI_PATTERN.findall(text)):
        citations.append({"citation_type": "doi", "value": doi.rstrip(".,;")})

    for url in _unique(URL_PATTERN.findall(text)):
        citations.append({"citation_type": "url", "value": url.rstrip(".,;")})

    references = _extract_references(text)
    for reference in references[:30]:
        citations.append({"citation_type": "reference", "value": reference})

    return {"citations": citations}


def _extract_references(text: str) -> List[str]:
    match = REFERENCES_PATTERN.search(text)
    if not match:
        return []

    body = match.group("body")
    chunks = re.split(r"\n\s*(?:\[\d+\]|\d+\.|\(\d+\))\s*", body)
    return [chunk.strip() for chunk in chunks if len(chunk.strip()) > 20]


def _unique(values: List[str]) -> List[str]:
    seen = set()
    result = []
    for value in values:
        normalized = value.strip()
        key = normalized.lower()
        if normalized and key not in seen:
            seen.add(key)
            result.append(normalized)
    return result
