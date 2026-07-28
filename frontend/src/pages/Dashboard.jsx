import { Link } from "react-router-dom";
import PageContainer from "../layouts/PageContainer.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";

/* ── Placeholder data (no backend calls) ────────────────────────── */
const SUMMARY_CARDS = [
  {
    icon: "bi-search",
    title: "Total Scans",
    value: "1,284",
    description: "URLs analyzed this month",
    variant: "info",
  },
  {
    icon: "bi-exclamation-triangle",
    title: "Threats Detected",
    value: "47",
    description: "Confirmed malicious resources",
    variant: "danger",
  },
  {
    icon: "bi-shield-check",
    title: "Safe URLs",
    value: "1,192",
    description: "Verified safe destinations",
    variant: "success",
  },
  {
    icon: "bi-database-fill-gear",
    title: "Known Threats",
    value: "8,541",
    description: "Community‑reported indicators",
    variant: "warning",
  },
];

const RECENT_ACTIVITY = [
  {
    input: "https://secure-bank-login.example.com",
    kind: "URL",
    risk: "Malicious",
    score: 92,
    time: "2 min ago",
  },
  {
    input: "paypal-verify.phish.net",
    kind: "Domain",
    risk: "Suspicious",
    score: 68,
    time: "18 min ago",
  },
  {
    input: "https://docs.google.com/forms/d/abc123",
    kind: "URL",
    risk: "Safe",
    score: 5,
    time: "34 min ago",
  },
  {
    input: "free-crypto-airdrop.xyz",
    kind: "Domain",
    risk: "Malicious",
    score: 97,
    time: "1 hr ago",
  },
  {
    input: "https://github.com/ScamShield/releases",
    kind: "URL",
    risk: "Safe",
    score: 2,
    time: "2 hr ago",
  },
];

const THREAT_FEED = [
  {
    label: "APT29 phishing campaign targeting financial institutions",
    severity: "critical",
  },
  {
    label: "Credential harvesting via fake CAPTCHA pages detected",
    severity: "high",
  },
  {
    label: "New QR‑code redirect exploit circulating on social media",
    severity: "high",
  },
  {
    label: "Supply‑chain attack vector in npm package registry",
    severity: "medium",
  },
];

/* ── Dashboard ──────────────────────────────────────────────────── */
export default function Dashboard() {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Operational insights, scan statistics, and active threat profiles."
    >
      {/* ── Summary cards ────────────────────────────────────────── */}
      <div className="row g-4 mb-5">
        {SUMMARY_CARDS.map((card, idx) => (
          <div
            key={card.title}
            className="col-12 col-sm-6 col-lg-3 animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <SummaryCard {...card} />
          </div>
        ))}
      </div>

      {/* ── Recent activity + Threat feed ────────────────────────── */}
      <div className="row g-4 mb-5">
        {/* Recent scan history */}
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
                    {RECENT_ACTIVITY.map((scan, idx) => (
                      <tr key={idx} className="border-bottom border-secondary border-opacity-10">
                        <td
                          className="ps-4 py-3 text-truncate text-info small fw-semibold"
                          style={{ maxWidth: "260px", fontFamily: "monospace" }}
                          title={scan.input}
                        >
                          {scan.input}
                        </td>
                        <td className="py-3 small text-muted">
                          <span className="badge bg-dark bg-opacity-70 border border-secondary border-opacity-20 text-secondary px-2 py-1 rounded-pill fs-9 text-uppercase tracking-wider">
                            {scan.kind}
                          </span>
                        </td>
                        <td className="py-3">
                          <StatusBadge status={scan.risk} />
                        </td>
                        <td className="pe-4 py-3 text-end text-muted small">{scan.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Threat feed */}
        <div className="col-12 col-lg-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm h-100 overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-rss-fill text-warning me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                Threat Feed
              </h3>
            </div>
            <div className="card-body p-4 d-flex flex-column gap-3">
              {THREAT_FEED.map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-start gap-3 p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-10 transition-all hover-shadow"
                >
                  <div
                    className={`p-2 rounded d-flex align-items-center justify-content-center mt-0 ${
                      item.severity === "critical"
                        ? "bg-danger bg-opacity-15 text-danger"
                        : item.severity === "high"
                          ? "bg-warning bg-opacity-15 text-warning"
                          : "bg-info bg-opacity-15 text-info"
                    }`}
                  >
                    <i className="bi bi-bug-fill small" />
                  </div>
                  <div>
                    <p className="mb-1 text-light small fw-semibold" style={{ lineHeight: "1.4" }}>
                      {item.label}
                    </p>
                    <span
                      className={`fs-8 tracking-wider text-uppercase fw-bold ${
                        item.severity === "critical"
                          ? "text-danger"
                          : item.severity === "high"
                            ? "text-warning"
                            : "text-info"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick scan placeholder ───────────────────────────────── */}
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
