import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "./apiClient.js";

function extractAuthPayload(response) {
  const data = response.data || {};
  return {
    user: data.user || null,
    token: data.access_token || data.token || null,
  };
}

export async function login(credentials) {
  const response = await apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
  const payload = extractAuthPayload(response);
  setStoredToken(payload.token);
  return payload;
}

export async function register(payload) {
  const response = await apiRequest("/api/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  });
  const authPayload = extractAuthPayload(response);
  setStoredToken(authPayload.token);
  return authPayload;
}

export async function getCurrentUser() {
  const response = await apiRequest("/api/auth/me");
  return response.data?.user || null;
}

export async function logout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } finally {
    clearStoredToken();
  }
}

export { clearStoredToken, getStoredToken };
