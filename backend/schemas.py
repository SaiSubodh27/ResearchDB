"""Pydantic schemas for API responses."""

from typing import List, Optional

from pydantic import BaseModel


class DatasetItem(BaseModel):
    name: str
    source: str
    url: Optional[str] = None


class CitationItem(BaseModel):
    citation_type: str
    value: str


class AnalysisResponse(BaseModel):
    paper_id: int
    filename: str
    summary: str
    research_problem: str
    methodology: str
    key_findings: str
    future_work: str
    datasets: List[DatasetItem] = []
    citations: List[CitationItem] = []
    logs: List[str] = []
