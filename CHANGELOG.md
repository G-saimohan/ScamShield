# Changelog

## 0.3.1 - 2026-07-21

### Added

- Automatic `.env` loading during Flask configuration startup.
- `python-dotenv` dependency for standard local environment loading.
- Local placeholder `.env` for MongoDB Atlas development.
- More detailed startup logs for MongoDB connection attempts, ping results, active database name, and fallback mode.

### Changed

- Updated `.env.example` with the requested local MongoDB Atlas development values.
- README now documents local Atlas setup and the single required credential replacement step.

### Fixed

- Configuration can still load `.env` values through a small fallback parser before dependencies are installed.

### Removed

- Nothing.

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
