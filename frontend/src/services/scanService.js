import { apiRequest } from "./apiClient.js";

export function scanUrl(url) {
  return apiRequest("/api/scan/url", {
    method: "POST",
    body: { url },
  });
}

export function analyzeContent(content, contentType = "text") {
  return apiRequest("/api/analyze", {
    method: "POST",
    body: { content, content_type: contentType },
    auth: false,
  });
}

export function analyzeFile(file, contentType = "file", transcript = "") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("content_type", contentType);
  formData.append("transcript", transcript);

  return apiRequest("/api/analyze-file", {
    method: "POST",
    body: formData,
    auth: false,
    isFormData: true,
  });
}

export function analyzeMedia(file, metadata = {}) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return apiRequest("/api/analyze-media", {
    method: "POST",
    body: formData,
    auth: false,
    isFormData: true,
  });
}
