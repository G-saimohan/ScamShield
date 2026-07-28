const VARIANT_MAP = {
  safe: {
    className: "bg-success-subtle text-success-emphasis border-success-subtle",
    icon: "bi-check-circle-fill",
    label: "Safe",
  },
  suspicious: {
    className: "bg-warning-subtle text-warning-emphasis border-warning-subtle",
    icon: "bi-exclamation-triangle-fill",
    label: "Suspicious",
  },
  malicious: {
    className: "bg-danger-subtle text-danger-emphasis border-danger-subtle",
    icon: "bi-shield-exclamation",
    label: "Malicious",
  },
  unknown: {
    className: "bg-secondary-subtle text-secondary-emphasis border-secondary-subtle",
    icon: "bi-question-circle-fill",
    label: "Unknown",
  },
};

export default function StatusBadge({ status = "unknown" }) {
  const key = status.toLowerCase();
  const config = VARIANT_MAP[key] || VARIANT_MAP.unknown;

  return (
    <span
      className={`badge d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill border fw-semibold fs-8 text-uppercase tracking-wider ${config.className}`}
    >
      <i className={`bi ${config.icon}`} style={{ fontSize: "0.7rem" }} />
      {config.label}
    </span>
  );
}
