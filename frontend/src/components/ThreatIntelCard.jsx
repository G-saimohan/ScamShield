import { formatDateTime } from "../utils/formatters.js";

export default function ThreatIntelCard({ threatIntel, domainName }) {
  if (!threatIntel) return null;

  const domain = domainName || threatIntel.domain || "Unknown Domain";
  const isKnown = threatIntel.known_domain !== undefined ? threatIntel.known_domain : true;
  const scanCount = threatIntel.scan_count !== undefined 
    ? threatIntel.scan_count 
    : (threatIntel.previous_scans !== undefined ? threatIntel.previous_scans : 1);
  const avgRisk = threatIntel.average_risk !== undefined ? threatIntel.average_risk : 0;
  const maxRisk = threatIntel.highest_risk !== undefined ? threatIntel.highest_risk : 0;
  const reputation = threatIntel.reputation || "Unknown";
  const firstSeen = threatIntel.first_seen;
  const lastSeen = threatIntel.last_seen;
  const reasons = threatIntel.reasons || [];

  const getReputationBadge = (rep) => {
    const norm = rep.toLowerCase();
    if (norm.includes("bad")) return "text-bg-danger";
    if (norm.includes("suspicious")) return "text-bg-warning";
    if (norm.includes("unknown")) return "text-bg-secondary";
    return "text-bg-success";
  };

  return (
    <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm w-100 overflow-hidden mb-4 animate-fade-in">
      <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <i className="bi bi-server text-info me-2 fs-5 animate-pulse" />
          <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Threat Database Record</h3>
        </div>
        <span className={`badge ${isKnown ? 'text-bg-warning' : 'text-bg-success'} text-uppercase tracking-wider fs-8`}>
          {isKnown ? 'Known Threat' : 'New Domain'}
        </span>
      </div>
      <div className="card-body p-4">
        <h4 className="h5 fw-bold text-light mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span className="text-info">{domain}</span>
          <span className={`badge ${getReputationBadge(reputation)} text-uppercase tracking-wider fs-8`}>
            Reputation: {reputation}
          </span>
        </h4>
        
        <div className="row g-3">
          <div className="col-6 col-md-4">
            <div className="bg-dark bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-10 text-center">
              <span className="d-block text-muted small text-uppercase tracking-wider mb-1">Scan Count</span>
              <strong className="fs-4 text-light">{scanCount}</strong>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="bg-dark bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-10 text-center">
              <span className="d-block text-muted small text-uppercase tracking-wider mb-1">Average Risk</span>
              <strong className="fs-4 text-light">{avgRisk}%</strong>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="bg-dark bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-10 text-center">
              <span className="d-block text-muted small text-uppercase tracking-wider mb-1">Highest Risk</span>
              <strong className="fs-4 text-danger">{maxRisk}%</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top border-secondary border-opacity-15 text-muted small">
          <div className="d-flex justify-content-between py-1">
            <span>First Seen:</span>
            <strong className="text-light">{formatDateTime(firstSeen)}</strong>
          </div>
          <div className="d-flex justify-content-between py-1">
            <span>Last Analyzed:</span>
            <strong className="text-light">{formatDateTime(lastSeen)}</strong>
          </div>
        </div>

        {reasons && reasons.length > 0 ? (
          <div className="mt-4">
            <h5 className="fs-7 text-uppercase fw-bold text-muted tracking-wider mb-2">Aggregated Threat Indicators</h5>
            <div className="d-flex flex-wrap gap-2">
              {reasons.map((reason, idx) => (
                <span key={idx} className="badge bg-dark bg-opacity-50 text-secondary border border-secondary border-opacity-25 px-2.5 py-1.5 rounded-pill fs-8">
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
