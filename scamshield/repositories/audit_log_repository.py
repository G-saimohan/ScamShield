"""Audit log collection repository."""

from scamshield.repositories.database import COLLECTIONS
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.schemas import validate_audit_log


class AuditLogRepository(GenericMongoRepository):
    """Repository for audit log documents."""

    collection_name = COLLECTIONS["audit_logs"]
    id_field = "audit_id"
    validator = staticmethod(validate_audit_log)
