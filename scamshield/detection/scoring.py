"""Weighted risk scoring for detection analyzers."""

from scamshield.detection.models import AnalyzerResult, ScanResult


def classify_score(score: int) -> str:
    """Convert a numeric risk score into a user-facing classification."""
    if score >= 85:
        return "Malicious"
    if score >= 65:
        return "High"
    if score >= 40:
        return "Medium"
    if score >= 20:
        return "Low"
    return "Safe"


def score_results(url: str, results: list[AnalyzerResult]) -> ScanResult:
    """Combine analyzer findings into a normalized scan result."""
    findings = [finding for result in results for finding in result.findings]
    risk_score = min(100, max(0, sum(finding.score for finding in findings)))
    reasons = [finding.reason for finding in findings]
    if not reasons:
        reasons = ["No major scam indicators detected."]

    confidence = 65
    if findings:
        confidence = min(100, max(40, round(
            sum(finding.confidence for finding in findings) / len(findings)
        )))

    return ScanResult(
        url=url,
        risk_score=risk_score,
        classification=classify_score(risk_score),
        reasons=reasons,
        confidence=confidence,
        analyzer_results=results,
    )
