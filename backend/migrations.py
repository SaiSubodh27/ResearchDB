"""Small startup migrations for the local ResearchOS schema."""

from sqlalchemy import text

from database import engine


def ensure_schema() -> None:
    """Create missing columns required by the current analysis workflow."""
    statements = [
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS filename VARCHAR(255)",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS file_path VARCHAR(500)",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE citations ADD COLUMN IF NOT EXISTS citation_type VARCHAR(50)",
        "ALTER TABLE citations ADD COLUMN IF NOT EXISTS value TEXT",
        "ALTER TABLE datasets ADD COLUMN IF NOT EXISTS source VARCHAR(50)",
        "ALTER TABLE datasets ADD COLUMN IF NOT EXISTS url TEXT",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS domain VARCHAR(100)",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS arxiv_id VARCHAR(100) UNIQUE",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS authors TEXT",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS published_date VARCHAR(20)",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual'",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS paper_url TEXT",
    ]

    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))
