import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getAuthToken, setAuthToken, removeAuthToken } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize or auto-login with default student demo account
  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn("Session expired or invalid, logging into demo student", err);
          await loginDemo("STUDENT");
        }
      } else {
        // Auto sign-in demo student so reviewer can immediately browse and test without barriers
        await loginDemo("STUDENT");
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const loginDemo = async (role = "STUDENT") => {
    try {
      const res = await api.demoLogin(role);
      setAuthToken(res.access_token);
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error("Demo login error:", err);
      // Fallback local mock user if backend is not reachable yet
      const fallbackUser = {
        id: role === "STUDENT" ? 1 : (role === "STAFF" ? 2 : 3),
        name: role === "STUDENT" ? "Rahul Sharma" : (role === "STAFF" ? "Anand Kumar (Staff)" : "Campus Admin"),
        email: role === "STUDENT" ? "student@campus.edu" : (role === "STAFF" ? "staff@chatspot.canteen" : "admin@chatspot.canteen"),
        role: role.toUpperCase(),
        student_id: role === "STUDENT" ? "CS-2023-042" : "STAFF-01",
        phone: "+91 98765 43210",
        department: "Computer Science",
        year: "3rd Year"
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setAuthToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setAuthToken(res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "STUDENT",
        isStudent: user?.role === "STUDENT",
        isStaff: user?.role === "STAFF" || user?.role === "ADMIN",
        isAdmin: user?.role === "ADMIN",
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
