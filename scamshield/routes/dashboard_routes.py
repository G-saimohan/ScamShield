"""Dashboard and report routes."""

from flask import Blueprint

from scamshield.controllers.dashboard_controller import (
    dashboard,
    dashboard_recent_scans,
    dashboard_risk_distribution,
    dashboard_summary,
    dashboard_threat_feed,
    report_scam,
)
from scamshield.middleware.authentication import login_required

dashboard_bp = Blueprint("dashboard", __name__)

dashboard_bp.add_url_rule(
    "/api/dashboard",
    view_func=login_required(dashboard),
    methods=["GET"],
)
dashboard_bp.add_url_rule(
    "/api/dashboard/summary",
    view_func=login_required(dashboard_summary),
    methods=["GET"],
)
dashboard_bp.add_url_rule(
    "/api/dashboard/recent-scans",
    view_func=login_required(dashboard_recent_scans),
    methods=["GET"],
)
dashboard_bp.add_url_rule(
    "/api/dashboard/risk-distribution",
    view_func=login_required(dashboard_risk_distribution),
    methods=["GET"],
)
dashboard_bp.add_url_rule(
    "/api/dashboard/threat-feed",
    view_func=login_required(dashboard_threat_feed),
    methods=["GET"],
)
dashboard_bp.add_url_rule("/api/report", view_func=report_scam, methods=["POST"])
