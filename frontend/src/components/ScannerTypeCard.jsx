export default function ScannerTypeCard({ type, isActive, onSelect }) {
  return (
    <button
      type="button"
      className={`scanner-type-card ${isActive ? "active" : ""}`}
      onClick={() => onSelect(type.id)}
    >
      <span className="scanner-type-icon">
        <i className={`bi ${type.icon}`} />
      </span>
      <span className="scanner-type-copy">
        <strong>{type.label}</strong>
        <small>{type.description}</small>
      </span>
    </button>
  );
}
