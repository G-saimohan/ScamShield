"""Shared MongoDB repository helpers."""

from scamshield.repositories.exceptions import (
    DatabaseTimeoutError,
    DuplicateRecordError,
    RepositoryError,
)

try:
    from pymongo.errors import DuplicateKeyError, ExecutionTimeout, PyMongoError
except ImportError:  # pragma: no cover - exercised when dependencies are absent.
    DuplicateKeyError = type("DuplicateKeyError", (Exception,), {})
    ExecutionTimeout = type("ExecutionTimeout", (Exception,), {})
    PyMongoError = type("PyMongoError", (Exception,), {})


def handle_repository_error(error: Exception) -> None:
    """Translate PyMongo errors into application repository exceptions."""
    if isinstance(error, DuplicateKeyError):
        raise DuplicateRecordError("Duplicate record") from error
    if isinstance(error, ExecutionTimeout):
        raise DatabaseTimeoutError("Database operation timed out") from error
    if isinstance(error, PyMongoError):
        raise RepositoryError("Database operation failed") from error
    raise error


def public_document(document: dict) -> dict:
    """Remove MongoDB internal fields from a document."""
    item = dict(document)
    item.pop("_id", None)
    return item
