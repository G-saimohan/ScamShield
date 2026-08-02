"""Minimal outbound email helper.

ScamShield does not bundle a transactional email provider. If SMTP_HOST is
configured, this sends real email via smtplib. Otherwise it logs the message
instead of sending it, which is enough for local development and tests but
NOT sufficient for a real deployment: configure SMTP_* (or swap this module
for SendGrid/SES/Postmark/etc.) before relying on password reset in
production.
"""

from __future__ import annotations

import smtplib
from email.message import EmailMessage

from flask import current_app


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """Send (or log) a password reset email containing the given link."""
    subject = "Reset your ScamShield password"
    body = (
        "We received a request to reset your ScamShield password.\n\n"
        f"Reset link (expires shortly): {reset_link}\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    smtp_host = current_app.config.get("SMTP_HOST")
    if not smtp_host:
        current_app.logger.warning(
            "email_not_configured to=%s subject=%r reset_link=%s "
            "(set SMTP_HOST/SMTP_PORT/SMTP_USERNAME/SMTP_PASSWORD/SMTP_FROM "
            "to actually deliver this)",
            to_email,
            subject,
            reset_link,
        )
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = current_app.config.get("SMTP_FROM", "no-reply@scamshield.local")
    message["To"] = to_email
    message.set_content(body)

    port = int(current_app.config.get("SMTP_PORT", 587))
    username = current_app.config.get("SMTP_USERNAME")
    password = current_app.config.get("SMTP_PASSWORD")

    with smtplib.SMTP(smtp_host, port, timeout=10) as server:
        server.starttls()
        if username and password:
            server.login(username, password)
        server.send_message(message)
    current_app.logger.info("password_reset_email_sent to=%s", to_email)
