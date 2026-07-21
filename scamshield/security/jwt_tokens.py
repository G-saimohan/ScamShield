"""JWT access-token helpers."""

from datetime import datetime, timedelta, timezone

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
        "user_id": user["user_id"],
        "email": user["email"],
        "role": user["role"],
        "iat": issued_at,
        "exp": expiration,
        "issued_at": issued_at.isoformat(),
        "expiration": expiration.isoformat(),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Decode and validate a signed JWT access token."""
    try:
        return jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
        )
    except jwt.ExpiredSignatureError as error:
        raise ExpiredTokenError("Token has expired") from error
    except jwt.InvalidTokenError as error:
        raise TokenError("Invalid token") from error
