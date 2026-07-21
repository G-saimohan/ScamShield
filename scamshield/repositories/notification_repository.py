"""Notification collection repository."""

from scamshield.repositories.database import COLLECTIONS
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.schemas import validate_notification


class NotificationRepository(GenericMongoRepository):
    """Repository for notification documents."""

    collection_name = COLLECTIONS["notifications"]
    id_field = "notification_id"
    validator = staticmethod(validate_notification)
