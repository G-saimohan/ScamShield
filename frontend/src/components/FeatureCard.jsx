export default function FeatureCard({ icon, title, description, comingSoon = false }) {
  return (
    <article className={`feature-card${comingSoon ? " coming-soon" : ""}`}>
      <div className="feature-card-top">
        <div className="feature-icon">
          <i className={`bi ${icon}`} />
        </div>
        {comingSoon ? <span className="coming-soon-pill">Coming Soon</span> : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
