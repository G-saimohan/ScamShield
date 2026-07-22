"""Threat intelligence routes."""

from flask import Blueprint

from scamshield.controllers.threat_controller import get_domain_threat, get_top_threats
from scamshield.middleware.authentication import login_required

threat_bp = Blueprint("threats", __name__)

threat_bp.add_url_rule(
    "/api/threats/domain/<domain>",
    view_func=login_required(get_domain_threat),
    methods=["GET"],
)
threat_bp.add_url_rule(
    "/api/threats/top",
    view_func=login_required(get_top_threats),
    methods=["GET"],
)
