"""Scan history domain model."""

from dataclasses import dataclass


@dataclass(slots=True)
class HistoryEntry:
    """Scan history entry representation."""

    kind: str
    input: str
    risk: str
    score: int
    created_at: str
    id: int | None = None
    details: str | None = None
