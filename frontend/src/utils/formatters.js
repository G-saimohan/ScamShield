export function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

export function riskBadgeClass(classification = "") {
  const normalized = classification.toLowerCase();
  if (normalized.includes("malicious") || normalized.includes("high")) {
    return "text-bg-danger";
  }
  if (normalized.includes("medium")) {
    return "text-bg-warning";
  }
  if (normalized.includes("low")) {
    return "text-bg-info";
  }
  return "text-bg-success";
}
