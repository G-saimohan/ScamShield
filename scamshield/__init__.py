"""Application factory for ScamShield."""

from flask import Flask

from scamshield.config import Config
from scamshield.extensions import cors
from scamshield.middleware.request_logging import register_request_logging
from scamshield.repositories.database import init_db
from scamshield.routes import register_blueprints
from scamshield.utils.error_handlers import register_error_handlers
from scamshield.utils.logging import configure_logging


def create_app(config_class: type[Config] = Config) -> Flask:
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        static_folder="../frontend",
        template_folder="../frontend",
        static_url_path="",
    )
    app.config.from_object(config_class)

    configure_logging(app)
    cors.init_app(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}})
    init_db(app)
    register_blueprints(app)
    register_error_handlers(app)
    register_request_logging(app)

    app.logger.info("ScamShield application startup complete")
    return app
