"""Report repository backed by MongoDB."""

from typing import Protocol
from uuid import uuid4

from flask import current_app

from scamshield.repositories.base_repository import (
    handle_repository_error,
    public_document,
)
from scamshield.repositories.database import COLLECTIONS, get_collection
from scamshield.repositories.history_repository import HistoryRepository
from scamshield.repositories.schemas import validate_report


class ReportRepositoryInterface(Protocol):
    """Protocol for report persistence implementations."""

    @staticmethod
    def create_report(report: dict) -> dict:
        """Persist a community report."""

    @staticmethod
    def list_reports(limit: int = 8) -> list[dict]:
        """Return recent community reports."""


class ReportRepository:
    """MongoDB-backed community report repository."""

    collection_name = COLLECTIONS["reports"]

    @staticmethod
    def create_report(report: dict) -> dict:
        """Persist a community report and return it for the API response."""
        document = validate_report(
            {
                **report,
                "report_id": report.get("report_id") or f"report-{uuid4()}",
            }
        )
        try:
            get_collection(ReportRepository.collection_name).insert_one(document)
            current_app.logger.info(
                "report_inserted report_id=%s", document["report_id"]
            )
            return ReportRepository._to_response(document)
        except Exception as error:
            current_app.logger.exception("report_insert_failed")
            handle_repository_error(error)

    @staticmethod
    def list_reports(limit: int = 8) -> list[dict]:
        """Return recent community reports."""
        try:
            cursor = (
                get_collection(ReportRepository.collection_name)
                .find({}, {"_id": 0})
                .sort("created_at", -1)
                .limit(limit)
            )
            return [
                ReportRepository._to_response(public_document(item))
                for item in cursor
            ]
        except Exception as error:
            current_app.logger.exception("report_list_failed")
            handle_repository_error(error)

    @staticmethod
    def dashboard_counts() -> dict:
        """Return aggregate counts used by the dashboard."""
        try:
            collection = get_collection(ReportRepository.collection_name)
            report_count = collection.count_documents({})
            critical_reports = collection.count_documents({"risk": "Critical"})
            verified_reports = collection.count_documents({"status": "Verified"})
            scan_count = HistoryRepository.count_scans()
            return {
                "report_count": report_count,
                "scan_count": scan_count,
                "critical_reports": critical_reports,
                "verified_reports": verified_reports,
            }
        except Exception as error:
            current_app.logger.exception("dashboard_count_failed")
            handle_repository_error(error)

    @staticmethod
    def _to_response(document: dict) -> dict:
        """Map a report document to the existing API response shape."""
        item = public_document(document)
        item["id"] = item.get("report_id")
        return {
            "id": item["id"],
            "type": item["type"],
            "title": item["title"],
            "location": item["location"],
            "risk": item["risk"],
            "status": item["status"],
            "created_at": item["created_at"],
        }
