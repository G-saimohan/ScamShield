"""Repository document validation helpers."""

from collections.abc import Iterable

from scamshield.repositories.exceptions import RepositoryValidationError
from scamshield.repositories.database import now_document


def require_fields(document: dict, fields: Iterable[str]) -> None:
    """Ensure all required fields are present and non-empty."""
    missing = [field for field in fields if document.get(field) in (None, "")]
    if missing:
        raise RepositoryValidationError(
            f"Missing required field(s): {', '.join(missing)}"
        )


def with_timestamps(document: dict, is_update: bool = False) -> dict:
    """Attach created_at and updated_at fields to a document."""
    prepared = dict(document)
    timestamps = now_document()
    if not is_update:
        prepared.setdefault("created_at", timestamps["created_at"])
    prepared["updated_at"] = timestamps["updated_at"]
    return prepared


def validate_report(document: dict) -> dict:
    """Validate a report document."""
    prepared = with_timestamps(document)
    require_fields(
        prepared,
        ["report_id", "type", "title", "location", "risk", "status", "created_at"],
    )
    return prepared


def validate_scan(document: dict) -> dict:
    """Validate a scan document."""
    prepared = with_timestamps(document)
    require_fields(
        prepared,
        ["scan_id", "kind", "input", "risk", "score", "created_at"],
    )
    prepared["score"] = int(prepared["score"])
    return prepared


def validate_user(document: dict) -> dict:
    """Validate a user document placeholder."""
    prepared = with_timestamps(document)
    require_fields(prepared, ["user_id"])
    return prepared


def validate_threat_intelligence(document: dict) -> dict:
    """Validate a threat intelligence document placeholder."""
    prepared = with_timestamps(document)
    require_fields(prepared, ["threat_id", "title", "risk"])
    return prepared


def validate_notification(document: dict) -> dict:
    """Validate a notification document placeholder."""
    prepared = with_timestamps(document)
    require_fields(prepared, ["notification_id", "message"])
    return prepared


def validate_feedback(document: dict) -> dict:
    """Validate a feedback document placeholder."""
    prepared = with_timestamps(document)
    require_fields(prepared, ["feedback_id", "message"])
    return prepared


def validate_audit_log(document: dict) -> dict:
    """Validate an audit log document placeholder."""
    prepared = with_timestamps(document)
    require_fields(prepared, ["audit_id", "action"])
    return prepared
