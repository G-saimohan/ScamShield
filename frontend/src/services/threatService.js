import { apiRequest } from "./apiClient.js";

export function getDomainThreat(domain) {
  return apiRequest(`/api/threats/domain/${encodeURIComponent(domain)}`);
}

export function getTopThreats(limit = 10) {
  return apiRequest(`/api/threats/top?limit=${limit}`);
}
