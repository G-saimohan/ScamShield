import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../layouts/PageContainer.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import {
  getDashboardSummary,
  getRecentScans,
  getRiskDistribution,
  getThreatFeed,
} from "../services/dashboardService.js";

const EMPTY_SUMMARY = {
  total_scans: 0,
  threats_detected: 0,
  safe_urls: 0,
  known_threats: 0,
};

export default function Dashboard() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [recentScans, setRecentScans] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({});
  const [threatFeed, setThreatFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [summaryResponse, scansResponse, distributionResponse, feedResponse] =
          await Promise.all([
            getDashboardSummary(),
            getRecentScans(),
            getRiskDistribution(),
            getThreatFeed(),
          ]);

        if (!isMounted) return;

        setSummary(summaryResponse.data || EMPTY_SUMMARY);
        setRecentScans(scansResponse.data || []);
        setRiskDistribution(distributionResponse.data || {});
        setThreatFeed(feedResponse.data || []);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || "Failed to load dashboard data.");
        setSummary(EMPTY_SUMMARY);
        setRecentScans([]);
        setRiskDistribution({});
        setThreatFeed([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        icon: "bi-search",
        title: "Total Scans",
        value: formatCount(summary.total_scans),
        description: distributionDescription(riskDistribution),
        variant: "info",
      },
      {
        icon: "bi-exclamation-triangle",
        title: "Threats Detected",
        value: formatCount(summary.threats_detected),
        description: "Scans with medium or higher risk",
        variant: "danger",
      },
      {
        icon: "bi-shield-check",
        title: "Safe URLs",
        value: formatCount(summary.safe_urls),
        description: "Scans classified as safe",
        variant: "success",
      },
      {
        icon: "bi-database-fill-gear",
        title: "Known Threats",
        value: formatCount(summary.known_threats),
        description: "Domains in threat intelligence",
        variant: "warning",
      },
    ],
    [summary, riskDistribution],
  );

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Operational insights, scan statistics, and active threat profiles."
    >
      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      {isLoading ? (
        <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 p-5 shadow-sm mb-4">
          <LoadingSpinner message="Loading live dashboard data..." />
        </div>
      ) : null}

      <div className="row g-4 mb-5">
        {summaryCards.map((card, idx) => (
          <div
            key={card.title}
            className="col-12 col-sm-6 col-lg-3 animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <SummaryCard {...card} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm h-100 overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="bi bi-clock-history text-info me-2 fs-5" />
                <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                  Recent Activity
                </h3>
              </div>
              <Link
                to="/history"
                className="btn btn-link btn-sm text-info text-decoration-none p-0 fw-semibold fs-8 text-uppercase tracking-wider"
              >
                View all <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
            <div className="card-body p-0">
              {recentScans.length > 0 ? (
                <div className="table-responsive">
                  <table
                    className="table table-dark table-hover align-middle mb-0"
                    style={{
                      "--bs-table-bg": "transparent",
                      "--bs-table-hover-bg": "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <thead>
                      <tr className="text-muted text-uppercase tracking-wider fs-8 border-bottom border-secondary border-opacity-15">
                        <th className="ps-4 py-3">Resource / Input</th>
                        <th className="py-3">Type</th>
                        <th className="py-3">Classification</th>
                        <th className="pe-4 py-3 text-end">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, idx) => (
                        <tr
                          key={scan.scan_id || `${scan.input}-${idx}`}
                          className="border-bottom border-secondary border-opacity-10"
                        >
                          <td
                            className="ps-4 py-3 text-truncate text-info small fw-semibold"
                            style={{ maxWidth: "260px", fontFamily: "monospace" }}
                            title={scan.input}
                          >
                            {scan.input || "Unknown resource"}
                          </td>
                          <td className="py-3 small text-muted">
                            <span className="badge bg-dark bg-opacity-70 border border-secondary border-opacity-20 text-secondary px-2 py-1 rounded-pill fs-9 text-uppercase tracking-wider">
                              {scan.kind || "Resource"}
                            </span>
                          </td>
                          <td className="py-3">
                            <StatusBadge status={scan.risk || "Unknown"} />
                          </td>
                          <td className="pe-4 py-3 text-end text-muted small">
                            {formatRelativeTime(scan.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon="bi-clock-history"
                  title="No Scans Yet"
                  description="Run a URL scan to populate live dashboard activity."
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm h-100 overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-rss-fill text-warning me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                Threat Feed
              </h3>
            </div>
            <div className="card-body p-4 d-flex flex-column gap-3">
              {threatFeed.length > 0 ? (
                threatFeed.map((item, idx) => (
                  <div
                    key={item.threat_id || item.domain || idx}
                    className="d-flex align-items-start gap-3 p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-10 transition-all hover-shadow"
                  >
                    <div
                      className={`p-2 rounded d-flex align-items-center justify-content-center mt-0 ${severityClass(
                        item.severity,
                      )}`}
                    >
                      <i className="bi bi-bug-fill small" />
                    </div>
                    <div>
                      <p className="mb-1 text-light small fw-semibold" style={{ lineHeight: "1.4" }}>
                        {item.label || item.domain || "Unknown threat"}
                      </p>
                      <span className={`fs-8 tracking-wider text-uppercase fw-bold ${severityTextClass(item.severity)}`}>
                        {item.severity || "low"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon="bi-database"
                  title="No Threat Intel Yet"
                  description="Threat feed entries appear after scans create domain intelligence records."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-lightning-charge-fill text-info me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                Quick Scan
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-end gap-3">
                <div className="flex-grow-1">
                  <label className="form-label text-muted small fw-bold text-uppercase tracking-wider mb-2">
                    URL or Domain
                  </label>
                  <div className="input-group border border-secondary border-opacity-25 rounded-3 overflow-hidden">
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="bi bi-globe" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-0 text-white"
                      placeholder="Enter a URL, domain, or IP to analyze..."
                      disabled
                    />
                  </div>
                </div>
                <button
                  className="btn btn-info rounded-3 px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  type="button"
                  disabled
                >
                  <i className="bi bi-shield-check" />
                  Analyze
                </button>
              </div>
              <p className="text-muted small mt-3 mb-0">
                <i className="bi bi-info-circle me-1" />
                Scanner functionality available on the{" "}
                <Link to="/scanner" className="text-info text-decoration-none fw-semibold">
                  Scanner page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function formatCount(value) {
  return new Intl.NumberFormat().format(Number(value || 0));
}

function distributionDescription(distribution) {
  const highRisk = Number(distribution.high || 0) + Number(distribution.critical || 0);
  return `${formatCount(highRisk)} high-risk scans recorded`;
}

function formatRelativeTime(value) {
  if (!value) {
    return "Not available";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return String(value);
  }

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function severityClass(severity = "") {
  if (severity === "critical") return "bg-danger bg-opacity-15 text-danger";
  if (severity === "high") return "bg-warning bg-opacity-15 text-warning";
  if (severity === "medium") return "bg-info bg-opacity-15 text-info";
  return "bg-success bg-opacity-15 text-success";
}

function severityTextClass(severity = "") {
  if (severity === "critical") return "text-danger";
  if (severity === "high") return "text-warning";
  if (severity === "medium") return "text-info";
  return "text-success";
}
