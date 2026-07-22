import { useEffect, useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import { getDashboardData } from "../services/dashboardService.js";
import SummaryCard from "../components/SummaryCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatDateTime, riskBadgeClass } from "../utils/formatters.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getDashboardData();
      setData(response);
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <PageContainer title="Dashboard" subtitle="Loading metrics and threat intelligence...">
        <LoadingSpinner message="Retrieving database intelligence stats..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard" subtitle="Failed to retrieve operational metrics.">
        <ErrorAlert message={error} onDismiss={loadData} />
      </PageContainer>
    );
  }

  const { metrics = {}, history = [], threat_feed = [] } = data || {};
  const totalScans = metrics.scans_today || 0;
  const highRisk = metrics.critical_threats || 0;
  const safeScans = Math.max(0, totalScans - highRisk);
  const knownThreats = metrics.community_reports || 0;

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Operational insights, scan statistics, and active threat profiles."
    >
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3 animate-fade-in">
          <SummaryCard
            icon="bi-search"
            title="Total Scans"
            value={totalScans.toLocaleString()}
            description="Total URLs analyzed by engine"
            variant="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <SummaryCard
            icon="bi-exclamation-triangle"
            title="High Risk URLs"
            value={highRisk.toLocaleString()}
            description="Confirmed malicious threats"
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <SummaryCard
            icon="bi-shield-check"
            title="Safe URLs"
            value={safeScans.toLocaleString()}
            description="URLs verified as safe to visit"
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <SummaryCard
            icon="bi-database-fill-gear"
            title="Known Threats"
            value={knownThreats.toLocaleString()}
            description="Reported threats in database"
            variant="warning"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm h-100 overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-clock-history text-info me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Recent Scan History</h3>
            </div>
            <div className="card-body p-0">
              {history && history.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-hover-bg': 'rgba(255, 255, 255, 0.03)' }}>
                    <thead>
                      <tr className="text-muted text-uppercase tracking-wider fs-8 border-bottom border-secondary border-opacity-15">
                        <th className="ps-4 py-3">Resource / Input</th>
                        <th className="py-3">Type</th>
                        <th className="py-3">Threat Classification</th>
                        <th className="pe-4 py-3 text-end">Analyzed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((scan, idx) => (
                        <tr key={idx} className="border-bottom border-secondary border-opacity-10">
                          <td className="ps-4 py-3 text-truncate fw-mono text-info small" style={{ maxWidth: "260px" }} title={scan.input}>
                            {scan.input}
                          </td>
                          <td className="py-3 small text-muted">
                            <span className="badge bg-dark bg-opacity-70 border border-secondary border-opacity-20 text-secondary px-2.5 py-1.5 rounded-pill fs-9 text-uppercase tracking-wider">
                              {scan.kind}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`badge ${riskBadgeClass(scan.risk)} px-2.5 py-1.5 rounded-pill fs-9 text-uppercase tracking-wider`}>
                              {scan.risk || "Safe"} ({scan.score || 0})
                            </span>
                          </td>
                          <td className="pe-4 py-3 text-end text-muted small">
                            {formatDateTime(scan.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4">
                  <EmptyState
                    icon="bi-shield-slash"
                    title="No Scans Logged"
                    description="Run a scanner scan to seed analysis results here."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm h-100 overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-rss-fill text-warning me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Active Threat Indicators</h3>
            </div>
            <div className="card-body p-4">
              {threat_feed && threat_feed.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {threat_feed.map((feed, index) => (
                    <div key={index} className="d-flex align-items-start gap-2.5 p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-10 transition-all hover-bg-dark">
                      <div className="p-1.5 rounded bg-danger bg-opacity-15 text-danger d-flex align-items-center justify-content-center mt-0.5 animate-pulse">
                        <i className="bi bi-bug-fill small" />
                      </div>
                      <div>
                        <p className="mb-0 text-light small fw-semibold" style={{ lineHeight: "1.4" }}>{feed}</p>
                        <span className="text-muted fs-8 tracking-wider text-uppercase d-block mt-1">Confirmed Campaign</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="bi-rss"
                  title="No feed updates"
                  description="Threat monitoring campaigns are currently inactive."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
