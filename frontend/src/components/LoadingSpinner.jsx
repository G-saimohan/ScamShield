export default function LoadingSpinner({ message = "Scanning resources..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div className="spinner-grow text-info mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-secondary small fw-bold text-uppercase tracking-wider">
        <i className="bi bi-shield-shaded me-2 animate-pulse" />
        {message}
      </div>
    </div>
  );
}
