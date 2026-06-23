"""Pydantic schemas for API responses."""

from datetime import datetime
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


# --------------- Paper list / detail responses ---------------


class PaperSummary(BaseModel):
    """Lightweight representation returned by GET /papers."""

    id: int
    filename: str
    uploaded_at: Optional[datetime] = None
    has_analysis: bool = False
    summary_preview: Optional[str] = None
    citation_count: int = 0
    dataset_count: int = 0

    class Config:
        from_attributes = True


class AnalysisDetail(BaseModel):
    """Full analysis fields for a single paper."""

    id: int
    summary: str
    research_problem: str
    methodology: str
    key_findings: str
    future_work: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaperDetail(BaseModel):
    """Full paper detail returned by GET /papers/{paper_id}."""

    id: int
    filename: str
    file_path: str
    uploaded_at: Optional[datetime] = None
    analysis: Optional[AnalysisDetail] = None
    datasets: List[DatasetItem] = []
    citations: List[CitationItem] = []

    class Config:
        from_attributes = True
