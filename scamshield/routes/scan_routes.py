"""Scan and analysis routes."""

from flask import Blueprint

from scamshield.controllers.scan_controller import (
    analyze_file,
    analyze_media,
    analyze_scam,
    check_url,
    delete_scan,
    scan_history,
    scan_url,
)
from scamshield.middleware.authentication import login_required

scan_bp = Blueprint("scan", __name__)

scan_bp.add_url_rule("/check-url", view_func=check_url, methods=["POST"])
scan_bp.add_url_rule("/api/check-url", view_func=check_url, methods=["POST"])
scan_bp.add_url_rule("/api/analyze", view_func=analyze_scam, methods=["POST"])
scan_bp.add_url_rule("/api/analyze-file", view_func=analyze_file, methods=["POST"])
scan_bp.add_url_rule("/api/analyze-media", view_func=analyze_media, methods=["POST"])
scan_bp.add_url_rule(
    "/api/scan/url",
    view_func=login_required(scan_url),
    methods=["POST"],
)
scan_bp.add_url_rule(
    "/api/scans/history",
    view_func=login_required(scan_history),
    methods=["GET"],
)
scan_bp.add_url_rule(
    "/api/scans/<scan_id>",
    view_func=login_required(delete_scan),
    methods=["DELETE"],
)
