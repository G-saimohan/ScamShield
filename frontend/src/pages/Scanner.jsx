import { useMemo, useState } from "react";
import PageContainer from "../layouts/PageContainer.jsx";
import ScannerTypeCard from "../components/ScannerTypeCard.jsx";
import ScannerResultReport from "../components/ScannerResultReport.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { analyzeContent, scanUrl } from "../services/scanService.js";

const SCAN_TYPES = [
  {
    id: "url",
    label: "URL",
    icon: "bi-globe2",
    description: "Phishing links, spoofed domains, redirects",
    inputLabel: "URL or Domain",
    placeholder: "https://example-login-check.com",
  },
  {
    id: "email",
    label: "Email",
    icon: "bi-envelope-at",
    description: "Phishing emails and impersonation attempts",
    inputLabel: "Email Content",
    placeholder: "Paste the full suspicious email here...",
  },
  {
    id: "sms",
    label: "SMS",
    icon: "bi-chat-left-text",
    description: "Payment scams, OTP traps, urgent messages",
    inputLabel: "SMS or Message Content",
    placeholder: "Paste the suspicious SMS or chat message here...",
  },
  {
    id: "news",
    label: "Fake News",
    icon: "bi-newspaper",
    description: "Viral claims, social posts, news snippets",
    inputLabel: "News Article or Post",
    placeholder: "Paste the suspicious news article or social post here...",
  },
  {
    id: "image",
    label: "AI Image",
    icon: "bi-image",
    description: "Generated images and manipulated visuals",
    inputLabel: "Image Upload",
    placeholder: "",
    comingSoon: true,
  },
  {
    id: "video",
    label: "Deepfake Video",
    icon: "bi-camera-video",
    description: "Synthetic video and manipulated media",
    inputLabel: "Video Upload",
    placeholder: "",
    comingSoon: true,
  },
];

const SAMPLE_INPUTS = {
  url: "https://hdfc-netbanking-verify.secure-update.xyz/login",
  email:
    "Dear customer, your account has been suspended. Verify your KYC and enter your UPI PIN immediately at http://bank-verify-secure.example to avoid account closure.",
  sms:
    "URGENT: Your package is held by customs. Pay Rs 49 now and verify OTP at delivery-update.example or it will be returned.",
  news:
    "Breaking: Government announces instant refunds for all citizens today only. Submit Aadhaar, bank details and PIN through this short link to claim.",
};

export default function Scanner() {
  const [activeTypeId, setActiveTypeId] = useState("url");
  const [inputs, setInputs] = useState({
    url: "",
    email: "",
    sms: "",
    news: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const activeType = useMemo(
    () => SCAN_TYPES.find((type) => type.id === activeTypeId) || SCAN_TYPES[0],
    [activeTypeId],
  );

  function selectType(typeId) {
    setActiveTypeId(typeId);
    setResult(null);
    setError("");
    setSelectedFile(null);
  }

  function updateInput(value) {
    setInputs((current) => ({ ...current, [activeTypeId]: value }));
  }

  function loadSample() {
    const sample = SAMPLE_INPUTS[activeTypeId];
    if (sample) {
      updateInput(sample);
      setResult(null);
      setError("");
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (activeType.comingSoon) {
      setError(`${activeType.label} scanning is coming soon.`);
      return;
    }

    const value = inputs[activeTypeId]?.trim();
    if (!value) {
      setError(`Please enter ${activeType.inputLabel.toLowerCase()} to analyze.`);
      return;
    }

    setIsScanning(true);
    try {
      if (activeTypeId === "url") {
        const response = await scanUrl(value);
        setResult(normalizeUrlResult(response, value));
      } else {
        const response = await analyzeContent(value, contentTypeFor(activeTypeId));
        setResult(normalizeTextResult(response, value, activeTypeId));
      }
    } catch (requestError) {
      setError(requestError.message || "Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  }

  function resetScanner() {
    setInputs((current) => ({ ...current, [activeTypeId]: "" }));
    setSelectedFile(null);
    setResult(null);
    setError("");
  }

  return (
    <PageContainer
      title="AI Security Scanner"
      subtitle="Analyze URLs, Emails, SMS messages, News Articles, Images, and Videos using AI."
    >
      <div className="scanner-shell">
        <section className="scanner-type-grid" aria-label="Scan type">
          {SCAN_TYPES.map((type) => (
            <ScannerTypeCard
              key={type.id}
              type={type}
              isActive={activeTypeId === type.id}
              onSelect={selectType}
            />
          ))}
        </section>

        <section className="scanner-workspace">
          <div className="scanner-input-panel">
            <div className="scanner-panel-heading">
              <div>
                <span className="scanner-eyebrow">Selected module</span>
                <h2>{activeType.label} Analysis</h2>
              </div>
              {activeType.comingSoon ? <span className="coming-soon-pill">Coming Soon</span> : null}
            </div>

            <form onSubmit={handleSubmit}>
              {activeTypeId === "url" ? (
                <div className="scanner-field">
                  <label htmlFor="scanner-url">{activeType.inputLabel}</label>
                  <div className="scanner-url-input">
                    <i className="bi bi-link-45deg" />
                    <input
                      id="scanner-url"
                      type="text"
                      value={inputs.url}
                      onChange={(event) => updateInput(event.target.value)}
                      placeholder={activeType.placeholder}
                      disabled={isScanning}
                    />
                  </div>
                </div>
              ) : null}

              {["email", "sms", "news"].includes(activeTypeId) ? (
                <div className="scanner-field">
                  <label htmlFor="scanner-text">{activeType.inputLabel}</label>
                  <textarea
                    id="scanner-text"
                    value={inputs[activeTypeId]}
                    onChange={(event) => updateInput(event.target.value)}
                    placeholder={activeType.placeholder}
                    rows={8}
                    disabled={isScanning}
                  />
                </div>
              ) : null}

              {["image", "video"].includes(activeTypeId) ? (
                <div className="scanner-field">
                  <label>{activeType.inputLabel}</label>
                  <div className="scanner-dropzone">
                    <input
                      id="scanner-file"
                      type="file"
                      accept={activeTypeId === "image" ? "image/*" : "video/*"}
                      onChange={handleFileChange}
                      disabled
                    />
                    <i className={`bi ${activeTypeId === "image" ? "bi-cloud-upload" : "bi-film"}`} />
                    <strong>{selectedFile?.name || `${activeType.label} scanning is coming soon`}</strong>
                    <span>
                      This module will be enabled when production media analysis is available.
                    </span>
                  </div>
                </div>
              ) : null}

              {!activeType.comingSoon && SAMPLE_INPUTS[activeTypeId] ? (
                <button className="scanner-sample-button" type="button" onClick={loadSample}>
                  <i className="bi bi-magic" />
                  Use sample
                </button>
              ) : null}

              <div className="scanner-actions">
                <button
                  className="btn-premium-primary"
                  type="submit"
                  disabled={isScanning || activeType.comingSoon}
                >
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
                <button className="btn-premium-secondary" type="button" onClick={resetScanner}>
                  Reset
                </button>
              </div>
            </form>
          </div>

          <aside className="scanner-context-panel">
            <span className="scanner-eyebrow">Detection profile</span>
            <h3>{activeType.label}</h3>
            <p>{activeType.description}</p>
            <div className="context-list">
              <span>
                <i className="bi bi-check-circle" />
                Explainable classification
              </span>
              <span>
                <i className="bi bi-check-circle" />
                Risk scoring
              </span>
              <span>
                <i className="bi bi-check-circle" />
                Actionable recommendations
              </span>
            </div>
          </aside>
        </section>

        {error ? <ErrorAlert message={error} onDismiss={() => setError("")} /> : null}

        {isScanning ? (
          <div className="scanner-loading-panel">
            <div className="radar-hud">
              <i className="bi bi-shield-shaded text-info fs-3" />
            </div>
            <LoadingSpinner message="Analyzing threat indicators and preparing explainable report..." />
          </div>
        ) : null}

        {!result && !isScanning && !error ? (
          <EmptyState
            icon="bi-shield-lock"
            title="Scanner Ready"
            description="Choose a scan type, submit suspicious content, and ScamShield will return a risk report."
          />
        ) : null}

        <ScannerResultReport result={result} />
      </div>
    </PageContainer>
  );
}

function contentTypeFor(typeId) {
  if (typeId === "email") return "email";
  if (typeId === "news") return "news";
  return "message";
}

function normalizeUrlResult(response, input) {
  return {
    input,
    risk_score: response.risk_score ?? response.scam_probability ?? 0,
    classification: response.classification || response.risk_level || response.result || "Unknown",
    confidence: response.confidence,
    summary:
      response.explanation ||
      response.summary ||
      response.recommended_action ||
      "The URL scan completed, but no detailed AI summary was returned.",
    reasons: response.reasons || response.danger_indicators || response.indicators?.map(indicatorText) || [],
    recommendations: [response.recommended_action].filter(Boolean),
    threat_intelligence: response.threat_intelligence,
    domain: response.domain,
  };
}

function normalizeTextResult(response, input, typeId) {
  return {
    input: input.length > 140 ? `${input.slice(0, 140)}...` : input,
    risk_score: response.scam_probability ?? response.risk_score ?? 0,
    classification: response.risk_level || response.classification || "Unknown",
    confidence: response.confidence,
    summary:
      response.summary ||
      response.explanation ||
      `${SCAN_TYPES.find((type) => type.id === typeId)?.label || "Content"} analysis completed.`,
    reasons: response.indicators?.map(indicatorText) || response.reasons || [],
    recommendations: [response.recommended_action].filter(Boolean),
    threat_intelligence: response.threat_intelligence,
  };
}

function indicatorText(indicator) {
  if (typeof indicator === "string") return indicator;
  return [indicator.name, indicator.detail].filter(Boolean).join(": ");
}
