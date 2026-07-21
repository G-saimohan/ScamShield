"""Repository-level exceptions."""


class RepositoryError(RuntimeError):
    """Base exception for persistence failures."""


class DatabaseConnectionError(RepositoryError):
    """Raised when MongoDB cannot be reached."""


class DatabaseTimeoutError(RepositoryError):
    """Raised when a database operation times out."""


class DuplicateRecordError(RepositoryError):
    """Raised when a unique database constraint is violated."""


class RepositoryValidationError(RepositoryError):
    """Raised when a document fails repository schema validation."""
