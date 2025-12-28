import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  profilePictureUrl: string;
  role: "student" | "teacher";
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
  loading: boolean;
}

/**
 * Hook to check authentication status
 */
export function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();

      if (data.authenticated) {
        setAuthStatus({
          authenticated: true,
          user: data.user,
          loading: false,
        });
      } else {
        setAuthStatus({
          authenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to check auth:", error);
      setAuthStatus({
        authenticated: false,
        loading: false,
      });
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthStatus({
        authenticated: false,
        loading: false,
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return { ...authStatus, logout, refresh: checkAuth };
}
