export default function ThreatSummaryCard({ threatSummary }) {
  if (!threatSummary) return null;

  const {
    summary = "No threat summary details available.",
    key_findings = [],
    recommendations = [],
    confidence_explanation = "No confidence explanation provided."
  } = threatSummary;

  return (
    <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm w-100 overflow-hidden mb-4 animate-fade-in">
      <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
        <i className="bi bi-robot text-info me-2 fs-5 animate-pulse" />
        <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">AI Threat Explanation</h3>
      </div>
      <div className="card-body p-4">
        {/* Summary Section */}
        <div className="mb-4">
          <h4 className="fs-7 text-uppercase fw-bold text-info tracking-wider mb-2">Executive Summary</h4>
          <p className="text-muted small mb-0" style={{ lineHeight: "1.6" }}>{summary}</p>
        </div>

        {/* Key Findings */}
        {key_findings && key_findings.length > 0 ? (
          <div className="mb-4">
            <h4 className="fs-7 text-uppercase fw-bold text-warning tracking-wider mb-2">Key Findings</h4>
            <div className="d-flex flex-column gap-2">
              {key_findings.map((finding, index) => (
                <div key={index} className="d-flex align-items-start gap-2 bg-dark bg-opacity-40 p-2.5 rounded-3 border border-secondary border-opacity-10 small text-muted">
                  <i className="bi bi-exclamation-triangle text-warning me-1 mt-0.5" />
                  <span style={{ lineHeight: "1.4" }}>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 ? (
          <div className="mb-4">
            <h4 className="fs-7 text-uppercase fw-bold text-success tracking-wider mb-2">Recommendations</h4>
            <div className="d-flex flex-column gap-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="d-flex align-items-start gap-2 bg-dark bg-opacity-40 p-2.5 rounded-3 border border-secondary border-opacity-10 small text-muted">
                  <i className="bi bi-shield-check text-success me-1 mt-0.5" />
                  <span style={{ lineHeight: "1.4" }}>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Confidence Explanation */}
        <div className="pt-3 border-top border-secondary border-opacity-15">
          <h4 className="fs-7 text-uppercase fw-bold text-info tracking-wider mb-2">Confidence Assessment</h4>
          <p className="text-muted small mb-0" style={{ lineHeight: "1.6" }}>{confidence_explanation}</p>
        </div>
      </div>
    </div>
  );
}
