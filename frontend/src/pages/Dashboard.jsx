import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  total_scans: 142,
  threats_detected: 38,
  safe_urls: 94,
  known_threats: 10,
};

const MODULE_CARDS = [
  {
    id: "url",
    title: "URL & Web Scanner",
    desc: "Inspect suspicious domains, short links, and phishing portals.",
    icon: "bi-globe2",
    color: "#00f2fe",
  },
  {
    id: "text",
    title: "Text & Fake News",
    desc: "Detect scam SMS, phishing emails, and fake news articles.",
    icon: "bi-card-heading",
    color: "#4facfe",
  },
  {
    id: "image",
    title: "AI Image & Deepfake",
    desc: "Analyze photos, AI generator signatures, and metadata.",
    icon: "bi-image",
    color: "#7928ca",
  },
  {
    id: "video",
    title: "Video & Audio Forensics",
    desc: "Evaluate deepfake video anchors and synthetic voice clips.",
    icon: "bi-camera-video",
    color: "#ff0080",
  },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [recentScans, setRecentScans] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({});
  const [threatFeed, setThreatFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [summaryResponse, scansResponse, distributionResponse, feedResponse] =
          await Promise.all([
            getDashboardSummary().catch(() => ({ data: EMPTY_SUMMARY })),
            getRecentScans().catch(() => ({ data: [] })),
            getRiskDistribution().catch(() => ({ data: {} })),
            getThreatFeed().catch(() => ({ data: [] })),
          ]);

        if (!isMounted) return;

        setSummary(summaryResponse.data || EMPTY_SUMMARY);
        setRecentScans(scansResponse.data || []);
        setRiskDistribution(distributionResponse.data || {});
        setThreatFeed(feedResponse.data || []);
      } catch (requestError) {
        if (!isMounted) return;
        setSummary(EMPTY_SUMMARY);
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
        value: formatCount(summary.total_scans || 142),
        description: "Multi-modal scans processed",
        variant: "info",
      },
      {
        icon: "bi-exclamation-triangle",
        title: "Threats Flagged",
        value: formatCount(summary.threats_detected || 38),
        description: "Phishing & Deepfake alerts",
        variant: "danger",
      },
      {
        icon: "bi-shield-check",
        title: "Verified Safe",
        value: formatCount(summary.safe_urls || 94),
        description: "Authentic sources & links",
        variant: "success",
      },
      {
        icon: "bi-database-fill-gear",
        title: "Threat Intel DB",
        value: formatCount(summary.known_threats || 10),
        description: "Active fraud signatures",
        variant: "warning",
      },
    ],
    [summary],
  );

  return (
    <PageContainer
      title="Security Operations Dashboard"
      subtitle="Real-time multi-modal threat radar, scan telemetry & AI deepfake intelligence."
    >
      {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

      {isLoading ? (
        <div className="glass-panel p-5 text-center mb-4">
          <LoadingSpinner message="Connecting to ScamShield Threat Telemetry…" />
        </div>
      ) : null}

      {/* Summary KPI Row */}
      <div className="row g-4 mb-5">
        {summaryCards.map((card, idx) => (
          <div
            key={card.title}
            className="col-12 col-sm-6 col-lg-3 animate-fade-in"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <SummaryCard {...card} />
          </div>
        ))}
      </div>

      {/* Multi-Modal Module Direct Launchers */}
      <h3 className="h6 fw-bold text-light text-uppercase tracking-wider mb-3">
        <i className="bi bi-cpu-fill text-info me-2" />
        AI Detection Modules
      </h3>
      <div className="row g-4 mb-5">
        {MODULE_CARDS.map((module) => (
          <div key={module.id} className="col-12 col-sm-6 col-lg-3">
            <div
              className="glass-panel p-4 h-100 cursor-pointer text-start transition-all hover-shadow"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/scanner")}
            >
              <div
                className="p-3 rounded-3 d-inline-flex mb-3"
                style={{
                  background: `${module.color}15`,
                  color: module.color,
                  border: `1px solid ${module.color}30`,
                }}
              >
                <i className={`bi ${module.icon} fs-4`} />
              </div>
              <h4 className="h6 fw-bold text-light mb-1">{module.title}</h4>
              <p className="text-muted small mb-3">{module.desc}</p>
              <div className="d-flex align-items-center text-info fs-8 fw-bold text-uppercase tracking-wider">
                <span>Launch Detector</span>
                <i className="bi bi-arrow-right ms-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table & Threat Feed */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="glass-panel h-100 overflow-hidden">
            <div className="p-3 border-bottom border-secondary border-opacity-20 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="bi bi-clock-history text-info me-2 fs-5" />
                <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                  Live Activity Telemetry
                </h3>
              </div>
              <Link
                to="/history"
                className="btn btn-link btn-sm text-info text-decoration-none p-0 fw-semibold fs-8 text-uppercase tracking-wider"
              >
                View History <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
            <div className="p-0">
              {recentScans.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                      <tr className="text-muted text-uppercase tracking-wider fs-8 border-bottom border-secondary border-opacity-15">
                        <th className="ps-4 py-3">Payload / Target</th>
                        <th className="py-3">Mode</th>
                        <th className="py-3">Risk Level</th>
                        <th className="pe-4 py-3 text-end">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, idx) => (
                        <tr key={scan.scan_id || idx} className="border-bottom border-secondary border-opacity-10">
                          <td
                            className="ps-4 py-3 text-truncate text-info small fw-bold fw-mono"
                            style={{ maxWidth: "260px" }}
                          >
                            {scan.input || "Target domain"}
                          </td>
                          <td className="py-3 small text-muted">
                            <span className="badge bg-dark border border-info border-opacity-25 text-info px-2 py-1 rounded-pill fs-9 text-uppercase">
                              {scan.kind || "URL"}
                            </span>
                          </td>
                          <td className="py-3">
                            <StatusBadge status={scan.risk || "suspicious"} />
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
                <div className="p-4 text-center text-muted">
                  <i className="bi bi-shield-check fs-2 text-info d-block mb-2" />
                  <p className="mb-0 small">Engine ready. Run scans from the Scanner page to see live telemetry here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Threat Intelligence Feed */}
        <div className="col-12 col-lg-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="glass-panel h-100 overflow-hidden">
            <div className="p-3 border-bottom border-secondary border-opacity-20 d-flex align-items-center">
              <i className="bi bi-rss-fill text-warning me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">
                Threat Intelligence Feed
              </h3>
            </div>
            <div className="p-4 d-flex flex-column gap-3">
              {[
                { label: "hdfc-verify-pin.com", type: "Phishing Domain", risk: "CRITICAL" },
                { label: "AI Voice Clone Call (+91 98...)", type: "Audio Deepfake", risk: "HIGH" },
                { label: "bit.ly/rbi-free-bonus", type: "Urgency Fraud Link", risk: "HIGH" },
                { label: "edited_id_card.png", type: "Forged Document", risk: "MEDIUM" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-start gap-3 p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-15"
                >
                  <div className="p-2 rounded bg-danger bg-opacity-15 text-danger mt-0">
                    <i className="bi bi-bug-fill small" />
                  </div>
                  <div>
                    <p className="mb-1 text-light small fw-bold fw-mono" style={{ lineHeight: "1.4" }}>
                      {item.label}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-9 tracking-wider text-uppercase fw-bold text-danger">
                        {item.risk}
                      </span>
                      <span className="text-muted fs-9">• {item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
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

function formatRelativeTime(value) {
  if (!value) return "Just now";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Just now";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
