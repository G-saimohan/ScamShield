"""Dashboard orchestration logic backed by MongoDB collections."""

from collections import Counter
from datetime import UTC, datetime
from typing import Any

from scamshield.repositories.database import COLLECTIONS, get_collection
from scamshield.repositories.base_repository import public_document


class DashboardService:
    """Build dashboard responses for the frontend."""

    RECENT_SCAN_LIMIT = 8
    THREAT_FEED_LIMIT = 8

    @classmethod
    def get_dashboard(cls) -> dict:
        """Return the full dashboard payload for backward compatibility."""
        return {
            "success": True,
            "data": {
                "summary": cls.get_summary(),
                "recent_scans": cls.get_recent_scans(),
                "risk_distribution": cls.get_risk_distribution(),
                "threat_feed": cls.get_threat_feed(),
            },
        }

    @classmethod
    def get_summary(cls) -> dict:
        """Return dashboard summary counts from live collections."""
        scans = cls._list_scans()
        threats = cls._list_threats()
        total_scans = len(scans)
        threats_detected = sum(1 for scan in scans if cls._scan_score(scan) >= 40)
        safe_urls = sum(1 for scan in scans if cls._scan_score(scan) < 20)

        return {
            "total_scans": total_scans,
            "threats_detected": threats_detected,
            "safe_urls": safe_urls,
            "known_threats": len(threats),
        }

    @classmethod
    def get_recent_scans(cls, limit: int | None = None) -> list[dict]:
        """Return recent scan documents normalized for the dashboard."""
        cursor = (
            get_collection(COLLECTIONS["scans"])
            .find({}, {"_id": 0})
            .sort("created_at", -1)
            .limit(limit or cls.RECENT_SCAN_LIMIT)
        )
        return [cls._scan_payload(public_document(scan)) for scan in cursor]

    @classmethod
    def get_risk_distribution(cls) -> dict:
        """Return count of scans by risk bucket."""
        buckets = Counter(cls._risk_bucket(cls._scan_score(scan)) for scan in cls._list_scans())
        return {
            "safe": buckets.get("safe", 0),
            "low": buckets.get("low", 0),
            "medium": buckets.get("medium", 0),
            "high": buckets.get("high", 0),
            "critical": buckets.get("critical", 0),
        }

    @classmethod
    def get_threat_feed(cls, limit: int | None = None) -> list[dict]:
        """Return high-risk threat intelligence records for the dashboard feed."""
        cursor = (
            get_collection(COLLECTIONS["threat_intelligence"])
            .find({}, {"_id": 0})
            .sort("highest_risk", -1)
            .limit(limit or cls.THREAT_FEED_LIMIT)
        )
        return [cls._threat_payload(public_document(threat)) for threat in cursor]

    @staticmethod
    def _list_scans() -> list[dict]:
        return [
            public_document(scan)
            for scan in get_collection(COLLECTIONS["scans"]).find({}, {"_id": 0})
        ]

    @staticmethod
    def _list_threats() -> list[dict]:
        return [
            public_document(threat)
            for threat in get_collection(COLLECTIONS["threat_intelligence"]).find(
                {},
                {"_id": 0},
            )
        ]

    @classmethod
    def _scan_payload(cls, scan: dict[str, Any]) -> dict:
        score = cls._scan_score(scan)
        return {
            "scan_id": scan.get("scan_id", ""),
            "input": scan.get("input") or scan.get("url") or "Unknown resource",
            "kind": scan.get("kind") or ("URL" if scan.get("url") else "Resource"),
            "risk": scan.get("risk") or scan.get("classification") or cls._risk_label(score),
            "score": score,
            "created_at": scan.get("created_at"),
        }

    @classmethod
    def _threat_payload(cls, threat: dict[str, Any]) -> dict:
        score = int(threat.get("highest_risk") or threat.get("average_risk") or 0)
        return {
            "threat_id": threat.get("threat_id", ""),
            "domain": threat.get("domain") or "Unknown domain",
            "label": cls._threat_label(threat),
            "severity": cls._severity(score),
            "highest_risk": score,
            "average_risk": float(threat.get("average_risk") or 0),
            "scan_count": int(threat.get("scan_count") or 0),
            "classification": threat.get("classification") or cls._risk_label(score),
            "reputation": threat.get("reputation") or "Unknown",
            "last_seen": threat.get("last_seen"),
        }

    @staticmethod
    def _scan_score(scan: dict[str, Any]) -> int:
        score = scan.get("score", scan.get("risk_score", 0))
        try:
            return int(score)
        except (TypeError, ValueError):
            return 0

    @staticmethod
    def _risk_bucket(score: int) -> str:
        if score >= 80:
            return "critical"
        if score >= 60:
            return "high"
        if score >= 40:
            return "medium"
        if score >= 20:
            return "low"
        return "safe"

    @classmethod
    def _risk_label(cls, score: int) -> str:
        return cls._risk_bucket(score).replace("_", " ").title()

    @staticmethod
    def _severity(score: int) -> str:
        if score >= 80:
            return "critical"
        if score >= 60:
            return "high"
        if score >= 40:
            return "medium"
        return "low"

    @classmethod
    def _threat_label(cls, threat: dict[str, Any]) -> str:
        domain = threat.get("domain") or "Unknown domain"
        classification = threat.get("classification") or cls._risk_label(
            int(threat.get("highest_risk") or 0)
        )
        reputation = threat.get("reputation") or "Unknown"
        return f"{domain} classified as {classification} ({reputation})"

    @staticmethod
    def _parse_datetime(value: str | None) -> datetime | None:
        if not value:
            return None
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None

    @classmethod
    def scans_today(cls) -> int:
        """Return today's scan count in UTC."""
        today = datetime.now(UTC).date()
        return sum(
            1
            for scan in cls._list_scans()
            if (created_at := cls._parse_datetime(scan.get("created_at")))
            and created_at.date() == today
        )
