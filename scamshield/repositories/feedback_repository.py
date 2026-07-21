"""Feedback collection repository."""

from scamshield.repositories.database import COLLECTIONS
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.schemas import validate_feedback


class FeedbackRepository(GenericMongoRepository):
    """Repository for feedback documents."""

    collection_name = COLLECTIONS["feedback"]
    id_field = "feedback_id"
    validator = staticmethod(validate_feedback)
