# ScamShield AI

An all-in-one scam awareness and threat-intelligence dashboard for analyzing suspicious messages, URLs, images, and videos.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Web_App-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)

**Live demo:** [phishing-url-xjgv.onrender.com](https://phishing-url-xjgv.onrender.com/)

## Overview

ScamShield AI helps users inspect potentially fraudulent content from one dashboard. It identifies common social-engineering patterns, examines suspicious URL structures, performs lightweight media-forensics checks, stores scan history, and lets users submit community scam reports.

The project is designed as an educational security tool with a Flask API, a responsive browser interface, MongoDB Atlas persistence, and an optional Random Forest phishing-model training pipeline.

## Features

- **Message analysis** - checks SMS, email, WhatsApp text, screenshot text, and call transcripts for urgency, impersonation, threats, rewards, and requests for sensitive information.
- **URL trust scanner** - flags risky URL patterns such as missing HTTPS, raw IP addresses, URL shorteners, excessive subdomains, brand impersonation, and suspicious paths.
- **Media forensics** - reviews image metadata and simple pixel-level signals, while recording file size, dimensions, and video duration.
- **Community reporting** - accepts scam reports and assigns an initial risk level.
- **Threat dashboard** - displays scan metrics, trends, scam categories, recent reports, and analysis history.
- **MongoDB persistence** - stores reports, scan history, users, threat intelligence, notifications, feedback, and audit logs through repository classes.
- **REST API** - exposes endpoints for integration with other applications.
- **Optional ML training** - includes a Random Forest training script using the bundled phishing-websites dataset.

## How Detection Works

The running application uses explainable, rule-based risk scoring:

1. Submitted text is matched against common scam-language patterns.
2. URLs are inspected for structural warning signs.
3. Images are checked for metadata, entropy, edge, noise, and color-pattern signals.
4. Each result includes a risk score, detected indicators, and a recommended action.

`train_model.py` is a separate experimental pipeline that trains and saves a Random Forest phishing classifier and scaler. The current web endpoints do not load those generated model files.

> [!IMPORTANT]
> ScamShield provides risk indicators, not a guarantee that content is safe or fraudulent. Always verify sensitive requests through an official website, app, phone number, or trusted authority.

## Tech Stack

- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Database:** MongoDB Atlas with PyMongo
- **Media analysis:** Pillow
- **Machine learning:** pandas, NumPy, SciPy, scikit-learn, joblib
- **Deployment:** Gunicorn and Render-compatible `Procfile`

## Getting Started

### Prerequisites

- Python 3.10 or newer
- Git
- MongoDB Atlas cluster and connection string for persistent storage

### Installation

```bash
git clone https://github.com/gollesaimohan-source/ScamShield.git
cd ScamShield
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows
.venv\Scripts\activate

# macOS or Linux
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

The application connects to MongoDB Atlas when `MONGODB_URI` is configured and adds a small set of sample reports when the reports collection is empty. If no MongoDB URI is provided, the app uses an in-memory development fallback so local frontend/API work can still run.

### Configuration

ScamShield reads runtime configuration from environment variables. Copy `.env.example` to `.env` when you add a dotenv loader or configure these values directly in your shell/deployment platform.

| Variable | Default | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | empty | MongoDB Atlas connection string |
| `DATABASE_NAME` | `scamshield` | MongoDB database name |
| `SECRET_KEY` | `scamshield-demo-secret` | Flask session signing key |
| `CORS_ORIGINS` | `*` | Allowed CORS origins, comma-separated for multiple origins |
| `DEBUG` | `false` | Enables Flask debug mode when set to `true` |
| `MONGODB_TIMEOUT_MS` | `5000` | MongoDB server selection timeout |
| `MONGODB_STRICT` | `false` | When `true`, startup fails instead of using the development fallback |
| `SCAMSHIELD_DEMO_EMAIL` | `demo@scamshield.com` | Demo login email |
| `SCAMSHIELD_DEMO_PASSWORD` | `scamshield123` | Demo login password |

Legacy `SCAMSHIELD_SECRET_KEY`, `SCAMSHIELD_CORS_ORIGINS`, and `FLASK_DEBUG` values are still supported for backward compatibility.

### MongoDB Collections

ScamShield prepares these collections through the repository layer:

- `users`
- `scans`
- `reports`
- `threat_intelligence`
- `notifications`
- `feedback`
- `audit_logs`

### MongoDB Indexes

The app creates indexes for:

- `users.email`
- `users.username`
- `scans.scan_id`
- `scans.url`
- `scans.created_at`
- `reports.report_id`
- `reports.created_at`
- `threat_intelligence.url`
- `threat_intelligence.created_at`
- `notifications.created_at`
- `feedback.created_at`
- `audit_logs.created_at`

### Migrate Legacy SQLite Data

If a previous `scamshield.db` file exists, configure `MONGODB_URI` and run:

```bash
python scripts/migrate_sqlite_to_mongodb.py
```

You can also pass a custom SQLite path:

```bash
python scripts/migrate_sqlite_to_mongodb.py path/to/scamshield.db
```

## Optional: Train the Phishing Model

Create the model output directory and run the training script:

```bash
mkdir models
python train_model.py
```

The script reads `data/Training Dataset.arff` and generates:

- `models/phishing_rf_model_30feat.pkl`
- `models/scaler_30feat.pkl`

Generated `.pkl` files are ignored by Git.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Serve the ScamShield dashboard |
| `GET` | `/api/health` | Return application health status |
| `GET` | `/api/auth-status` | Return current session authentication state |
| `POST` | `/api/login` | Sign in with demo analyst credentials |
| `POST` | `/api/logout` | Clear the active session |
| `POST` | `/api/analyze` | Analyze message or transcript content |
| `POST` | `/api/check-url` | Inspect a URL for phishing indicators |
| `POST` | `/check-url` | Backward-compatible URL inspection endpoint |
| `POST` | `/api/analyze-file` | Analyze an uploaded file with optional transcript text |
| `POST` | `/api/analyze-media` | Run lightweight image or video forensics |
| `POST` | `/api/report` | Submit a community scam report |
| `GET` | `/api/dashboard` | Return dashboard metrics, reports, and scan history |

Example request:

```bash
curl -X POST http://127.0.0.1:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"content_type\":\"message\",\"content\":\"Verify your KYC now and share your OTP.\"}"
```

## Backend Architecture

The backend now uses an application factory and layered package architecture while preserving the original frontend and API surface.

- `routes/` defines Flask Blueprints and URL registration only.
- `controllers/` receives HTTP requests, delegates work, and returns JSON or rendered templates.
- `services/` contains URL analysis orchestration, file analysis, media analysis, dashboard composition, authentication, and report generation.
- `repositories/` isolates MongoDB access behind repository classes and protocols so controllers and services never access the database directly.
- `validators/` validates and normalizes incoming request payloads and uploads.
- `middleware/` contains request logging plus placeholders for authentication and rate limiting.
- `ai/` contains the existing detection engine moved from the root-level `detector.py`.
- `utils/` contains shared helpers for logging, time, and centralized error responses.
- `extensions.py` owns Flask extension instances such as CORS.
- `config.py` centralizes environment-driven configuration.

Root-level `app.py` and `detector.py` remain as compatibility shims. Existing commands such as `python app.py`, `gunicorn app:app`, and imports from `detector` continue to work.

## Project Structure

```text
ScamShield/
|-- app.py                  # Compatibility entry point for python app.py and gunicorn app:app
|-- detector.py             # Backward-compatible detector imports
|-- train_model.py          # Optional Random Forest training pipeline
|-- requirements.txt        # Python dependencies
|-- Procfile                # Gunicorn deployment command
|-- scamshield/
|   |-- __init__.py         # Application factory
|   |-- app.py              # WSGI module for scamshield.app:app deployments
|   |-- config.py           # Environment-driven configuration
|   |-- extensions.py       # Flask extension instances
|   |-- ai/                 # Detection engine
|   |-- controllers/        # HTTP controllers
|   |-- middleware/         # Request logging and future auth/rate limit hooks
|   |-- models/             # Domain model dataclasses
|   |-- repositories/       # MongoDB repositories, schemas, indexes, and migration-safe helpers
|   |-- routes/             # Flask Blueprints
|   |-- security/           # Security helpers
|   |-- services/           # Business logic and orchestration
|   |-- utils/              # Shared utilities
|   `-- validators/         # Request validation
|-- frontend/
|   |-- index.html          # Dashboard interface
|   |-- index.css           # Application styling
|   `-- script.js           # Client-side behavior and API calls
|-- data/                   # Phishing dataset files
`-- docs/                   # Dataset feature documentation
```

## Deployment

The included `Procfile` starts the application with:

```text
web: gunicorn app:app
```

For production, set `MONGODB_URI`, `DATABASE_NAME`, `SECRET_KEY`, `CORS_ORIGINS`, and `DEBUG=false` in your deployment environment.

## Contributing

Contributions, bug reports, and feature suggestions are welcome. Fork the repository, create a focused branch, and open a pull request describing your changes.

## Author

Created by [Sai Mohan Golle](https://github.com/gollesaimohan-source).
