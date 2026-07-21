"""Scan orchestration service."""

from werkzeug.datastructures import FileStorage

from scamshield.ai.detector import analyze_content, analyze_media_file, analyze_url
from scamshield.repositories.history_repository import HistoryRepository


class ScanService:
    """Coordinate URL, content, file, and media analysis workflows."""

    @staticmethod
    def check_url(url: str) -> dict:
        """Analyze a URL and persist scan history."""
        result = analyze_url(url)
        HistoryRepository.add_history(
            "URL",
            url,
            result["risk_level"],
            result["risk_score"],
            result,
        )
        return result

    @staticmethod
    def analyze_content(content: str, content_type: str) -> dict:
        """Analyze text content and persist scan history."""
        result = analyze_content(content, content_type)
        HistoryRepository.add_history(
            content_type.title(),
            content[:90],
            result["risk_level"],
            result["scam_probability"],
            result,
        )
        return result

    @staticmethod
    def analyze_file(uploaded_file: FileStorage, content_type: str, transcript: str) -> dict:
        """Analyze an uploaded file using supplied or fallback text."""
        filename = uploaded_file.filename or "uploaded file"
        file_size = len(uploaded_file.read())
        uploaded_file.seek(0)

        normalized_type = (content_type or "file").strip() or "file"
        analysis_text = transcript.strip() or (
            f"Uploaded {normalized_type} file named {filename}. "
            "No extracted text or transcript was provided for AI risk analysis."
        )
        result = analyze_content(analysis_text, normalized_type)
        result["file"] = {
            "name": filename,
            "size_bytes": file_size,
            "content_type": uploaded_file.mimetype,
        }
        result["processing_note"] = (
            "File upload is enabled. Add Tesseract OCR for screenshot text extraction "
            "and Whisper/OpenAI speech-to-text for automatic audio transcription."
        )

        HistoryRepository.add_history(
            normalized_type.title(),
            filename,
            result["risk_level"],
            result["scam_probability"],
            result,
        )
        return result

    @staticmethod
    def analyze_media(
        uploaded_file: FileStorage,
        width: int | None = None,
        height: int | None = None,
        duration: float | None = None,
    ) -> dict:
        """Analyze an uploaded image or video and persist scan history."""
        filename = uploaded_file.filename or "uploaded-media"
        file_bytes = uploaded_file.read()
        file_size = len(file_bytes)
        uploaded_file.seek(0)

        result = analyze_media_file(
            filename=filename,
            mimetype=uploaded_file.mimetype,
            size_bytes=file_size,
            width=width,
            height=height,
            duration=duration,
            file_bytes=file_bytes,
        )
        result["file"] = {
            "name": filename,
            "size_bytes": file_size,
            "content_type": uploaded_file.mimetype,
        }

        media_risk = "High"
        if result["ai_likelihood"] < 45:
            media_risk = "Low"
        elif result["ai_likelihood"] < 70:
            media_risk = "Medium"

        HistoryRepository.add_history(
            "Media Forensics",
            filename,
            media_risk,
            result["ai_likelihood"],
            result,
        )
        return result
