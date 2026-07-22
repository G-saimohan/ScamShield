import PageContainer from "../layouts/PageContainer.jsx";

export default function Settings() {
  return (
    <PageContainer title="Settings" subtitle="ScamShield system parameters and operational metadata configurations.">
      <div className="row justify-content-center animate-fade-in">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-sliders text-info me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Engine Configuration</h3>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10 pb-3">
                  <div>
                    <h4 className="h6 fw-bold text-light mb-1">Theme Mode</h4>
                    <p className="text-muted small mb-0">System defaults to unified cybersecurity dark theme mode.</p>
                  </div>
                  <span className="badge bg-dark text-info border border-info border-opacity-30 text-uppercase tracking-wider fs-9 px-2.5 py-1.5 rounded-pill">Dark Mode (Default)</span>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10 pb-3">
                  <div>
                    <h4 className="h6 fw-bold text-light mb-1">Scam Detection Aggregator</h4>
                    <p className="text-muted small mb-0">Analyzers active: URL, Domain, SSL, Keywords, Reputation.</p>
                  </div>
                  <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 text-uppercase tracking-wider fs-9 px-2.5 py-1.5 rounded-pill">Active</span>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-10 pb-3">
                  <div>
                    <h4 className="h6 fw-bold text-light mb-1">API Base Endpoint</h4>
                    <p className="text-muted small mb-0">Local server connection proxy configuration.</p>
                  </div>
                  <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 text-lowercase tracking-normal fs-9 px-2.5 py-1.5 rounded-pill fw-mono">/api</span>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="h6 fw-bold text-light mb-1">AI Explanation Provider</h4>
                    <p className="text-muted small mb-0">Modular LLM text summary generator.</p>
                  </div>
                  <span className="badge bg-dark text-info border border-secondary border-opacity-20 text-uppercase tracking-wider fs-9 px-2.5 py-1.5 rounded-pill">Mock LLM Provider</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
