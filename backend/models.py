"""SQLAlchemy models for paper analysis storage."""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from database import Base


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # New arxiv automation fields
    domain = Column(String(100), nullable=True)
    arxiv_id = Column(String(100), nullable=True, unique=True)
    authors = Column(Text, nullable=True)
    published_date = Column(String(20), nullable=True)
    source = Column(String(20), default="manual")
    paper_url = Column(Text, nullable=True)

    analysis = relationship("PaperAnalysis", back_populates="paper", uselist=False)
    citations = relationship("Citation", back_populates="paper", cascade="all, delete")
    datasets = relationship("Dataset", back_populates="paper", cascade="all, delete")


class PaperAnalysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False, unique=True)
    summary = Column(Text, nullable=False)
    research_problem = Column(Text, nullable=False)
    methodology = Column(Text, nullable=False)
    key_findings = Column(Text, nullable=False)
    future_work = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    paper = relationship("Paper", back_populates="analysis")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    citation_type = Column(String(50), nullable=False)
    value = Column(Text, nullable=False)

    paper = relationship("Paper", back_populates="citations")


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    name = Column(String(255), nullable=False)
    source = Column(String(50), nullable=False)
    url = Column(Text, nullable=True)

    paper = relationship("Paper", back_populates="datasets")