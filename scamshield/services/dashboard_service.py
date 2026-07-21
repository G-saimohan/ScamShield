"""Dashboard orchestration logic."""

from scamshield.repositories.history_repository import HistoryRepository
from scamshield.repositories.report_repository import ReportRepository


class DashboardService:
    """Build dashboard responses for the frontend."""

    @staticmethod
    def get_dashboard() -> dict:
        """Return metrics, chart data, reports, and scan history."""
        reports = ReportRepository.list_reports()
        history = HistoryRepository.list_history()
        metrics = ReportRepository.dashboard_counts()

        return {
            "metrics": {
                "scans_today": max(128, metrics["scan_count"] + 128),
                "critical_threats": metrics["critical_reports"],
                "community_reports": metrics["report_count"],
                "verified_scams": metrics["verified_reports"],
                "average_risk": 64 if metrics["report_count"] else 0,
                "protected_users": 18420,
            },
            "trend_series": [22, 28, 35, 31, 44, 52, 49, 63, 71, 68, 79, 86],
            "category_series": {
                "Phishing": 38,
                "UPI Fraud": 24,
                "Job Scam": 15,
                "OTP Fraud": 13,
                "Voice Scam": 10,
            },
            "heatmap": [
                {"city": "Hyderabad", "x": 58, "y": 61, "reports": 42, "risk": "High"},
                {"city": "Mumbai", "x": 35, "y": 69, "reports": 61, "risk": "Critical"},
                {"city": "Bengaluru", "x": 43, "y": 78, "reports": 36, "risk": "High"},
                {"city": "Delhi", "x": 48, "y": 38, "reports": 53, "risk": "Critical"},
                {"city": "Kolkata", "x": 72, "y": 55, "reports": 28, "risk": "Medium"},
            ],
            "threat_feed": [
                "Fake bank KYC links using shortened URLs",
                "WhatsApp job offers asking registration fees",
                "UPI collect requests pretending to be refunds",
                "AI voice calls claiming courier police cases",
            ],
            "reports": reports,
            "history": history,
        }
