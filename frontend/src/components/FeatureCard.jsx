export default function FeatureCard({ icon, title, description, status = "coming" }) {
  const statusLabel = status === "available" ? "Available" : status === "beta" ? "Beta" : "Coming Soon";
  return (
    <article className={`feature-card`}> 
      <div className="feature-card-top">
        <div className="feature-icon">
          <i className={`bi ${icon}`} />
        </div>
        <span className={`feature-status ${status}`} aria-hidden>
          {statusLabel}
        </span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
