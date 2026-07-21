"""Validators for scanning requests."""

from werkzeug.datastructures import FileStorage

from scamshield.validators.exceptions import ValidationError


def validate_url_payload(payload: dict) -> dict:
    """Validate URL analysis input."""
    url = (payload.get("url") or "").strip()
    if not url:
        raise ValidationError("URL is required")
    return {"url": url}


def validate_content_payload(payload: dict) -> dict:
    """Validate text analysis input."""
    content = (payload.get("content") or "").strip()
    content_type = (payload.get("content_type") or "message").strip() or "message"
    if not content:
        raise ValidationError("Content is required")
    return {"content": content, "content_type": content_type}


def validate_file_upload(uploaded_file: FileStorage | None) -> FileStorage:
    """Validate generic file upload input."""
    if not uploaded_file:
        raise ValidationError("File is required")
    return uploaded_file


def validate_media_upload(uploaded_file: FileStorage | None) -> FileStorage:
    """Validate media upload input."""
    if not uploaded_file:
        raise ValidationError("Image or video file is required")
    return uploaded_file
