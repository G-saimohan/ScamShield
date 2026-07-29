"""HTTP controllers for health and frontend rendering."""

from flask import abort, current_app, jsonify, send_from_directory


def index(path: str = ""):
    """Render the ScamShield dashboard."""
    if path.startswith("api/") or path.startswith("src/") or "." in path:
        abort(404)
    return send_from_directory(current_app.config["FRONTEND_DIST_DIR"], "index.html")


def health_check():
    """Return application health status."""
    return jsonify({"success": True, "status": "healthy", "service": "scamshield"})
