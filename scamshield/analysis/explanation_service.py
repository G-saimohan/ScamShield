"""Threat explanation service."""

from time import perf_counter

from flask import current_app

from scamshield.ai.llm_provider import LLMProvider
from scamshield.ai.mock_provider import MockProvider
from scamshield.analysis.models import ThreatExplanation
from scamshield.analysis.prompt_builder import PromptBuilder


class ExplanationService:
    """Generate structured explanations through an interchangeable provider."""

    def __init__(self, provider: LLMProvider | None = None) -> None:
        self.provider = provider or MockProvider()

    def explain(self, scan_result: dict, threat_intelligence: dict) -> dict:
        """Generate a threat explanation for a URL scan."""
        started_at = perf_counter()
        prompt = PromptBuilder.build(scan_result, threat_intelligence)
        generated = self.provider.generate_explanation(prompt)
        explanation = ThreatExplanation(
            summary=generated["summary"],
            key_findings=generated["key_findings"],
            recommendations=generated["recommendations"],
            confidence_explanation=generated["confidence_explanation"],
        )
        duration_ms = (perf_counter() - started_at) * 1000
        current_app.logger.info(
            "threat_explanation_generated duration_ms=%.2f classification=%s",
            duration_ms,
            scan_result["classification"],
        )
        return explanation.to_dict()
