export default function SummaryCard({ icon, title, value, description, variant = "info" }) {
  const borderClass = `border-${variant}`;
  const textClass = `text-${variant}`;
  const bgClass = `bg-${variant}`;

  return (
    <div className={`card h-100 border border-opacity-25 ${borderClass} bg-dark bg-opacity-70 text-white rounded-4 shadow-sm hover-shadow transition-all overflow-hidden`}>
      {/* Decorative cyber gradient glow overlay */}
      <div className="position-absolute top-0 end-0 p-3 opacity-10" style={{ transform: "translate(20%, -20%)" }}>
        <i className={`bi ${icon}`} style={{ fontSize: "6rem" }} />
      </div>
      
      <div className="card-body d-flex flex-column justify-content-between p-4 position-relative z-1">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-muted fw-bold text-uppercase tracking-wider fs-7">{title}</span>
          <div className={`p-2 rounded-3 ${bgClass} bg-opacity-15 ${textClass} d-inline-flex align-items-center justify-content-center`} style={{ width: "42px", height: "42px" }}>
            <i className={`bi ${icon} fs-4`} />
          </div>
        </div>
        <div>
          <h3 className="card-title fw-bold mb-2 text-light" style={{ fontSize: "2.2rem", letterSpacing: "-0.5px" }}>{value}</h3>
          <p className="card-text text-muted small mb-0">{description}</p>
        </div>
      </div>
    </div>
  );
}
