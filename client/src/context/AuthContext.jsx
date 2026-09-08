import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

      const currentUser = response.data.data;

      setUser(currentUser);

      // IMPORTANT:
      // Return user so Login.jsx can check role
      return currentUser;
    } catch (error) {
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK AUTH ON APP LOAD
  // ==========================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        loading,

        logout,

        getCurrentUser,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}
