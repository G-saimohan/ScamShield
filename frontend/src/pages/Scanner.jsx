import { useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { scanUrl } from "../services/scanService.js";
import RiskMeter from "../components/RiskMeter.jsx";
import ThreatSummaryCard from "../components/ThreatSummaryCard.jsx";
import ThreatIntelCard from "../components/ThreatIntelCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsScanning(true);
    try {
      const response = await scanUrl(url);
      setResult(response);
    } catch (requestError) {
      setError(requestError.message || "Threat scanning failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <PageContainer
      title="Scanner"
      subtitle="Analyze URLs in real-time through the modular multi-analyzer ScamShield scanning engine."
    >
      <form className="scan-form bg-dark bg-opacity-70 border border-secondary border-opacity-25 rounded-4 p-4 mb-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="w-100 mb-3 mb-md-0 flex-grow-1">
          <label htmlFor="scan-url-input" className="form-label small text-muted text-uppercase tracking-wider fw-bold">
            Target URL / Domain for Inspection
          </label>
          <div className="input-group input-group-lg border border-secondary border-opacity-20 rounded-3 bg-dark bg-opacity-50 overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-link-45deg" />
            </span>
            <input
              id="scan-url-input"
              className="form-control bg-transparent border-0 text-white placeholder-secondary fs-6"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="e.g. google.com or https://suspicious-site.net"
              required
              disabled={isScanning}
            />
          </div>
        </div>
        <button className="btn btn-info btn-lg px-4 fs-6 fw-bold rounded-3 scan-button d-flex align-items-center justify-content-center gap-2" type="submit" disabled={isScanning}>
          {isScanning ? (
            <>
              <span className="spinner-border spinner-border-sm text-dark" role="status" aria-hidden="true"></span>
              <span>Inspecting...</span>
            </>
          ) : (
            <>
              <i className="bi bi-shield-check" />
              <span>Analyze URL</span>
            </>
          )}
        </button>
      </form>

      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      {isScanning ? (
        <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 p-5 shadow-sm">
          <LoadingSpinner message="Scanning domain reputation, SSL status, keywords, and AI threat profiles..." />
        </div>
      ) : null}

      {result && !isScanning ? (
        <div className="row g-4 animate-fade-in">
          <div className="col-12 col-lg-5">
            <div className="d-flex flex-column gap-4">
              <RiskMeter score={result.risk_score} classification={result.classification} />

              <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm w-100 overflow-hidden">
                <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
                  <i className="bi bi-list-stars text-info me-2 fs-5" />
                  <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Engine Indicators</h3>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">Confidence score:</span>
                    <strong className="text-light fs-6">{result.confidence}%</strong>
                  </div>
                  
                  <h4 className="fs-7 text-uppercase fw-bold text-muted tracking-wider mb-2">Findings List</h4>
                  {result.reasons && result.reasons.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {result.reasons.map((reason, idx) => (
                        <div key={idx} className="p-2.5 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-10 small text-light d-flex align-items-start gap-2.5">
                          <i className="bi bi-dash-circle text-info mt-0.5" />
                          <span style={{ lineHeight: "1.4" }}>{reason}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No indicator warnings flagged.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="d-flex flex-column gap-4">
              {result.threat_summary ? (
                <ThreatSummaryCard threatSummary={result.threat_summary} />
              ) : null}

              {result.threat_intelligence ? (
                <ThreatIntelCard threatIntel={result.threat_intelligence} domainName={result.url} />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
