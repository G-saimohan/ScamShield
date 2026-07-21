"""Scan history repository backed by MongoDB."""

from typing import Protocol
from uuid import uuid4

from flask import current_app

from scamshield.repositories.base_repository import (
    handle_repository_error,
    public_document,
)
from scamshield.repositories.database import COLLECTIONS, get_collection
from scamshield.repositories.schemas import validate_scan


class HistoryRepositoryInterface(Protocol):
    """Protocol for scan persistence implementations."""

    @staticmethod
    def add_history(
        kind: str,
        input_value: str,
        risk: str,
        score: int,
        details: dict | None,
    ) -> None:
        """Persist a scan history entry."""

    @staticmethod
    def list_history(limit: int = 8) -> list[dict]:
        """Return recent scan history."""


class HistoryRepository:
    """MongoDB-backed scan history repository."""

    collection_name = COLLECTIONS["scans"]

    @staticmethod
    def add_history(
        kind: str,
        input_value: str,
        risk: str,
        score: int,
        details: dict | None = None,
    ) -> None:
        """Persist a scan history entry in the scans collection."""
        HistoryRepository.create_scan(
            {
                "scan_id": f"scan-{uuid4()}",
                "kind": kind,
                "input": input_value,
                "risk": risk,
                "score": score,
                "details": details or {},
                "url": input_value if kind == "URL" else None,
            }
        )

    @staticmethod
    def create_scan(scan: dict) -> dict:
        """Insert a scan document and return it."""
        document = validate_scan(scan)
        try:
            get_collection(HistoryRepository.collection_name).insert_one(document)
            current_app.logger.info(
                "scan_inserted scan_id=%s kind=%s",
                document["scan_id"],
                document["kind"],
            )
            return public_document(document)
        except Exception as error:
            current_app.logger.exception(
                "scan_insert_failed kind=%s", document.get("kind")
            )
            handle_repository_error(error)

    @staticmethod
    def list_history(limit: int = 8) -> list[dict]:
        """Return recent scan history documents in the frontend shape."""
        try:
            cursor = (
                get_collection(HistoryRepository.collection_name)
                .find({}, {"_id": 0})
                .sort("created_at", -1)
                .limit(limit)
            )
            return [
                {
                    "kind": item["kind"],
                    "input": item["input"],
                    "risk": item["risk"],
                    "score": item["score"],
                    "created_at": item["created_at"],
                }
                for item in map(public_document, cursor)
            ]
        except Exception as error:
            current_app.logger.exception("scan_list_failed")
            handle_repository_error(error)

    @staticmethod
    def count_scans() -> int:
        """Return the total number of scan documents."""
        try:
            return get_collection(HistoryRepository.collection_name).count_documents({})
        except Exception as error:
            current_app.logger.exception("scan_count_failed")
            handle_repository_error(error)
