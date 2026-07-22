"""Threat intelligence business logic."""

from urllib.parse import urlparse

from flask import current_app

from scamshield.repositories.threat_intelligence_repository import (
    ThreatIntelligenceRepository,
)
from scamshield.utils.time import utc_now


class ThreatIntelligenceService:
    """Manage domain-level threat intelligence records."""

    @staticmethod
    def extract_domain(url: str) -> str:
        """Extract and normalize the hostname from a URL."""
        parsed = urlparse(url if "://" in url else f"http://{url}")
        return (parsed.hostname or "").lower().strip(".")

    @classmethod
    def get_domain(cls, domain: str) -> dict | None:
        """Return a threat intelligence record by domain."""
        return ThreatIntelligenceRepository.find_by_domain(domain)

    @classmethod
    def list_top(cls, limit: int = 10) -> list[dict]:
        """Return top risky threat intelligence records."""
        return ThreatIntelligenceRepository.list_top(limit=limit)

    @classmethod
    def record_url_scan(
        cls,
        domain: str,
        analysis: dict,
        existing: dict | None = None,
    ) -> dict:
        """Create or update threat intelligence for a completed URL scan."""
        previous_scans = int(existing["scan_count"]) if existing else 0
        now = utc_now()

        if existing:
            updated = cls._update_existing_record(existing, analysis, now)
            known_domain = True
        else:
            updated = cls._create_new_record(domain, analysis, now)
            known_domain = False

        current_app.logger.info(
            "threat_intelligence_recorded domain=%s scan_count=%s risk=%s",
            domain,
            updated["scan_count"],
            analysis["risk_score"],
        )
        return cls._response_summary(updated, known_domain, previous_scans)

    @classmethod
    def _create_new_record(cls, domain: str, analysis: dict, now: str) -> dict:
        record = {
            "domain": domain,
            "first_seen": now,
            "last_seen": now,
            "scan_count": 1,
            "average_risk": float(analysis["risk_score"]),
            "highest_risk": int(analysis["risk_score"]),
            "classification": analysis["classification"],
            "confidence": int(analysis["confidence"]),
            "reputation": cls._reputation_for_score(analysis["risk_score"]),
            "reasons": analysis["reasons"],
        }
        return ThreatIntelligenceRepository.create_domain_record(record)

    @classmethod
    def _update_existing_record(cls, existing: dict, analysis: dict, now: str) -> dict:
        previous_count = int(existing["scan_count"])
        new_count = previous_count + 1
        risk_score = int(analysis["risk_score"])
        previous_average = float(existing["average_risk"])
        average_risk = round(
            ((previous_average * previous_count) + risk_score) / new_count,
            2,
        )
        highest_risk = max(int(existing["highest_risk"]), risk_score)
        classification = existing["classification"]
        if risk_score >= int(existing["highest_risk"]):
            classification = analysis["classification"]

        updates = {
            "last_seen": now,
            "scan_count": new_count,
            "average_risk": average_risk,
            "highest_risk": highest_risk,
            "classification": classification,
            "confidence": cls._average_confidence(existing, analysis, new_count),
            "reputation": cls._reputation_for_score(highest_risk),
            "reasons": cls._merge_reasons(existing.get("reasons", []), analysis["reasons"]),
            "updated_at": now,
        }
        return ThreatIntelligenceRepository.update_domain_record(
            existing["domain"],
            updates,
        )

    @staticmethod
    def _average_confidence(existing: dict, analysis: dict, new_count: int) -> int:
        previous_count = new_count - 1
        previous_confidence = int(existing.get("confidence", 0))
        confidence = int(analysis["confidence"])
        return round(((previous_confidence * previous_count) + confidence) / new_count)

    @staticmethod
    def _merge_reasons(existing_reasons: list[str], new_reasons: list[str]) -> list[str]:
        merged = []
        for reason in [*new_reasons, *existing_reasons]:
            if reason not in merged:
                merged.append(reason)
        return merged[:25]

    @staticmethod
    def _reputation_for_score(score: int | float) -> str:
        if score >= 65:
            return "Bad"
        if score >= 40:
            return "Suspicious"
        if score >= 20:
            return "Unknown"
        return "Good"

    @staticmethod
    def _response_summary(
        record: dict,
        known_domain: bool,
        previous_scans: int,
    ) -> dict:
        return {
            "known_domain": known_domain,
            "previous_scans": previous_scans,
            "average_risk": record["average_risk"],
            "highest_risk": record["highest_risk"],
            "reputation": record["reputation"],
            "first_seen": record["first_seen"],
            "last_seen": record["last_seen"],
        }
