import { useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { scanUrl } from "../services/scanService.js";
import { riskBadgeClass } from "../utils/formatters.js";

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
      setResult(await scanUrl(url));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <PageContainer title="Scanner" subtitle="Run the current protected URL scan endpoint.">
      <form className="scan-form" onSubmit={handleSubmit}>
        <label className="form-label flex-grow-1">
          URL
          <input
            className="form-control"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            required
          />
        </label>
        <button className="btn btn-info scan-button" type="submit" disabled={isScanning}>
          <i className="bi bi-search me-2" />
          {isScanning ? "Scanning..." : "Scan"}
        </button>
      </form>

      {error ? <div className="alert alert-danger mt-3">{error}</div> : null}

      {result ? (
        <section className="result-panel">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className={`badge ${riskBadgeClass(result.classification)}`}>
              {result.classification}
            </span>
            <strong>Risk score: {result.risk_score}</strong>
            <span className="text-secondary">Confidence: {result.confidence}</span>
          </div>
          <hr />
          <h2>Reasons</h2>
          <ul>
            {(result.reasons || []).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {result.threat_summary ? (
            <div className="mt-4">
              <h2>Threat summary</h2>
              <p>{result.threat_summary.summary}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </PageContainer>
  );
}
