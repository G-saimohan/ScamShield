"""Import legacy SQLite reports and history into MongoDB.

Run from the project root after setting MONGODB_URI and DATABASE_NAME:

    python scripts/migrate_sqlite_to_mongodb.py
"""

from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from scamshield import create_app  # noqa: E402
from scamshield.repositories.history_repository import HistoryRepository  # noqa: E402
from scamshield.repositories.report_repository import ReportRepository  # noqa: E402


def migrate(sqlite_path: Path) -> None:
    """Import SQLite rows into MongoDB through repository classes."""
    app = create_app()

    if not sqlite_path.exists():
        raise FileNotFoundError(f"SQLite database not found: {sqlite_path}")

    with app.app_context(), sqlite3.connect(sqlite_path) as connection:
        connection.row_factory = sqlite3.Row
        report_rows = connection.execute(
            "SELECT id, type, title, location, risk, status, created_at FROM reports"
        ).fetchall()
        history_rows = connection.execute(
            "SELECT id, kind, input, risk, score, details, created_at FROM history"
        ).fetchall()

        for row in report_rows:
            ReportRepository.create_report(
                {
                    "report_id": f"sqlite-report-{row['id']}",
                    "type": row["type"],
                    "title": row["title"],
                    "location": row["location"],
                    "risk": row["risk"],
                    "status": row["status"],
                    "created_at": row["created_at"],
                }
            )

        for row in history_rows:
            details = json.loads(row["details"] or "{}")
            HistoryRepository.create_scan(
                {
                    "scan_id": f"sqlite-scan-{row['id']}",
                    "kind": row["kind"],
                    "input": row["input"],
                    "risk": row["risk"],
                    "score": row["score"],
                    "details": details,
                    "url": row["input"] if row["kind"] == "URL" else None,
                    "created_at": row["created_at"],
                }
            )

    print(
        f"Imported {len(report_rows)} reports and {len(history_rows)} scans "
        f"from {sqlite_path}"
    )


if __name__ == "__main__":
    default_path = PROJECT_ROOT / "scamshield.db"
    migrate(Path(sys.argv[1]) if len(sys.argv) > 1 else default_path)
