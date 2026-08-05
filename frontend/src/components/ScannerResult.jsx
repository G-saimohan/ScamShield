import RiskMeter from "./RiskMeter.jsx";
import StatusBadge from "./StatusBadge.jsx";
import ThreatIntelCard from "./ThreatIntelCard.jsx";

export default function ScannerResult({ result }) {
  if (!result) return null;

  return (
    <section className="scanner-result animate-fade-in">
      <div className="scanner-result-header glass-panel">
        <div>
          <span className="scanner-eyebrow">Analysis complete</span>
          <h2>{result.input || "Submitted content"}</h2>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <StatusBadge status={normalizeStatus(result.classification)} />
          <span className="confidence-pill">
            <i className="bi bi-activity" />
            {formatConfidence(result.confidence)} Confidence
          </span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="scanner-result-card glass-panel h-100">
            <RiskMeter score={result.risk_score || 0} classification={result.classification || "Unknown"} />
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="scanner-result-card glass-panel h-100">
            <div className="result-section">
              <span className="scanner-eyebrow">Threat Summary</span>
              <p>{result.summary || "No AI summary was returned for this scan."}</p>
            </div>

            <div className="result-grid">
              <ResultList title="Reasons" icon="bi-list-check" items={result.reasons || []} emptyText="No specific threat indicators were returned." />
              <ResultList title="Recommendations" icon="bi-shield-check" items={result.recommendations || []} emptyText="No recommendation was returned." />
            </div>
          </div>
        </div>
      </div>

      {result.file_details || result.media_type ? (
        <div className="scanner-result-card glass-panel mt-4">
          <div className="result-section">
            <span className="scanner-eyebrow">Media Details</span>
            <div className="media-metadata">
              {result.media_type ? <p><strong>Type:</strong> {result.media_type}</p> : null}
              {result.file_details ? (
                <>
                  <p><strong>File:</strong> {result.file_details.name}</p>
                  <p><strong>Size:</strong> {formatBytes(result.file_details.size_bytes)}</p>
                  <p><strong>Content type:</strong> {result.file_details.content_type}</p>
                </>
              ) : null}
              {result.duration_seconds ? (
                <p><strong>Duration:</strong> {result.duration_seconds}s</p>
              ) : null}
              {result.forensic_metrics ? (
                <p><strong>Forensic score:</strong> {result.forensic_metrics?.entropy ?? "N/A"}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : result.threat_intelligence ? (
        <div className="mt-4">
          <ThreatIntelCard threatIntel={result.threat_intelligence} domainName={result.domain} />
        </div>
      ) : (
        <div className="scanner-result-card glass-panel mt-4">
          <div className="result-section mb-0">
            <span className="scanner-eyebrow">Threat Intelligence</span>
            <p>No threat intelligence summary was returned for this scan.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function ResultList({ title, icon, items, emptyText }) {
  return (
    <div className="result-list">
      <h3>
        <i className={`bi ${icon}`} />
        {title}
      </h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}

function normalizeStatus(value = "") {
  const normalized = String(value).toLowerCase();
  if (normalized.includes("malicious") || normalized.includes("high") || normalized.includes("phishing")) return "malicious";
  if (normalized.includes("suspicious") || normalized.includes("medium")) return "suspicious";
  if (normalized.includes("safe") || normalized.includes("low")) return "safe";
  return "unknown";
}

function formatConfidence(value) {
  if (value === undefined || value === null || value === "") return "N/A";
  return `${value}%`;
}

function formatBytes(bytes) {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(1)} ${units[index]}`;
}
