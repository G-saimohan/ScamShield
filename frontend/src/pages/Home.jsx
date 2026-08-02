import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard.jsx";

const features = [
  {
    title: "URL Detection",
    icon: "bi-link-45deg",
    description: "Inspect suspicious links, redirects, phishing portals, and spoofed domains.",
  },
  {
    title: "Email Detection",
    icon: "bi-envelope-shield",
    description: "Analyze phishing emails for urgency cues, credential traps, and impersonation.",
    comingSoon: true,
  },
  {
    title: "SMS Detection",
    icon: "bi-chat-left-dots",
    description: "Flag scam messages, payment fraud, OTP theft attempts, and social engineering.",
    comingSoon: true,
  },
  {
    title: "Fake News Detection",
    icon: "bi-newspaper",
    description: "Evaluate suspicious claims, viral posts, and manipulative text patterns.",
    comingSoon: true,
  },
  {
    title: "AI Image Detection",
    icon: "bi-image",
    description: "Review generated images, edited documents, and visual authenticity signals.",
    comingSoon: true,
  },
  {
    title: "Deepfake Video Detection",
    icon: "bi-camera-video",
    description: "Assess synthetic media indicators across video and audio forensic signals.",
    comingSoon: true,
  },
];

const stats = [
  { label: "Threats detected", value: 12480 },
  { label: "URLs analyzed", value: 89240 },
  { label: "Images scanned", value: 18400 },
  { label: "Videos verified", value: 7320 },
  { label: "Threat intelligence records", value: 5160 },
];

const steps = [
  { title: "Submit", icon: "bi-upload" },
  { title: "AI Analysis", icon: "bi-cpu" },
  { title: "Threat Intelligence", icon: "bi-database-check" },
  { title: "Explainable Report", icon: "bi-file-earmark-text" },
  { title: "Recommendations", icon: "bi-shield-check" },
];

const stack = ["React", "Flask", "MongoDB", "Bootstrap", "Scikit-learn", "Explainable AI"];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="hero-kicker">
                <i className="bi bi-stars" />
                AI scam intelligence platform
              </div>
              <h1>AI-Powered Multi-Modal Scam Detection Platform</h1>
              <p className="hero-subtitle">
                Detect phishing URLs, scam emails, fake news, AI-generated images,
                deepfake videos, and suspicious SMS messages using explainable AI.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/scanner" className="btn-premium-primary">
                  Start AI Scan
                  <i className="bi bi-arrow-right" />
                </Link>
                <Link to="/threat-intelligence" className="btn-premium-secondary">
                  Threat Intelligence
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="hero-console">
                <div className="console-header">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="console-body">
                  <div className="console-row">
                    <span>Target</span>
                    <strong>secure-bank-verify.example</strong>
                  </div>
                  <div className="console-score">
                    <div>
                      <span>Risk score</span>
                      <strong>92</strong>
                    </div>
                    <span className="risk-chip">Malicious</span>
                  </div>
                  <div className="console-meter">
                    <span style={{ width: "92%" }} />
                  </div>
                  <div className="console-finding">
                    <i className="bi bi-exclamation-triangle-fill" />
                    Credential harvesting indicators detected.
                  </div>
                  <div className="console-finding safe">
                    <i className="bi bi-robot" />
                    Explainable report generated with recommended action.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-heading">
            <span>Protection Coverage</span>
            <h2>One scanner for modern scam surfaces</h2>
          </div>
          <div className="row g-4">
            {features.map((feature) => (
              <div key={feature.title} className="col-12 col-md-6 col-xl-4">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section compact">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong className="stat-counter">{formatStat(stat.value)}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-heading">
            <span>Workflow</span>
            <h2>How ScamShield Works</h2>
          </div>
          <div className="workflow">
            {steps.map((step, index) => (
              <div key={step.title} className="workflow-item">
                <div className="workflow-step">
                  <i className={`bi ${step.icon}`} />
                </div>
                <strong>Step {index + 1}</strong>
                <span>{step.title}</span>
                {index < steps.length - 1 ? <i className="bi bi-arrow-right workflow-arrow" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section compact">
        <div className="container">
          <div className="tech-panel">
            <div>
              <span>Technology Stack</span>
              <h2>Built with dependable production tools</h2>
            </div>
            <div className="tech-list">
              {stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatStat(value) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(value);
}
