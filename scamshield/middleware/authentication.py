"""Authentication middleware."""

from functools import wraps

from flask import g, jsonify, request, session

from scamshield.services.auth_service import (
    AuthService,
    AuthenticationError,
    ExpiredTokenError,
    TokenError,
)


def require_authentication(view_func):
    """Require a valid Bearer JWT or existing legacy session."""

    @wraps(view_func)
    def wrapper(*args, **kwargs):
        if session.get("authenticated"):
            g.current_user = session.get("user")
            return view_func(*args, **kwargs)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            request_started_without_auth()
            return unauthorized("Authentication is required")

        token = auth_header.removeprefix("Bearer ").strip()
        if not token:
            request_started_without_auth()
            return unauthorized("Authentication is required")

        try:
            g.current_user = AuthService.get_current_user(token)
        except ExpiredTokenError:
            request_started_with_expired_token()
            return unauthorized("Token has expired")
        except (TokenError, AuthenticationError):
            request_started_with_invalid_token()
            return unauthorized("Invalid token")

        return view_func(*args, **kwargs)

    return wrapper


def unauthorized(message: str):
    """Return a standard unauthorized response."""
    return jsonify({"success": False, "error": message, "details": {}}), 401


def request_started_without_auth() -> None:
    """Log a missing-credentials access attempt."""
    current_logger().warning("unauthorized_access path=%s", request.path)


def request_started_with_invalid_token() -> None:
    """Log an invalid token attempt without logging token contents."""
    current_logger().warning("invalid_jwt path=%s", request.path)


def request_started_with_expired_token() -> None:
    """Log an expired token attempt without logging token contents."""
    current_logger().warning("expired_jwt path=%s", request.path)


def current_logger():
    """Return the current app logger lazily to avoid circular imports."""
    from flask import current_app

    return current_app.logger
