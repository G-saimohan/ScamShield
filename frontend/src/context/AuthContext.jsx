import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";

const DEFAULT_USER = {
  id: "guest-analyst",
  name: "Security Analyst",
  email: "analyst@scamshield.local",
  role: "Lead Analyst",
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    setIsLoading(false);
    return DEFAULT_USER;
  }, []);

  const login = useCallback(async (credentials) => {
    return DEFAULT_USER;
  }, []);

  const register = useCallback(async (formPayload) => {
    return DEFAULT_USER;
  }, []);

  const logout = useCallback(async () => {
    setUser(DEFAULT_USER);
  }, []);

  const value = useMemo(
    () => ({
      user: user || DEFAULT_USER,
      isAuthenticated: true,
      isLoading,
      login,
      logout,
      refreshUser,
      register,
    }),
    [isLoading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
