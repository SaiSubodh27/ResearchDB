"""Paper analysis service powered by the configured AI provider."""

import json
import logging
import re
from typing import Dict, List, Tuple

from services.ai_provider import ask_llm_with_metadata

logger = logging.getLogger(__name__)

CHUNK_SIZE = 5000
MAX_CHUNKS = 1

ANALYSIS_FIELDS = {
    "summary": "Summary unavailable.",
    "research_problem": "Research problem unavailable.",
    "methodology": "Methodology unavailable.",
    "key_findings": "Key findings unavailable.",
    "future_work": "Future work unavailable.",
}


def analyze_paper_text(text: str) -> Tuple[Dict[str, str], List[str]]:
    """Generate structured paper analysis fields from extracted text."""
    logs = [f"Extracted text length: {len(text)} characters"]
    chunks = _chunk_text(text, CHUNK_SIZE, MAX_CHUNKS)
    logs.append(
        f"Using {len(chunks)} chunk(s), {CHUNK_SIZE} characters each, max {MAX_CHUNKS} chunk(s)"
    )
    logger.info(
        "paper_analysis_start extracted_text_length=%s chunks=%s chunk_size=%s",
        len(text),
        len(chunks),
        CHUNK_SIZE,
    )

    if len(chunks) == 1:
        analysis = _analyze_single_chunk(chunks[0], logs)
        return analysis, logs

    chunk_summaries = []
    for index, chunk in enumerate(chunks, start=1):
        logs.append(f"Analyzing chunk {index}/{len(chunks)} length: {len(chunk)} characters")
        chunk_summaries.append(_summarize_chunk(chunk, index, logs))

    synthesis_text = "\n\n".join(chunk_summaries)
    logs.append(f"Synthesis input length: {len(synthesis_text)} characters")
    analysis = _analyze_single_chunk(synthesis_text, logs, is_synthesis=True)
    return analysis, logs


def _analyze_single_chunk(
    text: str,
    logs: List[str],
    is_synthesis: bool = False,
) -> Dict[str, str]:
    mode = "chunk summaries" if is_synthesis else "paper excerpt"
    prompt = f"""
You are a research assistant. Analyze this paper and return ONLY valid JSON.

JSON keys:
- summary
- research_problem
- methodology
- key_findings
- future_work

Keep each value concise and useful.

Input type: {mode}

Paper text:
{text[:CHUNK_SIZE]}
"""
    logs.append(f"Prompt length: {len(prompt)} characters")
    raw_response, metadata = ask_llm_with_metadata(prompt)
    logs.append(
        f"{metadata.get('provider', 'llm')} response time: {metadata['response_time_seconds']} seconds"
    )
    logger.info(
        "paper_analysis_prompt prompt_length=%s response_time_seconds=%s",
        metadata["prompt_length"],
        metadata["response_time_seconds"],
    )
    return _parse_analysis_response(raw_response)


def _summarize_chunk(chunk: str, index: int, logs: List[str]) -> str:
    prompt = f"""
Summarize this research paper chunk in 6 concise bullets.
Focus on problem, method, findings, datasets, and future work.

Chunk {index}:
{chunk}
"""
    logs.append(f"Chunk {index} prompt length: {len(prompt)} characters")
    response, metadata = ask_llm_with_metadata(prompt)
    logs.append(
        f"Chunk {index} {metadata.get('provider', 'llm')} response time: {metadata['response_time_seconds']} seconds"
    )
    return response.strip()


def _chunk_text(text: str, chunk_size: int, max_chunks: int) -> List[str]:
    compact_text = re.sub(r"\s+", " ", text).strip()
    chunks = [
        compact_text[index : index + chunk_size]
        for index in range(0, len(compact_text), chunk_size)
    ]
    return chunks[:max_chunks] or [compact_text[:chunk_size]]


def _parse_analysis_response(raw_response: str) -> Dict[str, str]:
    parsed = _try_parse_json(raw_response)
    if parsed:
        return _normalize(parsed)

    return _normalize(
        {
            field: _extract_section(raw_response, field)
            for field in ANALYSIS_FIELDS
        }
    )


def _try_parse_json(raw_response: str) -> Dict[str, str] | None:
    candidates = [raw_response]
    match = re.search(r"\{.*\}", raw_response, flags=re.DOTALL)
    if match:
        candidates.append(match.group(0))

    for candidate in candidates:
        try:
            parsed = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            return parsed
    return None


def _extract_section(text: str, field: str) -> str:
    label = field.replace("_", r"[_\s-]*")
    pattern = rf"{label}\s*:?\s*(.*?)(?=\n\s*[A-Za-z_ -]+\s*:|\Z)"
    match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""


def _normalize(data: Dict[str, object]) -> Dict[str, str]:
    normalized = {}
    for field, fallback in ANALYSIS_FIELDS.items():
        value = data.get(field, "")
        if isinstance(value, list):
            value = "\n".join(str(item) for item in value)
        normalized[field] = str(value).strip() or fallback
    return normalized
