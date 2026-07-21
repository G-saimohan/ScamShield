"""Community report business logic."""

from scamshield.ai.detector import analyze_content
from scamshield.repositories.report_repository import ReportRepository
from scamshield.utils.time import utc_now


class ReportService:
    """Create and analyze community scam reports."""

    @staticmethod
    def create_report(payload: dict) -> dict:
        """Create a report and return the generated analysis."""
        title = payload["title"]
        scam_type = payload["type"]
        location = payload["location"]
        description = payload["description"]

        analysis = analyze_content(f"{title} {description}", scam_type)
        report = {
            "type": scam_type,
            "title": title or description[:60],
            "location": location,
            "risk": analysis["risk_level"],
            "status": "New",
            "created_at": utc_now(),
        }
        created_report = ReportRepository.create_report(report)
        return {"report": created_report, "analysis": analysis}
