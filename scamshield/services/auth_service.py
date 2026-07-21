"""Authentication business logic."""

from uuid import uuid4

from flask import current_app, session

from scamshield.repositories.exceptions import DuplicateRecordError
from scamshield.repositories.user_repository import UserRepository
from scamshield.security.jwt_tokens import (
    ExpiredTokenError,
    TokenError,
    decode_access_token,
    generate_access_token,
)
from scamshield.security.passwords import hash_password, verify_password


class AuthenticationError(ValueError):
    """Raised when authentication fails."""


class AuthService:
    """Authentication service for JWT users and legacy demo sessions."""

    @staticmethod
    def is_authenticated() -> bool:
        """Return whether the current legacy session is authenticated."""
        return bool(session.get("authenticated"))

    @classmethod
    def status(cls) -> dict:
        """Return legacy session authentication details."""
        return {"authenticated": cls.is_authenticated(), "user": session.get("user")}

    @staticmethod
    def login(payload: dict) -> tuple[dict, int]:
        """Validate demo credentials and create a legacy session."""
        email = (payload.get("email") or "").strip().lower()
        password = (payload.get("password") or "").strip()

        if (
            email == current_app.config["DEMO_EMAIL"]
            and password == current_app.config["DEMO_PASSWORD"]
        ):
            session["authenticated"] = True
            session["user"] = {"email": email, "name": "Demo Analyst", "role": "admin"}
            return {"success": True, "message": "Signed in successfully"}, 200

        current_app.logger.warning(
            "legacy_failed_login email=%s", email or "<empty>"
        )
        return {"error": "Invalid credentials"}, 401

    @staticmethod
    def logout() -> dict:
        """Clear the current legacy session."""
        session.clear()
        return {"success": True}

    @classmethod
    def register(cls, payload: dict) -> dict:
        """Register a new active user and return an access token."""
        password_hash = cls.hash_password(payload["password"])
        user = UserRepository.create(
            {
                "user_id": f"user-{uuid4()}",
                "username": payload["username"],
                "email": payload["email"],
                "password_hash": password_hash,
                "role": "user",
                "is_active": True,
                "last_login": None,
            }
        )
        token = cls.generate_access_token(user)
        current_app.logger.info("user_registered user_id=%s", user["user_id"])
        return {
            "success": True,
            "message": "Registration successful",
            "data": {"user": cls._public_user(user), "access_token": token},
        }

    @classmethod
    def login_with_password(cls, payload: dict) -> dict:
        """Authenticate a user with email and password."""
        user = UserRepository.find_by_email(payload["email"])
        if not user:
            current_app.logger.warning("failed_login email=%s", payload["email"])
            raise AuthenticationError("Invalid email or password")

        if not user.get("is_active", True):
            current_app.logger.warning("inactive_user_login user_id=%s", user["user_id"])
            raise AuthenticationError("User account is inactive")

        if not cls.verify_password(payload["password"], user.get("password_hash", "")):
            current_app.logger.warning("failed_login email=%s", payload["email"])
            raise AuthenticationError("Invalid email or password")

        user["last_login"] = UserRepository.update_last_login(user["user_id"])
        token = cls.generate_access_token(user)
        current_app.logger.info("user_login_success user_id=%s", user["user_id"])
        return {
            "success": True,
            "message": "Login successful",
            "data": {"user": cls._public_user(user), "access_token": token},
        }

    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify an access token and return its payload."""
        return decode_access_token(token)

    @classmethod
    def get_current_user(cls, token: str) -> dict:
        """Return the active user represented by a token."""
        payload = cls.verify_token(token)
        user = UserRepository.find_by_id(payload["user_id"])
        if not user:
            raise AuthenticationError("User not found")
        if not user.get("is_active", True):
            raise AuthenticationError("User account is inactive")
        return cls._public_user(user)

    @staticmethod
    def generate_access_token(user: dict) -> str:
        """Generate a JWT access token for a user."""
        return generate_access_token(user)

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plaintext password."""
        return hash_password(password)

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify a plaintext password against a stored hash."""
        return verify_password(password, password_hash)

    @staticmethod
    def logout_token() -> dict:
        """Return a client-side logout acknowledgement for stateless JWTs."""
        return {"success": True, "message": "Logged out successfully", "data": {}}

    @staticmethod
    def duplicate_response(error: DuplicateRecordError) -> tuple[dict, int]:
        """Return a structured duplicate registration response."""
        return {
            "success": False,
            "error": str(error),
            "details": {},
        }, 409

    @staticmethod
    def _public_user(user: dict) -> dict:
        """Return user fields safe for API responses."""
        return {
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "role": user.get("role", "user"),
            "is_active": user.get("is_active", True),
            "created_at": user.get("created_at"),
            "updated_at": user.get("updated_at"),
            "last_login": user.get("last_login"),
        }


__all__ = [
    "AuthService",
    "AuthenticationError",
    "DuplicateRecordError",
    "ExpiredTokenError",
    "TokenError",
]
