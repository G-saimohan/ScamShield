"""User collection repository placeholder."""

from flask import current_app

from scamshield.repositories.base_repository import (
    handle_repository_error,
    public_document,
)
from scamshield.repositories.database import COLLECTIONS, get_collection
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.exceptions import DuplicateRecordError
from scamshield.repositories.schemas import validate_user
from scamshield.utils.time import utc_now


class UserRepository(GenericMongoRepository):
    """Repository for the users collection."""

    collection_name = COLLECTIONS["users"]
    id_field = "user_id"
    validator = staticmethod(validate_user)

    @classmethod
    def create(cls, document: dict) -> dict:
        """Create a user after enforcing unique email and username."""
        email = (document.get("email") or "").strip().lower()
        username = (document.get("username") or "").strip()
        document["email"] = email
        document["username"] = username

        existing_email_user = cls.find_by_email(email) if email else None
        if existing_email_user and existing_email_user.get("email") == email:
            raise DuplicateRecordError("Email is already registered")

        existing_username_user = cls.find_by_username(username) if username else None
        if (
            existing_username_user
            and existing_username_user.get("username") == username
        ):
            raise DuplicateRecordError("Username is already registered")

        return super().create(document)

    @classmethod
    def find_by_email(cls, email: str) -> dict | None:
        """Return a user by email."""
        return cls._find_one({"email": email.strip().lower()})

    @classmethod
    def find_by_username(cls, username: str) -> dict | None:
        """Return a user by username."""
        return cls._find_one({"username": username.strip()})

    @classmethod
    def find_by_id(cls, user_id: str) -> dict | None:
        """Return a user by user_id."""
        return cls._find_one({"user_id": user_id})

    @classmethod
    def update_last_login(cls, user_id: str) -> str:
        """Update a user's last_login timestamp."""
        try:
            now = utc_now()
            get_collection(cls.collection_name).update_one(
                {"user_id": user_id},
                {"$set": {"last_login": now, "updated_at": now}},
            )
            current_app.logger.info("user_last_login_updated user_id=%s", user_id)
            return now
        except Exception as error:
            current_app.logger.exception("user_last_login_update_failed")
            handle_repository_error(error)

    @classmethod
    def _find_one(cls, filter_query: dict) -> dict | None:
        """Return one user document matching the filter."""
        try:
            cursor = get_collection(cls.collection_name).find(filter_query, {"_id": 0})
            for document in cursor.limit(1):
                return public_document(document)
            return None
        except Exception as error:
            current_app.logger.exception("user_lookup_failed")
            handle_repository_error(error)
