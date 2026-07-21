"""HTTP controllers for authentication."""

from flask import jsonify, request

from scamshield.services.auth_service import AuthService


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
