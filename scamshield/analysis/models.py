"""Explanation data models."""

from dataclasses import dataclass


@dataclass(slots=True)
class ThreatExplanation:
    """Structured threat explanation returned to API clients."""

    summary: str
    key_findings: list[str]
    recommendations: list[str]
    confidence_explanation: str

    def to_dict(self) -> dict:
        """Return API-ready dictionary form."""
        return {
            "summary": self.summary,
            "key_findings": self.key_findings,
            "recommendations": self.recommendations,
            "confidence_explanation": self.confidence_explanation,
        }
