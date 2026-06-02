from sqlalchemy import text
from database import engine

with engine.connect() as conn:

    conn.execute(
        text("""
        INSERT INTO papers
        (user_id, title, file_path)

        VALUES
        (:user_id, :title, :file_path)
        """),
        {
            "user_id": None,
            "title": "Test Paper",
            "file_path": "uploads/test.pdf"
        }
    )

    conn.commit()

print("Paper inserted!")