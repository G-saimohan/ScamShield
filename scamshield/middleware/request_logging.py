"""Request logging middleware."""

from time import perf_counter

from flask import Flask, g, request


def register_request_logging(app: Flask) -> None:
    """Register request start/end structured logging hooks."""

    @app.before_request
    def start_request_timer() -> None:
        g.request_started_at = perf_counter()

    @app.after_request
    def log_request(response):
        elapsed_ms = (perf_counter() - g.get("request_started_at", perf_counter())) * 1000
        app.logger.info(
            "request method=%s path=%s status=%s duration_ms=%.2f",
            request.method,
            request.path,
            response.status_code,
            elapsed_ms,
        )
        return response
