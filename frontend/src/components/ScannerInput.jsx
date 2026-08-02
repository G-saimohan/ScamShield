export default function ScannerInput({
  activeType,
  value,
  onChange,
  onFileChange,
  selectedFile,
  isScanning,
  onLoadSample,
  onSubmit,
  onReset,
}) {
  return (
    <div className="scanner-input-panel glass-panel">
      <div className="scanner-panel-heading">
        <div>
          <span className="scanner-eyebrow">Selected module</span>
          <h2>{activeType.label} Analysis</h2>
        </div>
        {activeType.comingSoon ? <span className="coming-soon-pill">Coming Soon</span> : null}
      </div>

      <form onSubmit={onSubmit}>
        {activeType.id === "url" ? (
          <div className="scanner-field">
            <label htmlFor="scanner-url">{activeType.inputLabel}</label>
            <div className="scanner-url-input">
              <i className="bi bi-link-45deg" />
              <input
                id="scanner-url"
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={activeType.placeholder}
                disabled={isScanning}
              />
            </div>
          </div>
        ) : null}

        {['email', 'sms', 'news'].includes(activeType.id) ? (
          <div className="scanner-field">
            <label htmlFor="scanner-text">{activeType.inputLabel}</label>
            <textarea
              id="scanner-text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={activeType.placeholder}
              rows={8}
              disabled={isScanning}
            />
          </div>
        ) : null}

        {['image', 'video'].includes(activeType.id) ? (
          <div className="scanner-field">
            <label>{activeType.inputLabel}</label>
            <div className="scanner-dropzone">
              <input
                id="scanner-file"
                type="file"
                accept={activeType.id === 'image' ? 'image/*' : 'video/*'}
                onChange={onFileChange}
                disabled
              />
              <i className={`bi ${activeType.id === 'image' ? 'bi-cloud-upload' : 'bi-film'}`} />
              <strong>{selectedFile?.name || `${activeType.label} scanning is coming soon`}</strong>
              <span>This module will be enabled when production media analysis is available.</span>
            </div>
          </div>
        ) : null}

        {!activeType.comingSoon ? (
          <button className="scanner-sample-button" type="button" onClick={onLoadSample}>
            <i className="bi bi-magic" />
            Use sample
          </button>
        ) : null}

        <div className="scanner-actions">
          <button className="btn-premium-primary" type="submit" disabled={isScanning || activeType.comingSoon}>
            {isScanning ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                Analyzing
              </>
            ) : (
              <>
                Run AI Scan
                <i className="bi bi-arrow-right" />
              </>
            )}
          </button>
          <button className="btn-premium-secondary" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
