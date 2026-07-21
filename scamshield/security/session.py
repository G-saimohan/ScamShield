"""Session security helpers."""

from flask import session


def is_authenticated() -> bool:
    """Return whether the current browser session is authenticated."""
    return bool(session.get("authenticated"))
