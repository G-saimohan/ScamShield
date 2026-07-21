"""Validators for community reports."""

from scamshield.validators.exceptions import ValidationError


def validate_report_payload(payload: dict) -> dict:
    """Validate and normalize a community report payload."""
    title = (payload.get("title") or "").strip()
    scam_type = (payload.get("type") or "Unknown").strip() or "Unknown"
    location = (payload.get("location") or "Unknown").strip() or "Unknown"
    description = (payload.get("description") or "").strip()

    if not title and not description:
        raise ValidationError("Report title or description is required")

    return {
        "title": title,
        "type": scam_type,
        "location": location,
        "description": description,
    }
