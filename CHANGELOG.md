# Changelog

## 0.3.0 - 2026-07-21

### Added

- MongoDB Atlas persistence using PyMongo.
- MongoDB configuration through `MONGODB_URI`, `DATABASE_NAME`, `SECRET_KEY`, `CORS_ORIGINS`, and `DEBUG`.
- `.env.example` for deployment setup.
- Mongo repositories for users, scans, reports, threat intelligence, notifications, feedback, and audit logs.
- Repository-level schemas with automatic `created_at` and `updated_at` timestamps.
- Mongo index creation for email, username, scan/report identifiers, URLs, and creation timestamps.
- SQLite-to-MongoDB migration utility at `scripts/migrate_sqlite_to_mongodb.py`.
- Repository error classes for connection failures, duplicate keys, validation errors, and timeouts.

### Changed

- Replaced SQLite-backed report/history repositories with MongoDB-backed implementations.
- Dashboard and scan history now read from the `scans` collection.
- README now documents MongoDB setup, collections, indexes, and migration.

### Fixed

- Database errors now return consistent JSON responses.
- Repository operations now log insert/update/delete attempts and failures.

### Removed

- Runtime dependency on SQLite for application persistence.
