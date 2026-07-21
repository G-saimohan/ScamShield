"""HTTP controllers for scanning workflows."""

from flask import jsonify, request

from scamshield.services.scan_service import ScanService
from scamshield.validators.scan_validator import (
    validate_content_payload,
    validate_file_upload,
    validate_media_upload,
    validate_url_payload,
)


def check_url():
    """Analyze a submitted URL."""
    payload = validate_url_payload(request.get_json(silent=True) or {})
    return jsonify(ScanService.check_url(payload["url"]))


def analyze_scam():
    """Analyze submitted text content."""
    payload = validate_content_payload(request.get_json(silent=True) or {})
    return jsonify(ScanService.analyze_content(payload["content"], payload["content_type"]))


def analyze_file():
    """Analyze an uploaded file with optional transcript text."""
    uploaded_file = validate_file_upload(request.files.get("file"))
    result = ScanService.analyze_file(
        uploaded_file=uploaded_file,
        content_type=request.form.get("content_type", "file"),
        transcript=request.form.get("transcript", ""),
    )
    return jsonify(result)


def analyze_media():
    """Analyze an uploaded image or video."""
    uploaded_file = validate_media_upload(request.files.get("file"))
    result = ScanService.analyze_media(
        uploaded_file=uploaded_file,
        width=request.form.get("width", type=int),
        height=request.form.get("height", type=int),
        duration=request.form.get("duration", type=float),
    )
    return jsonify(result)
