export default function DetectionSelector({ types, activeTypeId, onSelect }) {
  return (
    <section className="scanner-selector" aria-label="Detection modules">
      {types.map((type) => {
        const isActive = activeTypeId === type.id;
        return (
          <button
            key={type.id}
            type="button"
            className={`scanner-type-card${isActive ? " active" : ""}`}
            onClick={() => onSelect(type.id)}
          >
            <div className="scanner-type-icon">
              <i className={`bi ${type.icon}`} />
            </div>
            <div className="scanner-type-copy">
              <strong>{type.label}</strong>
              <small>{type.description}</small>
            </div>
            {(() => {
              const status = type.status ? type.status : type.comingSoon ? "coming" : "available";
              const label = status === "available" ? "Available" : status === "beta" ? "Beta" : "Coming Soon";
              return <span className={`feature-status ${status}`}>{label}</span>;
            })()}
          </button>
        );
      })}
    </section>
  );
}
