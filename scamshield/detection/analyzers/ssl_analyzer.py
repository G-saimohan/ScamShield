"""SSL/TLS analyzer."""

import socket
import ssl
from datetime import datetime, timezone
from urllib.parse import urlparse

from scamshield.detection.models import AnalyzerFinding, AnalyzerResult


class SslAnalyzer:
    """Analyze HTTPS and certificate validity when reachable."""

    name = "ssl"

    def analyze(self, url: str) -> AnalyzerResult:
        """Return SSL findings without failing if network checks are unavailable."""
        parsed = urlparse(url)
        host = parsed.hostname
        findings: list[AnalyzerFinding] = []

        if parsed.scheme != "https":
            findings.append(AnalyzerFinding(self.name, "HTTPS is missing.", 18))
            return AnalyzerResult(self.name, findings)

        if not host:
            return AnalyzerResult(self.name, findings)

        try:
            expires_at = _certificate_expiry(host)
            if expires_at and expires_at < datetime.now(timezone.utc):
                findings.append(
                    AnalyzerFinding(self.name, "SSL certificate is expired.", 20)
                )
        except Exception:
            findings.append(
                AnalyzerFinding(
                    self.name,
                    "SSL certificate could not be verified.",
                    6,
                    confidence=45,
                )
            )

        return AnalyzerResult(self.name, findings)


def _certificate_expiry(host: str) -> datetime | None:
    context = ssl.create_default_context()
    with socket.create_connection((host, 443), timeout=3) as sock:
        with context.wrap_socket(sock, server_hostname=host) as secure_sock:
            certificate = secure_sock.getpeercert()
    not_after = certificate.get("notAfter")
    if not not_after:
        return None
    expires_at = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
    return expires_at.replace(tzinfo=timezone.utc)
