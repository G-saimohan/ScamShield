"""Time helpers."""

from datetime import datetime


def utc_now() -> str:
    """Return an ISO-8601 UTC timestamp."""
    return datetime.utcnow().isoformat() + "Z"
