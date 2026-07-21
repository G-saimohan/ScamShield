"""Report domain model."""

from dataclasses import dataclass


@dataclass(slots=True)
class Report:
    """Community scam report representation."""

    type: str
    title: str
    location: str
    risk: str
    status: str
    created_at: str
    id: int | None = None
