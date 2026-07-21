"""Configuration for the ScamShield application."""

import os
from pathlib import Path


class Config:
    """Default application configuration loaded from environment variables."""

    PROJECT_ROOT = Path(__file__).resolve().parent.parent
    SECRET_KEY = os.environ.get("SCAMSHIELD_SECRET_KEY", "scamshield-demo-secret")
    DEBUG = os.environ.get("FLASK_DEBUG", "false").lower() in {"1", "true", "yes"}
    DATABASE_PATH = os.environ.get(
        "SCAMSHIELD_DATABASE_PATH",
        str(PROJECT_ROOT / "scamshield.db"),
    )
    CORS_ORIGINS = os.environ.get("SCAMSHIELD_CORS_ORIGINS", "*")
    DEMO_EMAIL = os.environ.get("SCAMSHIELD_DEMO_EMAIL", "demo@scamshield.com")
    DEMO_PASSWORD = os.environ.get("SCAMSHIELD_DEMO_PASSWORD", "scamshield123")
    JSON_SORT_KEYS = False
