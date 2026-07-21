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
        "iat": issued_at,
        "exp": expiration,
        "issued_at": issued_at.isoformat(),
        "expiration": expiration.isoformat(),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Decode and validate a signed JWT access token."""
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
