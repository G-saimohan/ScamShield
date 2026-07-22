import { useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { getDomainThreat, getTopThreats } from "../services/threatService.js";
import { formatDateTime } from "../utils/formatters.js";

export default function ThreatIntelligence() {
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState(null);
  const [topThreats, setTopThreats] = useState([]);
  const [error, setError] = useState("");

  const lookupDomain = async (event) => {
    event.preventDefault();
    setError("");
    setRecord(null);
    try {
      const response = await getDomainThreat(domain);
      setRecord(response.data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const loadTopThreats = async () => {
    setError("");
    try {
      const response = await getTopThreats();
      setTopThreats(response.data || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <PageContainer
      title="Threat Intelligence"
      subtitle="Basic access to the current threat intelligence APIs."
    >
      <form className="scan-form" onSubmit={lookupDomain}>
        <label className="form-label flex-grow-1">
          Domain
          <input
            className="form-control"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="example.com"
            required
          />
        </label>
        <button className="btn btn-info scan-button" type="submit">
          Lookup
        </button>
        <button className="btn btn-outline-light scan-button" type="button" onClick={loadTopThreats}>
          Top threats
        </button>
      </form>
      {error ? <div className="alert alert-danger mt-3">{error}</div> : null}
      {record ? (
        <section className="result-panel">
          <h2>{record.domain}</h2>
          <p>Reputation: {record.reputation}</p>
          <p>Highest risk: {record.highest_risk}</p>
          <p>Last seen: {formatDateTime(record.last_seen)}</p>
        </section>
      ) : null}
      {topThreats.length ? (
        <section className="result-panel">
          <h2>Top threats</h2>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Average risk</th>
                  <th>Reputation</th>
                </tr>
              </thead>
              <tbody>
                {topThreats.map((threat) => (
                  <tr key={threat.domain}>
                    <td>{threat.domain}</td>
                    <td>{threat.average_risk}</td>
                    <td>{threat.reputation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </PageContainer>
  );
}
