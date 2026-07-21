"""HTTP controllers for dashboard data and reports."""

from flask import jsonify, request

from scamshield.services.dashboard_service import DashboardService
from scamshield.services.report_service import ReportService
from scamshield.validators.report_validator import validate_report_payload


def dashboard():
    """Return dashboard metrics and activity."""
    return jsonify(DashboardService.get_dashboard())


def report_scam():
    """Create a community scam report."""
    payload = request.get_json(silent=True) or {}
    validated = validate_report_payload(payload)
    result = ReportService.create_report(validated)
    return jsonify(result), 201
