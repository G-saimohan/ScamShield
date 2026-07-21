"""Password hashing helpers."""

import hmac

import bcrypt
from flask import current_app


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    rounds = current_app.config["BCRYPT_ROUNDS"]
    salt = bcrypt.gensalt(rounds=rounds)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    if not password or not password_hash:
        return False
    try:
        candidate = bcrypt.hashpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except ValueError:
        return False
    return hmac.compare_digest(candidate.decode("utf-8"), password_hash)
