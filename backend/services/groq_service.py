"""Groq LLM service wrapper."""

import logging
import time
from typing import Any, Dict, Tuple

from groq import APIConnectionError, APIError, APITimeoutError, Groq, RateLimitError

from config import (
    GROQ_MAX_RETRIES,
    GROQ_MODEL,
    GROQ_TIMEOUT_SECONDS,
)

logger = logging.getLogger(__name__)


class LLMTimeoutError(RuntimeError):
    pass


class LLMProviderError(RuntimeError):
    pass


def ask_llm(prompt: str) -> str:
    """Ask Groq for a completion and return only the text."""
    response_text, _metadata = ask_llm_with_metadata(prompt)
    return response_text


def ask_llm_with_metadata(prompt: str) -> Tuple[str, Dict[str, Any]]:
    """Ask Groq for a completion with retry and response-time metadata."""
    last_error: Exception | None = None

    for attempt in range(1, GROQ_MAX_RETRIES + 1):
        started_at = time.perf_counter()
        try:
            client = Groq(timeout=GROQ_TIMEOUT_SECONDS)
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "Return concise, structured research analysis. Do not include markdown fences.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                max_tokens=900,
                response_format={"type": "json_object"},
            )
            elapsed_seconds = time.perf_counter() - started_at
            content = response.choices[0].message.content or ""
            logger.info(
                "groq_request_complete model=%s attempt=%s prompt_length=%s response_time_seconds=%.2f",
                GROQ_MODEL,
                attempt,
                len(prompt),
                elapsed_seconds,
            )
            return content, {
                "provider": "groq",
                "model": GROQ_MODEL,
                "attempt": attempt,
                "prompt_length": len(prompt),
                "response_time_seconds": round(elapsed_seconds, 2),
            }
        except APITimeoutError as exc:
            last_error = exc
            logger.warning(
                "groq_timeout attempt=%s prompt_length=%s timeout_seconds=%s",
                attempt,
                len(prompt),
                GROQ_TIMEOUT_SECONDS,
            )
            if attempt == GROQ_MAX_RETRIES:
                raise LLMTimeoutError("Groq timed out while generating analysis.") from exc
        except (RateLimitError, APIConnectionError, APIError) as exc:
            last_error = exc
            logger.warning(
                "groq_request_failed attempt=%s error=%s",
                attempt,
                exc,
            )
            if attempt == GROQ_MAX_RETRIES:
                raise LLMProviderError(f"Groq request failed: {exc}") from exc

        time.sleep(min(2 ** attempt, 8))

    raise LLMProviderError(f"Groq request failed: {last_error}")
