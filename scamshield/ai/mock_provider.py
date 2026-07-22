"""Deterministic mock LLM provider."""

from scamshield.ai.llm_provider import LLMProvider


class MockProvider(LLMProvider):
    """Generate deterministic explanations without external AI calls."""

    def generate_explanation(self, prompt: dict) -> dict:
        """Return a structured explanation from scan facts."""
        risk_score = prompt["risk_score"]
        classification = prompt["classification"]
        reasons = prompt["reasons"]
        threat_intelligence = prompt["threat_intelligence"]

        summary = (
            f"This URL is classified as {classification} with a risk score of "
            f"{risk_score}/100."
        )
        if threat_intelligence.get("known_domain"):
            summary += (
                " The domain has prior ScamShield intelligence and should be "
                "treated with additional caution."
            )

        recommendations = self._recommendations(classification, threat_intelligence)
        confidence = prompt["confidence"]
        confidence_explanation = (
            f"Confidence is {confidence}/100 because the result is based on "
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
        if classification in {"High", "Malicious"}:
            recommendations = [
                "Do not open the URL or enter credentials.",
                "Report the URL to your security or fraud response team.",
                "Verify the request using an official website or trusted contact.",
            ]
        elif classification == "Medium":
            recommendations = [
                "Treat the URL as suspicious until independently verified.",
                "Avoid submitting OTPs, passwords, or payment information.",
            ]
        else:
            recommendations = [
                "No major risk indicators were found, but continue verifying unknown links.",
            ]

        if threat_intelligence.get("reputation") == "Bad":
            recommendations.append("Block or monitor this domain in security controls.")
        return recommendations
