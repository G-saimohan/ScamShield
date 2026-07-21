"""Configuration for the ScamShield application."""

import os
from pathlib import Path


class Config:
    """Default application configuration loaded from environment variables."""

    PROJECT_ROOT = Path(__file__).resolve().parent.parent
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        os.environ.get("SCAMSHIELD_SECRET_KEY", "scamshield-demo-secret"),
    )
    DEBUG = os.environ.get(
        "DEBUG",
        os.environ.get("FLASK_DEBUG", "false"),
    ).lower() in {"1", "true", "yes"}
    MONGODB_URI = os.environ.get("MONGODB_URI", "")
    DATABASE_NAME = os.environ.get("DATABASE_NAME", "scamshield")
    DATABASE_BACKEND = "mongodb"
    MONGODB_TIMEOUT_MS = int(os.environ.get("MONGODB_TIMEOUT_MS", "5000"))
    MONGODB_STRICT = os.environ.get("MONGODB_STRICT", "false").lower() in {
        "1",
        "true",
        "yes",
    }
    LEGACY_SQLITE_PATH = os.environ.get(
        "SCAMSHIELD_DATABASE_PATH",
        str(PROJECT_ROOT / "scamshield.db"),
    )
    _CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS",
        os.environ.get("SCAMSHIELD_CORS_ORIGINS", "*"),
    )
    CORS_ORIGINS = (
        [origin.strip() for origin in _CORS_ORIGINS.split(",") if origin.strip()]
        if "," in _CORS_ORIGINS
        else _CORS_ORIGINS
    )
    DEMO_EMAIL = os.environ.get("SCAMSHIELD_DEMO_EMAIL", "demo@scamshield.com")
    DEMO_PASSWORD = os.environ.get("SCAMSHIELD_DEMO_PASSWORD", "scamshield123")
    JSON_SORT_KEYS = False
