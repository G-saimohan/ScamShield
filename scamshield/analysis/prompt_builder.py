"""Prompt construction for threat explanations."""


class PromptBuilder:
    """Build provider-neutral explanation prompts."""

    @staticmethod
    def build(scan_result: dict, threat_intelligence: dict) -> dict:
        """Build a structured prompt from scan and intelligence facts."""
        return {
            "url": scan_result.get("url"),
            "content_type": scan_result.get("content_type"),
            "risk_score": scan_result.get("risk_score")
            or scan_result.get("scam_probability")
            or scan_result.get("ai_likelihood")
            or scan_result.get("authenticity_score"),
            "classification": scan_result.get("classification")
            or scan_result.get("risk_level"),
            "summary": scan_result.get("summary"),
            "reasons": scan_result.get("reasons") or scan_result.get("indicators") or [],
            "confidence": scan_result.get("confidence"),
            "threat_intelligence": threat_intelligence or {},
        }
