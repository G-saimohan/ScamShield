"""Threat intelligence collection repository."""

from uuid import uuid4

from flask import current_app

from scamshield.repositories.base_repository import (
    handle_repository_error,
    public_document,
)
from scamshield.repositories.database import COLLECTIONS, get_collection
from scamshield.repositories.schemas import validate_threat_intelligence


class ThreatIntelligenceRepository:
    """Repository for domain threat intelligence documents."""

    collection_name = COLLECTIONS["threat_intelligence"]

    @classmethod
    def find_by_domain(cls, domain: str) -> dict | None:
        """Return threat intelligence for a domain."""
        try:
            cursor = get_collection(cls.collection_name).find(
                {"domain": domain.lower()},
                {"_id": 0},
            )
            for document in cursor.limit(1):
                return public_document(document)
            return None
        except Exception as error:
            current_app.logger.exception("threat_lookup_failed domain=%s", domain)
            handle_repository_error(error)

    @classmethod
    def create_domain_record(cls, record: dict) -> dict:
        """Create a new threat intelligence record."""
        document = validate_threat_intelligence(
            {
                "threat_id": record.get("threat_id") or f"threat-{uuid4()}",
                **record,
            }
        )
        try:
            get_collection(cls.collection_name).insert_one(document)
            current_app.logger.info(
                "threat_intelligence_created domain=%s risk=%s",
                document["domain"],
                document["highest_risk"],
            )
            return public_document(document)
        except Exception as error:
            current_app.logger.exception(
                "threat_intelligence_create_failed domain=%s",
                document.get("domain"),
            )
            handle_repository_error(error)

    @classmethod
    def update_domain_record(cls, domain: str, updates: dict) -> dict:
        """Update a threat intelligence record and return the updated document."""
        try:
            get_collection(cls.collection_name).update_one(
                {"domain": domain.lower()},
                {"$set": updates},
            )
            current_app.logger.info(
                "threat_intelligence_updated domain=%s scan_count=%s average_risk=%s",
                domain,
                updates.get("scan_count"),
                updates.get("average_risk"),
            )
            return cls.find_by_domain(domain) or {}
        except Exception as error:
            current_app.logger.exception(
                "threat_intelligence_update_failed domain=%s", domain
            )
            handle_repository_error(error)

    @classmethod
    def list_top(cls, limit: int = 10) -> list[dict]:
        """Return top risky domains by highest risk."""
        try:
            cursor = (
                get_collection(cls.collection_name)
                .find({}, {"_id": 0})
                .sort("highest_risk", -1)
                .limit(limit)
            )
            return [public_document(item) for item in cursor]
        except Exception as error:
            current_app.logger.exception("threat_intelligence_top_failed")
            handle_repository_error(error)
