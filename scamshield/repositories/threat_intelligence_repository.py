"""Threat intelligence collection repository."""

from scamshield.repositories.database import COLLECTIONS
from scamshield.repositories.generic_repository import GenericMongoRepository
from scamshield.repositories.schemas import validate_threat_intelligence


class ThreatIntelligenceRepository(GenericMongoRepository):
    """Repository for threat intelligence documents."""

    collection_name = COLLECTIONS["threat_intelligence"]
    id_field = "threat_id"
    validator = staticmethod(validate_threat_intelligence)
