# Changelog

## 0.4.0 - 2026-07-21

### Added

- bcrypt password hashing for registered users.
- HS256 JWT access-token generation and verification.
- Authentication service methods for registration, login, token verification, current-user loading, password hashing, and password verification.
- Auth validators for registration and login requests.
- Auth middleware for Bearer token validation and current-user injection.
- JWT auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, and `/api/auth/logout`.
- Config values for `JWT_SECRET_KEY`, `JWT_EXPIRATION_MINUTES`, and `BCRYPT_ROUNDS`.
- Security helpers for password hashing and JWT token handling.

### Changed

- `/api/dashboard` now requires either a valid JWT or the existing legacy demo session.
- User repository now supports email, username, and user-id lookups plus last-login updates.
- User schema validation now requires username, email, password hash, role, and active status defaults.

### Fixed

- Validation errors now preserve structured field-level details.
- Existing legacy `/api/login` and `/api/logout` behavior remains compatible with the current frontend.

### Removed

- Nothing.

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
