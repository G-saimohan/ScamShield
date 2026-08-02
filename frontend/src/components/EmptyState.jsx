export default function EmptyState({
  icon = "bi-folder-x",
  title = "No intelligence records",
  description = "Perform a scan or search above to retrieve threat profiles.",
  actionLabel = "",
  onAction = null,
}) {
  return (
    <div className="empty-state glass-panel" role="status" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn-premium-secondary empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
