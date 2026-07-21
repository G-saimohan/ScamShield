"""Keyword analyzer for scam terms inside URLs."""

from urllib.parse import unquote, urlparse

from scamshield.detection.models import AnalyzerFinding, AnalyzerResult

SCAM_TERMS = {
    "urgent", "blocked", "suspended", "verify-now", "kyc-update",
    "claim", "reward", "lottery", "gift-card", "free-money",
}


class KeywordAnalyzer:
    """Analyze decoded URL text for scam-oriented phrases."""

    name = "keyword"

    def analyze(self, url: str) -> AnalyzerResult:
        """Return keyword findings."""
        parsed = urlparse(unquote(url).lower())
        text = f"{parsed.netloc}{parsed.path}?{parsed.query}"
        matches = [term for term in SCAM_TERMS if term in text]
        findings = []
        if matches:
            findings.append(
                AnalyzerFinding(
                    self.name,
                    "URL contains scam-oriented keywords.",
                    min(16, len(matches) * 5),
                    metadata={"keywords": matches[:5]},
                )
            )
        return AnalyzerResult(self.name, findings)
