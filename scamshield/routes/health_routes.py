"""Health and frontend routes."""

from flask import Blueprint

from scamshield.controllers.health_controller import health_check, index

health_bp = Blueprint("health", __name__)

health_bp.add_url_rule("/", view_func=index, methods=["GET"])
health_bp.add_url_rule("/api/health", view_func=health_check, methods=["GET"])
