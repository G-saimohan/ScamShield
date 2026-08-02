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
            {type.comingSoon ? <span className="scanner-status">Coming Soon</span> : <span className="scanner-status available">Available</span>}
          </button>
        );
      })}
    </section>
  );
}
