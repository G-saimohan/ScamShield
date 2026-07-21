"""In-memory login rate limiting."""

from datetime import datetime, timedelta, timezone

from flask import current_app

_failed_login_attempts: dict[str, list[datetime]] = {}


class LoginRateLimitExceeded(ValueError):
    """Raised when an email exceeds the failed login limit."""


def check_login_rate_limit(email: str) -> None:
    """Raise when an email has too many failed attempts in the active window."""
    normalized_email = email.strip().lower()
    attempts = _active_attempts(normalized_email)
    if len(attempts) >= current_app.config["LOGIN_MAX_FAILED_ATTEMPTS"]:
        current_app.logger.warning(
            "login_rate_limited email=%s timestamp=%s",
            normalized_email,
            datetime.now(timezone.utc).isoformat(),
        )
        raise LoginRateLimitExceeded(
            "Too many login attempts. Please try again later."
        )


def record_failed_login(email: str) -> None:
    """Record a failed login attempt for an email."""
    normalized_email = email.strip().lower()
    attempts = _active_attempts(normalized_email)
    attempts.append(datetime.now(timezone.utc))
    _failed_login_attempts[normalized_email] = attempts


def reset_login_attempts(email: str) -> None:
    """Clear failed login attempts after a successful login."""
    _failed_login_attempts.pop(email.strip().lower(), None)


def _active_attempts(email: str) -> list[datetime]:
    """Return attempts still inside the configured window."""
    cutoff = datetime.now(timezone.utc) - timedelta(
        minutes=current_app.config["LOGIN_RATE_LIMIT_WINDOW_MINUTES"]
    )
    attempts = [
        attempted_at
        for attempted_at in _failed_login_attempts.get(email, [])
        if attempted_at >= cutoff
    ]
    _failed_login_attempts[email] = attempts
    return attempts
