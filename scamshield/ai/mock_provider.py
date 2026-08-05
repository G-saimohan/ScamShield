"""Deterministic mock LLM provider."""

from scamshield.ai.llm_provider import LLMProvider


class MockProvider(LLMProvider):
    """Generate deterministic explanations without external AI calls."""

    def generate_explanation(self, prompt: dict) -> dict:
        """Return a structured explanation from scan facts."""
        risk_score = prompt.get("risk_score")
        classification = prompt.get("classification")
        reasons = prompt.get("reasons", [])
        threat_intelligence = prompt.get("threat_intelligence", {})
        content_type = prompt.get("content_type")

        entity = (
            f"{content_type} scan"
            if content_type
            else "scan"
        )
        summary = (
            f"This {entity} is classified as {classification} with a risk score of "
            f"{risk_score}/100."
        )
        if threat_intelligence.get("known_domain"):
            summary += (
                " The domain has prior ScamShield intelligence and should be "
                "treated with additional caution."
            )

        recommendations = self._recommendations(classification, threat_intelligence)
        confidence = prompt.get("confidence")
        confidence_explanation = (
            f"Confidence is {confidence} because the result is based on "
            f"{len(reasons)} detection signal(s)"
        )
        if threat_intelligence.get("previous_scans", 0):
            confidence_explanation += (
                f" and {threat_intelligence['previous_scans']} previous scan(s)."
            )
        else:
            confidence_explanation += " and no previous domain history."

        return {
            "summary": summary,
            "key_findings": reasons[:5],
            "recommendations": recommendations,
            "confidence_explanation": confidence_explanation,
        }

    @staticmethod
    def _recommendations(classification: str, threat_intelligence: dict) -> list[str]:
        """Build deterministic recommendations."""
        classification_lower = classification.lower() if classification else ""
        if any(keyword in classification_lower for keyword in ["high", "malicious", "scam", "fake"]):
            recommendations = [
                "Do not engage with this suspicious content.",
                "Verify the source independently before you click or respond.",
                "Report the message or media if it appears fraudulent.",
            ]
        elif any(keyword in classification_lower for keyword in ["medium", "suspicious", "potential"]):
            recommendations = [
                "Treat this item as suspicious until it can be confirmed.",
                "Avoid sharing personal information or credentials.",
            ]
        else:
            recommendations = [
                "No major risk indicators were found, but stay cautious with unknown senders.",
            ]

        if threat_intelligence.get("reputation") == "Bad":
            recommendations.append("Block or monitor this domain in security controls.")
        return recommendations
