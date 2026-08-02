export default function LoadingSpinner({ message = "Scanning resources..." }) {
  return (
    <div className="loading-shell" role="status" aria-live="polite">
      <div className="loading-orb" aria-hidden="true" />
      <div className="loading-copy">
        <div className="loading-copy-title">
          <i className="bi bi-shield-shaded" aria-hidden="true" />
          <span>{message}</span>
        </div>
        <div className="loading-skeletons" aria-hidden="true">
          <span className="loading-skeleton loading-skeleton-short" />
          <span className="loading-skeleton loading-skeleton-medium" />
          <span className="loading-skeleton loading-skeleton-long" />
        </div>
      </div>
    </div>
  );
}
