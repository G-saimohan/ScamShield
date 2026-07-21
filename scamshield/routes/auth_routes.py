"""Authentication routes."""

from flask import Blueprint

from scamshield.controllers.auth_controller import auth_status, login, logout

auth_bp = Blueprint("auth", __name__)

auth_bp.add_url_rule("/api/auth-status", view_func=auth_status, methods=["GET"])
auth_bp.add_url_rule("/api/login", view_func=login, methods=["POST"])
auth_bp.add_url_rule("/api/logout", view_func=logout, methods=["POST"])
