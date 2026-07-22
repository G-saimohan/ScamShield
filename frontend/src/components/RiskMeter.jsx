import { useEffect, useState } from "react";

export default function RiskMeter({ score = 0, classification = "Safe" }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 800; // ms
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Color selection based on the score
  const getColor = (s) => {
    if (s >= 85) return "#dc3545"; // Malicious (Red)
    if (s >= 65) return "#fd7e14"; // High (Orange)
    if (s >= 40) return "#ffc107"; // Medium (Yellow/Orange)
    if (s >= 20) return "#0dcaf0"; // Low (Cyan/Blue)
    return "#198754"; // Safe (Green)
  };

  const getTextColorClass = (s) => {
    const norm = s.toLowerCase();
    if (norm.includes("malicious")) return "text-danger";
    if (norm.includes("high")) return "text-warning";
    if (norm.includes("medium")) return "text-info";
    if (norm.includes("low")) return "text-info-emphasis";
    return "text-success";
  };

  const color = getColor(animatedScore);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  return (
    <div className="d-flex flex-column align-items-center text-center p-4 bg-dark bg-opacity-70 border border-secondary border-opacity-25 rounded-4 shadow-sm w-100">
      <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: "150px", height: "150px" }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.3s" }}
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
          <span className="fw-bold fs-2 text-light" style={{ letterSpacing: "-1px" }}>{animatedScore}</span>
          <span className="text-uppercase text-muted fs-8 fw-semibold tracking-wider">Risk Score</span>
        </div>
      </div>
      <div className="mt-3">
        <h4 className={`h5 fw-bold mb-1 ${getTextColorClass(classification)}`}>
          {classification}
        </h4>
        <span className="text-muted small">Threat Classification</span>
      </div>
    </div>
  );
}
