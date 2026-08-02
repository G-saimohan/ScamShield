"""JWT access-token helpers."""

from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

import jwt
from flask import current_app


class TokenError(ValueError):
    """Raised when a JWT cannot be trusted."""


class ExpiredTokenError(TokenError):
    """Raised when a JWT is expired."""


def generate_access_token(user: dict) -> str:
    """Generate a signed JWT access token for a user."""
    issued_at = datetime.now(timezone.utc)
    expiration = issued_at + timedelta(
        minutes=current_app.config["JWT_EXPIRATION_MINUTES"]
    )
    payload = {
        "sub": user["user_id"],
        "user_id": user["user_id"],
        "email": user["email"],
        "role": user["role"],
        "jti": str(uuid4()),
        "token_type": "access",
        "iat": issued_at,
        "exp": expiration,
        "issued_at": issued_at.isoformat(),
        "expiration": expiration.isoformat(),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def generate_refresh_token(user: dict) -> str:
    """Generate a signed, long-lived JWT refresh token for a user."""
    issued_at = datetime.now(timezone.utc)
    expiration = issued_at + timedelta(
        days=current_app.config["JWT_REFRESH_EXPIRATION_DAYS"]
    )
    payload = {
        "sub": user["user_id"],
        "user_id": user["user_id"],
        "role": user["role"],
        "jti": str(uuid4()),
        "token_type": "refresh",
        "iat": issued_at,
        "exp": expiration,
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def generate_password_reset_token(user: dict) -> str:
    """Generate a short-lived, single-use JWT for confirming a password reset."""
    issued_at = datetime.now(timezone.utc)
    expiration = issued_at + timedelta(
        minutes=current_app.config["PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES"]
    )
    payload = {
        "sub": user["user_id"],
        "user_id": user["user_id"],
        "role": user["role"],
        "jti": str(uuid4()),
        "token_type": "password_reset",
        "iat": issued_at,
        "exp": expiration,
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Decode and validate a signed JWT access token."""
    payload = _decode(token)
    if payload.get("token_type") != "access":
        raise TokenError("Token is not an access token")
    return payload


def decode_refresh_token(token: str) -> dict:
    """Decode and validate a signed JWT refresh token."""
    payload = _decode(token)
    if payload.get("token_type") != "refresh":
        raise TokenError("Token is not a refresh token")
    return payload


def decode_password_reset_token(token: str) -> dict:
    """Decode and validate a signed JWT password reset token."""
    payload = _decode(token)
    if payload.get("token_type") != "password_reset":
        raise TokenError("Token is not a password reset token")
    return payload


def _decode(token: str) -> dict:
    """Decode and validate any signed ScamShield JWT."""
    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
            options={"require": ["sub", "role", "exp", "iat", "jti"]},
        )
        validate_claims(payload)
        return payload
    except jwt.ExpiredSignatureError as error:
        raise ExpiredTokenError("Token has expired") from error
    except jwt.InvalidTokenError as error:
        raise TokenError("Invalid token") from error


def validate_claims(payload: dict) -> None:
    """Validate required ScamShield JWT claims."""
    if not isinstance(payload.get("sub"), str) or not payload["sub"]:
        raise TokenError("Invalid token subject")
    if not isinstance(payload.get("role"), str) or not payload["role"]:
        raise TokenError("Invalid token role")
    if not isinstance(payload.get("jti"), str):
        raise TokenError("Invalid token id")
    try:
        UUID(payload["jti"])
    except ValueError as error:
        raise TokenError("Invalid token id") from error
