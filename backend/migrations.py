"""Small startup migrations for the local ResearchOS schema."""

from sqlalchemy import text

from backend.database import engine


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
    ]

    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))
