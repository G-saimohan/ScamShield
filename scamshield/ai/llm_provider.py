"""LLM provider interface for threat explanations."""

from typing import Protocol


class LLMProvider(Protocol):
    """Interface implemented by explanation providers."""

    def generate_explanation(self, prompt: dict) -> dict:
        """Generate a structured threat explanation."""
