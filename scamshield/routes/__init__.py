"""Blueprint registration."""

from flask import Flask

from scamshield.routes.auth_routes import auth_bp
from scamshield.routes.dashboard_routes import dashboard_bp
from scamshield.routes.health_routes import health_bp
from scamshield.routes.scan_routes import scan_bp


def register_blueprints(app: Flask) -> None:
    """Register all application blueprints."""
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(scan_bp)
    app.register_blueprint(dashboard_bp)
