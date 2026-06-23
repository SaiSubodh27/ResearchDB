from pdf_parser import extract_text
from services.ai_provider import ask_llm
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

pdf_path = BASE_DIR / "uploads" / "test.pdf"

text = extract_text(str(pdf_path))

prompt = f"""
Summarize this document.

Provide:

1. Main Topic
2. Key Points
3. Important Findings

Document:

{text[:5000]}
"""

response = ask_llm(prompt)

print(response)
