export default function EmptyState({
  icon = "bi-folder-x",
  title = "No intelligence records",
  description = "Perform a scan or search above to retrieve threat profiles.",
  actionLabel = "",
  onAction = null,
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 px-4 text-center rounded-4 border border-dashed border-secondary border-opacity-25 bg-opacity-25 bg-dark">
      <div className="bg-dark bg-opacity-50 rounded-circle p-4 mb-3 shadow-inner">
        <i className={`bi ${icon} text-secondary`} style={{ fontSize: "2.5rem" }} />
      </div>
      <h3 className="h5 fw-bold text-light mb-2">{title}</h3>
      <p className="text-muted small mx-auto mb-3" style={{ maxWidth: "340px" }}>
        {description}
      </p>
      {actionLabel && onAction ? (
        <button type="button" className="btn btn-outline-info btn-sm rounded-pill px-4" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
