"""HTTP controllers for authentication."""

from flask import g, jsonify, request

from scamshield.repositories.exceptions import DuplicateRecordError
from scamshield.services.auth_service import (
    AuthService,
    AuthenticationError,
    TooManyLoginAttemptsError,
)
from scamshield.validators.auth_validator import (
    validate_login_payload,
    validate_password_reset_confirm_payload,
    validate_password_reset_request_payload,
    validate_registration_payload,
)


def auth_status():
    """Return the current session authentication state."""
    return jsonify(AuthService.status())


def login():
    """Authenticate a demo analyst session."""
    payload = request.get_json(silent=True) or {}
    result, status_code = AuthService.login(payload)
    return jsonify(result), status_code


def logout():
    """Clear the active session."""
    return jsonify(AuthService.logout())


def register_user():
    """Register a new JWT-authenticated user."""
    payload = validate_registration_payload(request.get_json(silent=True) or {})
    try:
        return jsonify(AuthService.register(payload)), 201
    except DuplicateRecordError as error:
        response, status_code = AuthService.duplicate_response(error)
        return jsonify(response), status_code


def login_user():
    """Authenticate a JWT user with email and password."""
    payload = validate_login_payload(request.get_json(silent=True) or {})
    try:
        return jsonify(AuthService.login_with_password(payload))
    except TooManyLoginAttemptsError:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Too many login attempts. Please try again later.",
                }
            ),
            429,
        )
    except AuthenticationError as error:
        return jsonify({"success": False, "error": str(error), "details": {}}), 401


def current_user():
    """Return the authenticated user loaded by middleware."""
    return jsonify(
        {
            "success": True,
            "message": "Current user loaded",
            "data": {"user": g.current_user},
        }
    )


def logout_user():
    """Revoke the presented JWT access token."""
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.removeprefix("Bearer ").strip()
    return jsonify(AuthService.logout_token(token))


def refresh_token():
    """Exchange a refresh token for a new access token."""
    payload = request.get_json(silent=True) or {}
    token = (payload.get("refresh_token") or "").strip()
    if not token:
        return (
            jsonify(
                {"success": False, "error": "refresh_token is required", "details": {}}
            ),
            400,
        )
    try:
        return jsonify(AuthService.refresh(token))
    except AuthenticationError as error:
        return jsonify({"success": False, "error": str(error), "details": {}}), 401


def request_password_reset():
    """Request a password reset link for an email address."""
    payload = validate_password_reset_request_payload(request.get_json(silent=True) or {})
    return jsonify(AuthService.request_password_reset(payload["email"]))


def confirm_password_reset():
    """Confirm a password reset using a token and new password."""
    payload = validate_password_reset_confirm_payload(request.get_json(silent=True) or {})
    try:
        return jsonify(
            AuthService.confirm_password_reset(payload["token"], payload["new_password"])
        )
    except AuthenticationError as error:
        return jsonify({"success": False, "error": str(error), "details": {}}), 401


def admin_check():
    """Return a simple RBAC verification response for admins."""
    return jsonify(
        {
            "success": True,
            "message": "Admin access granted",
            "data": {"user": g.current_user},
        }
    )
