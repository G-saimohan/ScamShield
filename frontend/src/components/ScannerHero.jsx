export default function ScannerHero() {
  return (
    <section className="scanner-hero glass-panel">
      <div className="scanner-hero-copy">
        <div className="scanner-hero-kicker">
          <i className="bi bi-shield-shaded" />
          AI Security Scanner
        </div>
        <h2>Modern intelligence for suspicious content, links, and media.</h2>
        <p>
          Analyze URLs, emails, SMS messages, news articles, AI-generated images, and deepfake
          videos with explainable threat insights built for fast decisions.
        </p>
      </div>
      <div className="scanner-hero-panel">
        <div className="scanner-hero-chip">
          <i className="bi bi-broadcast" />
          Live analysis workflows
        </div>
        <div className="scanner-hero-chip">
          <i className="bi bi-cpu" />
          Explainable AI scoring
        </div>
        <div className="scanner-hero-chip">
          <i className="bi bi-diagram-3" />
          Threat-intelligence context
        </div>
      </div>
    </section>
  );
}
