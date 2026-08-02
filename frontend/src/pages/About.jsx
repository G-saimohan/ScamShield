import PageContainer from "../layouts/PageContainer.jsx";

export default function About() {
  return (
    <PageContainer
      title="About ScamShield"
      subtitle="A public AI cybersecurity platform for identifying scams before they cause harm."
    >
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="glass-panel p-4 h-100">
            <h2 className="h4 text-light fw-bold mb-3">Explainable protection for everyday threats</h2>
            <p className="text-muted mb-0" style={{ lineHeight: 1.8 }}>
              ScamShield combines URL inspection, text analysis, media forensics, threat
              intelligence records, and AI-generated explanations into a single workflow.
              The goal is simple: help people understand whether something is safe, why it
              was flagged, and what to do next.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="glass-panel p-4 h-100">
            <h3 className="h6 text-uppercase tracking-wider text-info fw-bold mb-3">Capabilities</h3>
            <div className="d-flex flex-column gap-3">
              {["Phishing detection", "Scam message analysis", "Threat intelligence", "Explainable AI reports"].map((item) => (
                <div key={item} className="d-flex align-items-center gap-2 text-light">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
