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
    admin_check,
)
from scamshield.middleware.authentication import login_required, require_role

auth_bp = Blueprint("auth", __name__)

auth_bp.add_url_rule("/api/auth-status", view_func=auth_status, methods=["GET"])
auth_bp.add_url_rule("/api/login", view_func=login, methods=["POST"])
auth_bp.add_url_rule("/api/logout", view_func=logout, methods=["POST"])
auth_bp.add_url_rule("/api/auth/register", view_func=register_user, methods=["POST"])
auth_bp.add_url_rule("/api/auth/login", view_func=login_user, methods=["POST"])
auth_bp.add_url_rule(
    "/api/auth/me",
    view_func=login_required(current_user),
    methods=["GET"],
)
auth_bp.add_url_rule(
    "/api/auth/logout",
    view_func=login_required(logout_user),
    methods=["POST"],
)
auth_bp.add_url_rule(
    "/api/auth/admin-check",
    view_func=require_role("admin")(admin_check),
    methods=["GET"],
)
