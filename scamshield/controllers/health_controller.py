"""HTTP controllers for health and frontend rendering."""

from flask import abort, jsonify, render_template


def index(path: str = ""):
    """Render the ScamShield dashboard."""
    if path.startswith("api/") or path.startswith("src/") or "." in path:
        abort(404)
    return render_template("index.html")


def health_check():
    """Return application health status."""
    return jsonify({"success": True, "status": "healthy", "service": "scamshield"})
