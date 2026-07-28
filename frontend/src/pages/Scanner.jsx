import { useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { scanUrl } from "../services/scanService.js";
import RiskMeter from "../components/RiskMeter.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ThreatSummaryCard from "../components/ThreatSummaryCard.jsx";
import ThreatIntelCard from "../components/ThreatIntelCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import EmptyState from "../components/EmptyState.jsx";

/* ── helpers ─────────────────────────────────────────────────────── */
function classificationToStatus(c = "") {
  const norm = c.toLowerCase();
  if (norm.includes("malicious") || norm.includes("high")) return "malicious";
  if (norm.includes("suspicious") || norm.includes("medium")) return "suspicious";
  if (norm.includes("safe") || norm.includes("low") || norm.includes("clean")) return "safe";
  return "unknown";
}

/* ── Scanner ─────────────────────────────────────────────────────── */
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

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <PageContainer
      title="Scanner"
      subtitle="Analyze URLs in real‑time through the modular multi‑analyzer ScamShield scanning engine."
    >
      {/* ── Scan form ──────────────────────────────────────────── */}
      <form
        className="scan-form bg-dark bg-opacity-70 border border-secondary border-opacity-25 rounded-4 p-4 mb-4 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="w-100 mb-3 mb-md-0 flex-grow-1">
          <label
            htmlFor="scan-url-input"
            className="form-label small text-muted text-uppercase tracking-wider fw-bold"
          >
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
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. google.com or https://suspicious-site.net"
              required
              disabled={isScanning}
            />
            {url && !isScanning ? (
              <button
                type="button"
                className="btn btn-link text-muted border-0 px-3"
                onClick={() => setUrl("")}
                aria-label="Clear input"
              >
                <i className="bi bi-x-lg" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-info btn-lg px-4 fs-6 fw-bold rounded-3 scan-button d-flex align-items-center justify-content-center gap-2"
            type="submit"
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span
                  className="spinner-border spinner-border-sm text-dark"
                  role="status"
                  aria-hidden="true"
                />
                <span>Inspecting…</span>
              </>
            ) : (
              <>
                <i className="bi bi-shield-check" />
                <span>Analyze URL</span>
              </>
            )}
          </button>
          {result ? (
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-3 rounded-3 d-none d-md-flex align-items-center justify-content-center gap-2"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise" />
            </button>
          ) : null}
        </div>
      </form>

      {/* ── Error ──────────────────────────────────────────────── */}
      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      {/* ── Loading state ──────────────────────────────────────── */}
      {isScanning ? (
        <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 p-5 shadow-sm animate-fade-in">
          <LoadingSpinner message="Scanning domain reputation, SSL status, keywords, and AI threat profiles…" />
        </div>
      ) : null}

      {/* ── Empty state (no scan yet) ──────────────────────────── */}
      {!result && !isScanning && !error ? (
        <div className="animate-fade-in">
          <EmptyState
            icon="bi-shield-lock"
            title="Ready to Scan"
            description="Enter a URL or domain above to analyze its threat profile against the ScamShield intelligence engine."
          />
        </div>
      ) : null}

      {/* ── Results ────────────────────────────────────────────── */}
      {result && !isScanning ? (
        <div className="animate-fade-in">
          {/* Scanned URL header bar */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3 bg-dark bg-opacity-70 border border-secondary border-opacity-25 rounded-4">
            <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
              <i className="bi bi-globe2 text-info fs-5 flex-shrink-0" />
              <span
                className="text-light fw-semibold small text-truncate fw-mono"
                title={result.url || url}
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
              >
                {result.url || url}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <StatusBadge status={classificationToStatus(result.classification)} />
              {result.confidence !== undefined ? (
                <span className="badge bg-dark bg-opacity-60 border border-secondary border-opacity-25 text-muted rounded-pill px-2 py-1 fs-8 text-uppercase tracking-wider">
                  <i className="bi bi-bullseye me-1" />
                  {result.confidence}% confidence
                </span>
              ) : null}
            </div>
          </div>

          <div className="row g-4">
            {/* ── Left column: RiskMeter + Reasons ──────────────── */}
            <div className="col-12 col-lg-5">
              <div className="d-flex flex-column gap-4">
                <RiskMeter
                  score={result.risk_score}
                  classification={result.classification}
                />

                {/* Detection reasons as badges */}
                <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm w-100 overflow-hidden">
                  <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-list-stars text-info me-2 fs-5" />
                      <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                        Engine Indicators
                      </h3>
                    </div>
                    {result.reasons ? (
                      <span className="badge bg-info bg-opacity-15 text-info border border-info border-opacity-25 rounded-pill px-2 py-1 fs-8">
                        {result.reasons.length} finding{result.reasons.length !== 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </div>
                  <div className="card-body p-4">
                    {/* Confidence bar */}
                    {result.confidence !== undefined ? (
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small fw-bold text-uppercase tracking-wider">
                            Confidence Score
                          </span>
                          <strong className="text-light">{result.confidence}%</strong>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className={`progress-bar rounded-pill ${
                              result.confidence >= 80
                                ? "bg-success"
                                : result.confidence >= 50
                                  ? "bg-warning"
                                  : "bg-danger"
                            }`}
                            role="progressbar"
                            style={{
                              width: `${result.confidence}%`,
                              transition: "width 0.8s ease-out",
                            }}
                            aria-valuenow={result.confidence}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Reasons as badges */}
                    <h4 className="fs-7 text-uppercase fw-bold text-muted tracking-wider mb-3">
                      Detection Reasons
                    </h4>
                    {result.reasons && result.reasons.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {result.reasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="badge bg-dark bg-opacity-50 text-light border border-secondary border-opacity-25 px-3 py-2 rounded-pill fs-8 d-inline-flex align-items-center gap-1"
                            style={{ lineHeight: "1.4" }}
                          >
                            <i className="bi bi-dash-circle text-info" style={{ fontSize: "0.65rem" }} />
                            {reason}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-0">
                        <i className="bi bi-check-circle text-success me-1" />
                        No indicator warnings flagged.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column: ThreatSummary + ThreatIntel ─────── */}
            <div className="col-12 col-lg-7">
              <div className="d-flex flex-column gap-4">
                {result.threat_summary ? (
                  <ThreatSummaryCard threatSummary={result.threat_summary} />
                ) : null}

                {result.threat_intelligence ? (
                  <ThreatIntelCard
                    threatIntel={result.threat_intelligence}
                    domainName={result.url}
                  />
                ) : null}

                {/* Fallback if neither sub-card is available */}
                {!result.threat_summary && !result.threat_intelligence ? (
                  <EmptyState
                    icon="bi-file-earmark-lock"
                    title="No Extended Intelligence"
                    description="Extended threat analysis and intelligence data were not returned for this target."
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
