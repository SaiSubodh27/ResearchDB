"""Dataset extraction helpers."""

import re
from typing import Dict, List

URL_PATTERN = re.compile(r"https?://[^\s)\]>\"']+", re.IGNORECASE)
DATASET_NAME_PATTERN = re.compile(
    r"\b(?:dataset|corpus|benchmark)\s+(?:called|named|used|is)?\s*[:\-]?\s*([A-Z][A-Za-z0-9_ .\-]{2,80})",
    re.IGNORECASE,
)


def extract_datasets(text: str) -> Dict[str, List[dict]]:
    """Extract dataset names and common dataset-hosting links."""
    datasets = []

    for url in _unique(URL_PATTERN.findall(text)):
        clean_url = url.rstrip(".,;")
        source = _dataset_source(clean_url)
        if source:
            datasets.append(
                {
                    "name": _name_from_url(clean_url),
                    "source": source,
                    "url": clean_url,
                }
            )

    for name in _unique(DATASET_NAME_PATTERN.findall(text)):
        datasets.append({"name": name.strip(" .,-"), "source": "mentioned", "url": None})

    return {"datasets": _dedupe_datasets(datasets)}


def _dataset_source(url: str) -> str | None:
    lowered = url.lower()
    if "huggingface.co/datasets" in lowered:
        return "huggingface"
    if "kaggle.com" in lowered:
        return "kaggle"
    if "github.com" in lowered and any(token in lowered for token in ["data", "dataset", "datasets"]):
        return "github"
    return None


def _name_from_url(url: str) -> str:
    path = url.rstrip("/").split("/")
    return "/".join(path[-2:]) if len(path) >= 2 else url


def _dedupe_datasets(datasets: List[dict]) -> List[dict]:
    seen = set()
    result = []
    for dataset in datasets:
        key = (dataset.get("name", "").lower(), dataset.get("url") or "")
        if key not in seen:
            seen.add(key)
            result.append(dataset)
    return result


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
