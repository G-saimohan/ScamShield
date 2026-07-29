"""HTTP controllers for dashboard data and reports."""

from flask import jsonify, request

from scamshield.services.dashboard_service import DashboardService
from scamshield.services.report_service import ReportService
from scamshield.validators.report_validator import validate_report_payload


def dashboard():
    """Return dashboard metrics and activity."""
    return jsonify(DashboardService.get_dashboard())


def dashboard_summary():
    """Return dashboard summary metrics."""
    return jsonify({"success": True, "data": DashboardService.get_summary()})


def dashboard_recent_scans():
    """Return recent scan activity."""
    return jsonify({"success": True, "data": DashboardService.get_recent_scans()})


def dashboard_risk_distribution():
    """Return scan risk distribution."""
    return jsonify({"success": True, "data": DashboardService.get_risk_distribution()})


def dashboard_threat_feed():
    """Return threat intelligence feed records."""
    return jsonify({"success": True, "data": DashboardService.get_threat_feed()})


def report_scam():
    """Create a community scam report."""
    payload = request.get_json(silent=True) or {}
    validated = validate_report_payload(payload)
    result = ReportService.create_report(validated)
    return jsonify(result), 201
