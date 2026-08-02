"""HTTP controllers for health and frontend rendering."""

import os

from flask import abort, current_app, jsonify, send_from_directory


def index(path: str = ""):
    """Render the ScamShield dashboard."""
    dist_dir = current_app.config["FRONTEND_DIST_DIR"]
    if path.startswith("api/") or path.startswith("src/") or "." in path:
        abort(404)

    if path.startswith("assets/"):
        asset_path = path[len("assets/"):]
        return send_from_directory(os.path.join(dist_dir, "assets"), asset_path)

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
    return jsonify({"success": True, "status": "healthy", "service": "scamshield"})
