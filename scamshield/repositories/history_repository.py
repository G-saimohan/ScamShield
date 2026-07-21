"""History repository abstraction."""

import json
from typing import Protocol

from scamshield.repositories.database import get_db, rows_to_dicts
from scamshield.utils.time import utc_now


class HistoryRepositoryInterface(Protocol):
    """Protocol for future history persistence implementations."""

    @staticmethod
    def add_history(
        kind: str,
        input_value: str,
        risk: str,
        score: int,
        details: dict | None,
    ) -> None:
        """Persist a scan history entry."""

    @staticmethod
    def list_history(limit: int = 8) -> list[dict]:
        """Return recent scan history."""


class HistoryRepository:
    """SQLite-backed scan history repository."""

    @staticmethod
    def add_history(
        kind: str,
        input_value: str,
        risk: str,
        score: int,
        details: dict | None = None,
    ) -> None:
        """Persist a scan history entry."""
        with get_db() as db:
            db.execute(
                """
                INSERT INTO history (kind, input, risk, score, details, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (kind, input_value, risk, int(score), json.dumps(details or {}), utc_now()),
            )

    @staticmethod
    def list_history(limit: int = 8) -> list[dict]:
        """Return recent scan history."""
        with get_db() as db:
            rows = db.execute(
                """
                SELECT kind, input, risk, score, created_at
                FROM history
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return rows_to_dicts(rows)
