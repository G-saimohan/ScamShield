"""User collection repository placeholder."""

from scamshield.repositories.database import COLLECTIONS
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.schemas import validate_user


class UserRepository(GenericMongoRepository):
    """Repository for the users collection."""

    collection_name = COLLECTIONS["users"]
    id_field = "user_id"
    validator = staticmethod(validate_user)
