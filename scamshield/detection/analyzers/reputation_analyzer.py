"""Local reputation analyzer foundation."""

from urllib.parse import urlparse

from scamshield.detection.models import AnalyzerFinding, AnalyzerResult

KNOWN_BAD_HOSTS = {
    "malware.test",
    "phishing.test",
}


class ReputationAnalyzer:
    """Analyze URL against local reputation indicators."""

    name = "reputation"

    def analyze(self, url: str) -> AnalyzerResult:
        """Return local reputation findings."""
        host = (urlparse(url).hostname or "").lower()
        findings = []
        if host in KNOWN_BAD_HOSTS:
            findings.append(
                AnalyzerFinding(
                    self.name,
                    "URL host appears in the local malicious reputation list.",
                    45,
                    confidence=95,
                )
            )
        return AnalyzerResult(self.name, findings)
