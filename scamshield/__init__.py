"""Application factory for ScamShield."""

from urllib.parse import urlparse

from flask import Flask

from scamshield.config import Config
from scamshield.extensions import cors
from scamshield.middleware.api_rate_limiting import register_api_rate_limiting
from scamshield.middleware.request_logging import register_request_logging
from scamshield.repositories.database import init_db
from scamshield.routes import register_blueprints
from scamshield.utils.error_handlers import register_error_handlers
from scamshield.utils.logging import configure_logging


def create_app(config_class: type[Config] = Config) -> Flask:
    """Create and configure the Flask application."""
    frontend_dist = config_class.PROJECT_ROOT / "frontend" / "dist"
    app = Flask(
        __name__,
        static_folder=str(frontend_dist / "assets"),
        static_url_path="/assets",
    )
    app.config.from_object(config_class)
    app.config["FRONTEND_DIST_DIR"] = str(frontend_dist)

    configure_logging(app)
    for warning in config_class.validate():
        app.logger.warning("insecure_config_warning message=%r", warning)
    app.logger.info(
        "env_loaded mongodb_uri_configured=%s mongodb_host=%s database=%s "
        "debug=%s cors_origins=%s strict=%s",
        bool(app.config["MONGODB_URI"]),
        _safe_mongodb_host(app.config["MONGODB_URI"]),
        app.config["DATABASE_NAME"],
        app.config["DEBUG"],
        app.config["CORS_ORIGINS"],
        app.config["MONGODB_STRICT"],
    )
    app.logger.info("mongodb_startup_ping_will_execute=true")
    cors.init_app(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}})
    init_db(app)
    app.logger.info(
        "mongodb_backend_active backend=%s database=%s",
        app.config["DATABASE_BACKEND"],
        app.config["DATABASE_NAME"],
    )
    register_blueprints(app)
    register_error_handlers(app)
    register_request_logging(app)
    register_api_rate_limiting(app)

    app.logger.info("ScamShield application startup complete")
    return app


def _safe_mongodb_host(uri: str) -> str:
    """Return a MongoDB host string without credentials."""
    if not uri:
        return "<not-configured>"
    return urlparse(uri).hostname or "<unknown-host>"
