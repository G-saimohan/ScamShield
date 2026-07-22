"""Prompt construction for threat explanations."""


class PromptBuilder:
    """Build provider-neutral explanation prompts."""

    @staticmethod
    def build(scan_result: dict, threat_intelligence: dict) -> dict:
        """Build a structured prompt from scan and intelligence facts."""
        return {
            "url": scan_result["url"],
            "risk_score": scan_result["risk_score"],
            "classification": scan_result["classification"],
            "reasons": scan_result["reasons"],
            "confidence": scan_result["confidence"],
            "threat_intelligence": threat_intelligence,
        }
