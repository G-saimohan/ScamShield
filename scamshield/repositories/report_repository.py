"""Report repository abstraction."""

from typing import Protocol

from scamshield.repositories.database import get_db, rows_to_dicts


class ReportRepositoryInterface(Protocol):
    """Protocol for future report persistence implementations."""

    @staticmethod
    def create_report(report: dict) -> dict:
        """Persist a community report."""

    @staticmethod
    def list_reports(limit: int = 8) -> list[dict]:
        """Return recent community reports."""


class ReportRepository:
    """SQLite-backed community report repository."""

    @staticmethod
    def create_report(report: dict) -> dict:
        """Persist a community report and return it with its generated id."""
        with get_db() as db:
            cursor = db.execute(
                """
                INSERT INTO reports (type, title, location, risk, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    report["type"],
                    report["title"],
                    report["location"],
                    report["risk"],
                    report["status"],
                    report["created_at"],
                ),
            )
            created = dict(report)
            created["id"] = cursor.lastrowid
        return created

    @staticmethod
    def list_reports(limit: int = 8) -> list[dict]:
        """Return recent community reports."""
        with get_db() as db:
            rows = db.execute(
                """
                SELECT id, type, title, location, risk, status, created_at
                FROM reports
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return rows_to_dicts(rows)

    @staticmethod
    def dashboard_counts() -> dict:
        """Return aggregate counts used by the dashboard."""
        with get_db() as db:
            report_count = db.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
            scan_count = db.execute("SELECT COUNT(*) FROM history").fetchone()[0]
            critical_reports = db.execute(
                "SELECT COUNT(*) FROM reports WHERE risk = 'Critical'"
            ).fetchone()[0]
            verified_reports = db.execute(
                "SELECT COUNT(*) FROM reports WHERE status = 'Verified'"
            ).fetchone()[0]

        return {
            "report_count": report_count,
            "scan_count": scan_count,
            "critical_reports": critical_reports,
            "verified_reports": verified_reports,
        }
