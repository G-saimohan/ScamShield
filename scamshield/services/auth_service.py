"""Authentication business logic."""

from flask import current_app, session


class AuthService:
    """Session-backed demo authentication service."""

    @staticmethod
    def is_authenticated() -> bool:
        """Return whether the current session is authenticated."""
        return bool(session.get("authenticated"))

    @classmethod
    def status(cls) -> dict:
        """Return session authentication details."""
        return {"authenticated": cls.is_authenticated(), "user": session.get("user")}

    @staticmethod
    def login(payload: dict) -> tuple[dict, int]:
        """Validate demo credentials and create a session."""
        email = (payload.get("email") or "").strip().lower()
        password = (payload.get("password") or "").strip()

        if (
            email == current_app.config["DEMO_EMAIL"]
            and password == current_app.config["DEMO_PASSWORD"]
        ):
            session["authenticated"] = True
            session["user"] = {"email": email, "name": "Demo Analyst"}
            return {"success": True, "message": "Signed in successfully"}, 200

        current_app.logger.warning("Failed login attempt for email=%s", email or "<empty>")
        return {"error": "Invalid credentials"}, 401

    @staticmethod
    def logout() -> dict:
        """Clear the current user session."""
        session.clear()
        return {"success": True}
