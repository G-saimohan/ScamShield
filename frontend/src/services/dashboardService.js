import { apiRequest } from "./apiClient.js";

export function getDashboardData() {
  return apiRequest("/api/dashboard");
}

export function getDashboardSummary() {
  return apiRequest("/api/dashboard/summary");
}

export function getRecentScans() {
  return apiRequest("/api/dashboard/recent-scans");
}

export function getRiskDistribution() {
  return apiRequest("/api/dashboard/risk-distribution");
}

export function getThreatFeed() {
  return apiRequest("/api/dashboard/threat-feed");
}
