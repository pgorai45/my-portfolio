import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AdminUser } from "../types/admin";
import { adminApi, getStoredToken, setStoredToken, removeStoredToken } from "../services/api";

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminApi.getMe();
      const adminData = response.data || (response as any).admin;
      if (response.success && adminData) {
        setUser(adminData);
        setToken(currentToken);
      } else {
        removeStoredToken();
        setUser(null);
        setToken(null);
      }
    } catch {
      removeStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await adminApi.login(email, password);
      if (response.success && response.data?.token) {
        setStoredToken(response.data.token);
        setToken(response.data.token);
        setUser(response.data.admin);
        return { success: true };
      }
      return {
        success: false,
        message: response.message || "Invalid credentials",
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      removeStoredToken();
      setToken(null);
      setUser(null);
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
