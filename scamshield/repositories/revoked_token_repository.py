"""Repository for revoked JWT identifiers (server-side logout support)."""

from datetime import datetime, timezone

from flask import current_app

from scamshield.repositories.base_repository import handle_repository_error
from scamshield.repositories.database import get_collection


class RevokedTokenRepository:
    """Track token ids (jti) that have been explicitly logged out."""

    collection_name = "revoked_tokens"

    @classmethod
    def revoke(cls, jti: str, expires_at: datetime) -> None:
        """Mark a token id as revoked until its natural expiration."""
        try:
            get_collection(cls.collection_name).update_one(
                {"jti": jti},
                {
                    "$set": {
                        "jti": jti,
                        "expires_at": expires_at.isoformat(),
                        "revoked_at": datetime.now(timezone.utc).isoformat(),
                    }
                },
                upsert=True,
            )
        except Exception as error:  # pragma: no cover - defensive.
            current_app.logger.exception("token_revoke_failed jti=%s", jti)
            handle_repository_error(error)

    @classmethod
    def is_revoked(cls, jti: str) -> bool:
        """Return whether a token id has been revoked."""
        try:
            match = next(
                iter(get_collection(cls.collection_name).find({"jti": jti})), None
            )
            return match is not None
        except Exception:  # pragma: no cover - defensive.
            current_app.logger.exception("token_revocation_check_failed jti=%s", jti)
            # Fail closed would lock everyone out on a DB hiccup; fail open
            # here since revocation is a defense-in-depth measure and the
            # token's own expiry is still enforced.
            return False
