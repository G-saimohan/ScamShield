"""HTTP controllers for authentication."""

from flask import g, jsonify, request

from scamshield.repositories.exceptions import DuplicateRecordError
from scamshield.services.auth_service import AuthService, AuthenticationError
from scamshield.validators.auth_validator import (
    validate_login_payload,
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
    """Acknowledge stateless JWT logout."""
    return jsonify(AuthService.logout_token())
