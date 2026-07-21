"""Authentication routes."""

from flask import Blueprint

from scamshield.controllers.auth_controller import (
    auth_status,
    current_user,
    login,
    login_user,
    logout,
    logout_user,
    register_user,
)
from scamshield.middleware.authentication import require_authentication

auth_bp = Blueprint("auth", __name__)

auth_bp.add_url_rule("/api/auth-status", view_func=auth_status, methods=["GET"])
auth_bp.add_url_rule("/api/login", view_func=login, methods=["POST"])
auth_bp.add_url_rule("/api/logout", view_func=logout, methods=["POST"])
auth_bp.add_url_rule("/api/auth/register", view_func=register_user, methods=["POST"])
auth_bp.add_url_rule("/api/auth/login", view_func=login_user, methods=["POST"])
auth_bp.add_url_rule(
    "/api/auth/me",
    view_func=require_authentication(current_user),
    methods=["GET"],
)
auth_bp.add_url_rule(
    "/api/auth/logout",
    view_func=require_authentication(logout_user),
    methods=["POST"],
)
