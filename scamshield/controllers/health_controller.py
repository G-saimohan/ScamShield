"""HTTP controllers for health and frontend rendering."""

from flask import jsonify, render_template


def index():
    """Render the ScamShield dashboard."""
    return render_template("index.html")


def health_check():
    """Return application health status."""
    return jsonify({"success": True, "status": "healthy", "service": "scamshield"})
