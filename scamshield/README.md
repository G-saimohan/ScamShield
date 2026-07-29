# ScamShield AI

An all-in-one scam awareness and threat-intelligence dashboard for analyzing suspicious messages, URLs, images, and videos.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Web_App-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)

**Live demo:** [phishing-url-xjgv.onrender.com](https://phishing-url-xjgv.onrender.com/)

## Overview

ScamShield AI helps users inspect potentially fraudulent content from one dashboard. It identifies common social-engineering patterns, examines suspicious URL structures, performs lightweight media-forensics checks, stores scan history, and lets users submit community scam reports.

The project is designed as an educational security tool with a Flask API, a responsive browser interface, SQLite storage, and an optional Random Forest phishing-model training pipeline.

## Features

- **Message analysis** - checks SMS, email, WhatsApp text, screenshot text, and call transcripts for urgency, impersonation, threats, rewards, and requests for sensitive information.
- **URL trust scanner** - flags risky URL patterns such as missing HTTPS, raw IP addresses, URL shorteners, excessive subdomains, brand impersonation, and suspicious paths.
- **Media forensics** - reviews image metadata and simple pixel-level signals, while recording file size, dimensions, and video duration.
- **Community reporting** - accepts scam reports and assigns an initial risk level.
- **Threat dashboard** - displays scan metrics, trends, scam categories, recent reports, and analysis history.
- **Local persistence** - stores reports and scan history in SQLite.
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
- **Database:** SQLite
- **Media analysis:** Pillow
- **Machine learning:** pandas, NumPy, SciPy, scikit-learn, joblib
- **Deployment:** Gunicorn and Render-compatible `Procfile`

## Getting Started

### Prerequisites

- Python 3.10 or newer
- Git

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

The application creates `scamshield.db` automatically on first launch and adds a small set of sample reports.

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
| `POST` | `/api/analyze` | Analyze message or transcript content |
| `POST` | `/api/check-url` | Inspect a URL for phishing indicators |
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

## Project Structure

```text
ScamShield/
|-- app.py                  # Flask application and API routes
|-- detector.py             # Text, URL, and media risk analysis
|-- train_model.py          # Optional Random Forest training pipeline
|-- requirements.txt        # Python dependencies
|-- Procfile                # Gunicorn deployment command
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

For production, configure persistent storage if you want SQLite reports and scan history to survive redeployments.

## Contributing

Contributions, bug reports, and feature suggestions are welcome. Fork the repository, create a focused branch, and open a pull request describing your changes.

## Author

Created by [Sai Mohan Golle](https://github.com/gollesaimohan-source).
