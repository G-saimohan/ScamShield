"""HTTP controllers for health and frontend rendering."""

import os

from flask import abort, current_app, jsonify, send_from_directory


def index(path: str = ""):
    """Render the ScamShield dashboard."""
    dist_dir = current_app.config["FRONTEND_DIST_DIR"]
    if path.startswith("api/") or path.startswith("src/"):
        abort(404)

    if path:
        normalized_path = os.path.normpath(path)
        requested_file = os.path.join(dist_dir, normalized_path)
        if os.path.commonpath([dist_dir, requested_file]) == dist_dir and os.path.exists(requested_file):
            return send_from_directory(dist_dir, normalized_path)

    if not os.path.exists(os.path.join(dist_dir, "index.html")):
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Frontend build not found.",
                    "details": {
                        "hint": (
                            "Run `cd frontend && npm ci && npm run build` to "
                            "generate frontend/dist, then restart the server."
                        )
                    },
                }
            ),
            503,
        )
    return send_from_directory(dist_dir, "index.html")


def health_check():
    """Return application health status."""
    db_backend = current_app.config.get("DATABASE_BACKEND", "unknown")
    db_reason = current_app.config.get("DATABASE_BACKEND_REASON")
    database_status = db_reason or db_backend
    return jsonify({
        "success": True,
        "status": "healthy",
        "service": "scamshield",
        "database": database_status,
    })
