"""Scan and analysis routes."""

from flask import Blueprint

from scamshield.controllers.scan_controller import (
    analyze_file,
    analyze_media,
    analyze_scam,
    check_url,
)

scan_bp = Blueprint("scan", __name__)

scan_bp.add_url_rule("/check-url", view_func=check_url, methods=["POST"])
scan_bp.add_url_rule("/api/check-url", view_func=check_url, methods=["POST"])
scan_bp.add_url_rule("/api/analyze", view_func=analyze_scam, methods=["POST"])
scan_bp.add_url_rule("/api/analyze-file", view_func=analyze_file, methods=["POST"])
scan_bp.add_url_rule("/api/analyze-media", view_func=analyze_media, methods=["POST"])
