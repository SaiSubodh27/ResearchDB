from sqlalchemy import text
from database import engine

with engine.connect() as conn:

    conn.execute(
        text("""
        INSERT INTO analysis
        (
            paper_id,
            summary,
            research_problem,
            methodology,
            key_findings,
            future_work
        )

        VALUES
        (
            :paper_id,
            :summary,
            :research_problem,
            :methodology,
            :key_findings,
            :future_work
        )
        """),
        {
            "paper_id": 1,
            "summary": "Test Summary",
            "research_problem": "Test Problem",
            "methodology": "Test Method",
            "key_findings": "Test Findings",
            "future_work": "Test Future Work"
        }
    )

    conn.commit()

print("Analysis inserted!")