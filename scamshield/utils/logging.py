"""Application logging setup."""

import logging

from flask import Flask


def configure_logging(app: Flask) -> None:
    """Configure structured console logging for the Flask app."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    app.logger.setLevel(logging.INFO)
