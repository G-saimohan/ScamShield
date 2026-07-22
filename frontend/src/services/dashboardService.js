import { apiRequest } from "./apiClient.js";

export function getDashboardData() {
  return apiRequest("/api/dashboard");
}
