"""Detection engine data models."""

from dataclasses import dataclass, field


@dataclass(slots=True)
class AnalyzerFinding:
    """A weighted finding produced by a URL analyzer."""

    analyzer: str
    reason: str
    score: int
    confidence: int = 80
    metadata: dict = field(default_factory=dict)


@dataclass(slots=True)
class AnalyzerResult:
    """Collection of findings from one analyzer."""

    analyzer: str
    findings: list[AnalyzerFinding] = field(default_factory=list)


@dataclass(slots=True)
class ScanResult:
    """Normalized URL scan result."""

    url: str
    risk_score: int
    classification: str
    reasons: list[str]
    confidence: int
    analyzer_results: list[AnalyzerResult] = field(default_factory=list)
