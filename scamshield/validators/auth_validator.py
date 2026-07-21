"""Validators for authentication requests."""

import re

from scamshield.validators.exceptions import ValidationError

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_registration_payload(payload: dict) -> dict:
    """Validate and normalize registration input."""
    username = (payload.get("username") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    details = {}
    if not username:
        details["username"] = "Username is required"
    if not email:
        details["email"] = "Email is required"
    elif not EMAIL_PATTERN.match(email):
        details["email"] = "Email must be valid"
    if not password:
        details["password"] = "Password is required"
    elif len(password) < 8:
        details["password"] = "Password must be at least 8 characters"

    if details:
        raise ValidationError(details)

    return {"username": username, "email": email, "password": password}


def validate_login_payload(payload: dict) -> dict:
    """Validate and normalize login input."""
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    details = {}
    if not email:
        details["email"] = "Email is required"
    elif not EMAIL_PATTERN.match(email):
        details["email"] = "Email must be valid"
    if not password:
        details["password"] = "Password is required"

    if details:
        raise ValidationError(details)

    return {"email": email, "password": password}
