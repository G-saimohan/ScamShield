import { useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { getDomainThreat, getTopThreats } from "../services/threatService.js";
import ThreatIntelCard from "../components/ThreatIntelCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatDateTime, riskBadgeClass } from "../utils/formatters.js";

export default function ThreatIntelligence() {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState(null);
  const [topThreats, setTopThreats] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookupDomain = async (event) => {
    event.preventDefault();
    setError("");
    setRecord(null);
    setTopThreats([]);
    setIsLoading(true);
    setSearched(true);
    try {
      const response = await getDomainThreat(domain);
      if (response && response.data) {
        setRecord(response.data);
      } else {
        setError("No threat intelligence record found for this domain.");
      }
    } catch (requestError) {
      setError(requestError.message || "Domain lookup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopThreats = async () => {
    setError("");
    setRecord(null);
    setTopThreats([]);
    setIsLoading(true);
    setSearched(true);
    try {
      const response = await getTopThreats();
      setTopThreats(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load top threats.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      title="Threat Intelligence"
      subtitle="Query domain reputation databases and review active malware / phishing campaigns."
    >
      <form className="scan-form bg-dark bg-opacity-70 border border-secondary border-opacity-25 rounded-4 p-4 mb-4 shadow-sm" onSubmit={lookupDomain}>
        <div className="flex-grow-1 mb-3 mb-md-0">
          <label htmlFor="threat-domain-input" className="form-label small text-muted text-uppercase tracking-wider fw-bold">
            Domain Name Lookup
          </label>
          <div className="input-group input-group-lg border border-secondary border-opacity-20 rounded-3 bg-dark bg-opacity-50 overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-globe" />
            </span>
            <input
              id="threat-domain-input"
              className="form-control bg-transparent border-0 text-white placeholder-secondary fs-6"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="e.g. malicious-site.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="d-flex gap-2 align-items-end">
          <button className="btn btn-info btn-lg px-4 fs-6 fw-bold rounded-3 scan-button" type="submit" disabled={isLoading}>
            Lookup
          </button>
          <button className="btn btn-outline-light btn-lg px-4 fs-6 fw-bold rounded-3 scan-button" type="button" onClick={loadTopThreats} disabled={isLoading}>
            Top Threats
          </button>
        </div>
      </form>

      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      {isLoading ? (
        <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 p-5 shadow-sm">
          <LoadingSpinner message="Searching global threat reputation database records..." />
        </div>
      ) : null}

      {record && !isLoading ? (
        <div className="row justify-content-center">
          <div className="col-12">
            <ThreatIntelCard threatIntel={record} domainName={record.domain} />
          </div>
        </div>
      ) : null}

      {topThreats.length > 0 && !isLoading ? (
        <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm overflow-hidden animate-fade-in">
          <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle text-danger me-2 fs-5 animate-pulse" />
            <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Database Top Threat Targets</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-hover-bg': 'rgba(255, 255, 255, 0.03)' }}>
                <thead>
                  <tr className="text-muted text-uppercase tracking-wider fs-8 border-bottom border-secondary border-opacity-15">
                    <th className="ps-4 py-3">Domain Name</th>
                    <th className="py-3">Average Risk</th>
                    <th className="py-3">Highest Risk</th>
                    <th className="py-3">Scans Run</th>
                    <th className="py-3">Reputation Profile</th>
                    <th className="pe-4 py-3 text-end">Last Scan Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {topThreats.map((threat) => (
                    <tr key={threat.domain} className="border-bottom border-secondary border-opacity-10">
                      <td className="ps-4 py-3 fw-mono text-info small">{threat.domain}</td>
                      <td className="py-3 text-light">{threat.average_risk}%</td>
                      <td className="py-3 text-danger fw-semibold">{threat.highest_risk}%</td>
                      <td className="py-3 text-muted">{threat.scan_count || 1}</td>
                      <td className="py-3">
                        <span className={`badge ${riskBadgeClass(threat.classification || threat.reputation)} px-2.5 py-1.5 rounded-pill fs-9 text-uppercase tracking-wider`}>
                          {threat.reputation || "Unknown"}
                        </span>
                      </td>
                      <td className="pe-4 py-3 text-end text-muted small">
                        {formatDateTime(threat.last_seen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {!searched && !isLoading && !record && topThreats.length === 0 ? (
        <EmptyState
          icon="bi-search-heart"
          title="Threat Intel Database Lookup"
          description="Enter a domain above to query reputation details, or retrieve the list of top threats targets recorded by ScamShield."
          actionLabel="Load Top Threats"
          onAction={loadTopThreats}
        />
      ) : null}
    </PageContainer>
  );
}
