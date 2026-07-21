"""Structural URL analyzer."""

import ipaddress
import re
from urllib.parse import unquote, urlparse

from scamshield.detection.models import AnalyzerFinding, AnalyzerResult

SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "is.gd", "ow.ly",
    "cutt.ly", "rebrand.ly", "shorturl.at", "lnkd.in", "rb.gy",
}

SUSPICIOUS_KEYWORDS = {
    "login", "verify", "kyc", "secure", "account", "payment", "wallet",
    "bonus", "prize", "gift", "free", "refund", "password", "otp",
}


class UrlAnalyzer:
    """Analyze URL syntax and structure."""

    name = "url"

    def analyze(self, url: str) -> AnalyzerResult:
        """Return structural URL findings."""
        parsed = urlparse(url)
        host = parsed.hostname or ""
        path_query = f"{parsed.path}?{parsed.query}".lower()
        findings: list[AnalyzerFinding] = []

        if parsed.scheme != "https":
            findings.append(AnalyzerFinding(self.name, "URL does not use HTTPS.", 18))

        if _is_ip_address(host):
            findings.append(
                AnalyzerFinding(self.name, "URL uses a raw IP address.", 25)
            )

        if len(url) > 90:
            findings.append(AnalyzerFinding(self.name, "URL is unusually long.", 10))

        if host.count(".") >= 3:
            findings.append(
                AnalyzerFinding(self.name, "URL has excessive subdomains.", 12)
            )

        if re.search(r"[@\\[\\]{}|^~`]", url):
            findings.append(
                AnalyzerFinding(self.name, "URL contains suspicious characters.", 12)
            )

        if host.lower() in SHORTENERS:
            findings.append(
                AnalyzerFinding(self.name, "URL uses a known shortener.", 18)
            )

        matched_keywords = [
            keyword for keyword in SUSPICIOUS_KEYWORDS if keyword in path_query
        ]
        if matched_keywords:
            findings.append(
                AnalyzerFinding(
                    self.name,
                    "URL contains suspicious action keywords.",
                    min(18, len(matched_keywords) * 5),
                    metadata={"keywords": matched_keywords[:5]},
                )
            )

        if "%" in url or unquote(url) != url:
            findings.append(AnalyzerFinding(self.name, "URL contains encoded text.", 10))

        return AnalyzerResult(self.name, findings)


def _is_ip_address(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False
