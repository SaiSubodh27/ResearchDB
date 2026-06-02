"""Ollama service wrapper."""

import logging
import time
from typing import Any, Dict, Tuple

import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen3:8b"
OLLAMA_TIMEOUT_SECONDS = 300
OLLAMA_OPTIONS = {
    "temperature": 0.1,
    "num_predict": 700,
}

logger = logging.getLogger(__name__)


class OllamaError(RuntimeError):
    pass


def ask_ollama(prompt: str, timeout: int = OLLAMA_TIMEOUT_SECONDS) -> str:
    """Send a prompt to Ollama and return the generated text."""
    response_text, _metadata = ask_ollama_with_metadata(prompt, timeout=timeout)
    return response_text


def ask_ollama_with_metadata(
    prompt: str,
    timeout: int = OLLAMA_TIMEOUT_SECONDS,
) -> Tuple[str, Dict[str, Any]]:
    """Send a prompt to Ollama and return generated text plus timing metadata."""
    started_at = time.perf_counter()
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "think": False,
            "options": OLLAMA_OPTIONS,
        },
        timeout=timeout,
    )
    elapsed_seconds = time.perf_counter() - started_at
    logger.info(
        "ollama_request_complete prompt_length=%s response_time_seconds=%.2f",
        len(prompt),
        elapsed_seconds,
    )
    response.raise_for_status()
    data = response.json()

    message = data.get("message") or {}
    response_text = message.get("content") or data.get("response") or data.get("thinking") or ""
    if not response_text:
        raise OllamaError("Ollama response did not include generated text.")

    metadata = {
        "prompt_length": len(prompt),
        "response_time_seconds": round(elapsed_seconds, 2),
        "model": data.get("model", OLLAMA_MODEL),
        "done_reason": data.get("done_reason"),
    }
    return response_text, metadata
