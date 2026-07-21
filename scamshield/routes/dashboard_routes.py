"""Dashboard and report routes."""

from flask import Blueprint

from scamshield.controllers.dashboard_controller import dashboard, report_scam
from scamshield.middleware.authentication import require_authentication

dashboard_bp = Blueprint("dashboard", __name__)

dashboard_bp.add_url_rule(
    "/api/dashboard",
    view_func=require_authentication(dashboard),
    methods=["GET"],
)
dashboard_bp.add_url_rule("/api/report", view_func=report_scam, methods=["POST"])
