"""WSGI module for deployments that target scamshield.app:app."""

from scamshield import create_app

app = create_app()
