"""SQLite database connection and initialization."""

import sqlite3
from typing import Iterator

from flask import Flask, current_app


SEED_REPORTS = [
    {
        "id": 1,
        "type": "UPI Fraud",
        "title": "Fake payment collect request",
        "location": "Hyderabad",
        "risk": "High",
        "status": "Verified",
        "created_at": "2026-05-25T10:30:00Z",
    }
]


def get_db() -> sqlite3.Connection:
    """Create a SQLite connection for repository operations."""
    connection = sqlite3.connect(current_app.config["DATABASE_PATH"])
    connection.row_factory = sqlite3.Row
    return connection


def rows_to_dicts(rows: Iterator[sqlite3.Row]) -> list[dict]:
    """Convert SQLite rows into plain dictionaries."""
    return [dict(row) for row in rows]


def init_db(app: Flask) -> None:
    """Create application tables and seed demo data when needed."""
    with app.app_context():
        with get_db() as db:
            db.execute(
                """
                CREATE TABLE IF NOT EXISTS reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    title TEXT NOT NULL,
                    location TEXT NOT NULL,
                    risk TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            db.execute(
                """
                CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    kind TEXT NOT NULL,
                    input TEXT NOT NULL,
                    risk TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    details TEXT,
                    created_at TEXT NOT NULL
                )
                """
            )

            count = db.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
            if count == 0:
                db.executemany(
                    """
                    INSERT INTO reports (type, title, location, risk, status, created_at)
                    VALUES (:type, :title, :location, :risk, :status, :created_at)
                    """,
                    SEED_REPORTS,
                )
