"""Generic MongoDB repository for auxiliary collections."""

from uuid import uuid4

from flask import current_app

from scamshield.repositories.base_repository import (
    handle_repository_error,
    public_document,
)
from scamshield.repositories.database import get_collection
from scamshield.repositories.schemas import with_timestamps


class GenericMongoRepository:
    """Shared create/list/update/delete behavior for simple collections."""

    collection_name = ""
    id_field = "id"
    validator = staticmethod(lambda document: document)

    @classmethod
    def create(cls, document: dict) -> dict:
        """Validate and insert a document."""
        prepared = dict(document)
        prepared.setdefault(cls.id_field, f"{cls.id_field}-{uuid4()}")
        prepared = cls.validator(prepared)
        try:
            get_collection(cls.collection_name).insert_one(prepared)
            current_app.logger.info(
                "document_inserted collection=%s %s=%s",
                cls.collection_name,
                cls.id_field,
                prepared[cls.id_field],
            )
            return public_document(prepared)
        except Exception as error:
            current_app.logger.exception(
                "document_insert_failed collection=%s", cls.collection_name
            )
            handle_repository_error(error)

    @classmethod
    def list_recent(cls, limit: int = 20) -> list[dict]:
        """Return recent documents from the collection."""
        try:
            cursor = (
                get_collection(cls.collection_name)
                .find({}, {"_id": 0})
                .sort("created_at", -1)
                .limit(limit)
            )
            return [public_document(item) for item in cursor]
        except Exception as error:
            current_app.logger.exception(
                "document_list_failed collection=%s", cls.collection_name
            )
            handle_repository_error(error)

    @classmethod
    def update(cls, document_id: str, updates: dict) -> None:
        """Update a document by its public id field."""
        try:
            get_collection(cls.collection_name).update_one(
                {cls.id_field: document_id},
                {"$set": with_timestamps(updates, is_update=True)},
            )
            current_app.logger.info(
                "document_updated collection=%s %s=%s",
                cls.collection_name,
                cls.id_field,
                document_id,
            )
        except Exception as error:
            current_app.logger.exception(
                "document_update_failed collection=%s", cls.collection_name
            )
            handle_repository_error(error)

    @classmethod
    def delete(cls, document_id: str) -> None:
        """Delete a document by its public id field."""
        try:
            get_collection(cls.collection_name).delete_one({cls.id_field: document_id})
            current_app.logger.info(
                "document_deleted collection=%s %s=%s",
                cls.collection_name,
                cls.id_field,
                document_id,
            )
        except Exception as error:
            current_app.logger.exception(
                "document_delete_failed collection=%s", cls.collection_name
            )
            handle_repository_error(error)
