export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 border-danger-subtle rounded-3 shadow-sm my-3 animate-fade-in" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-octagon-fill me-3 fs-4 text-danger animate-pulse" />
        <div className="fw-semibold">{message}</div>
      </div>
      {onDismiss ? (
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onDismiss} />
      ) : null}
    </div>
  );
}
