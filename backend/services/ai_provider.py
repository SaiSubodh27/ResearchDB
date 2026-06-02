"""Provider abstraction for ResearchOS AI calls."""

from typing import Any, Dict, Tuple

from backend.config import AI_PROVIDER
from backend.services.groq_service import ask_llm as ask_groq
from backend.services.groq_service import ask_llm_with_metadata as ask_groq_with_metadata
from backend.services.groq_service import LLMProviderError, LLMTimeoutError
from backend.services.ollama_service import ask_ollama_with_metadata


def ask_llm(prompt: str) -> str:
    response_text, _metadata = ask_llm_with_metadata(prompt)
    return response_text


def ask_llm_with_metadata(prompt: str) -> Tuple[str, Dict[str, Any]]:
    if AI_PROVIDER == "groq":
        return ask_groq_with_metadata(prompt)
    if AI_PROVIDER == "ollama":
        response_text, metadata = ask_ollama_with_metadata(prompt)
        metadata["provider"] = "ollama"
        return response_text, metadata
    if AI_PROVIDER == "gemini":
        raise LLMProviderError("Gemini provider is not implemented yet.")

    raise LLMProviderError(f"Unsupported AI_PROVIDER: {AI_PROVIDER}")


__all__ = [
    "ask_llm",
    "ask_llm_with_metadata",
    "LLMProviderError",
    "LLMTimeoutError",
]
