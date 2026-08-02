export default function LoadingState({ message }) {
  return (
    <div className="scanner-loading-panel glass-panel">
      <div className="radar-hud">
        <i className="bi bi-shield-shaded" />
      </div>
      <div className="loading-copy">
        <h3>Analyzing threat indicators</h3>
        <p>{message}</p>
        <div className="loading-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
