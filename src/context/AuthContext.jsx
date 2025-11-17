/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user hoặc admin
  const [loading, setLoading] = useState(true);

  // 🔥 Load session user & admin khi refresh
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userRes = await api.get("/user/me", { withCredentials: true });
        if (userRes.data?.result) {
          setUser({ ...userRes.data.result, role: "user" });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Load user session failed:", err);
      }

      try {
        const adminRes = await api.get("/admin/me", { withCredentials: true });
        if (adminRes.data?.result) {
          setUser({ ...adminRes.data.result, role: "admin" });
        }
      } catch (err) {
        console.warn("Load admin session failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // ===========================
  // 🔵 USER LOGIN (OAuth)
  // ===========================
  const loginUser = () => {
    const backend =
      import.meta.env.VITE_BACKEND_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, "")
        : "http://localhost:5000");

    window.location.href = `${backend}/api/passport/login`;
  };

  // ===========================
  // 🔴 ADMIN LOGIN (Form)
  // ===========================
  const loginAdmin = async (display_name, password) => {
    try {
      const res = await api.post(
        "/admin/login",
        { display_name, password },
        { withCredentials: true }
      );

      if (res.data.status === 200) {
        const meRes = await api.get("/admin/me", { withCredentials: true });
        setUser({ ...meRes.data.result, role: "admin" });
        return { success: true };
      }

      return { success: false, message: res.data.result };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.result || "Lỗi server",
      };
    }
  };

  // ===========================
  // 🔘 LOGOUT CHUNG
  // ===========================
  const logout = async () => {
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Admin logout failed:", err);
    }

    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("User logout failed:", err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        loginAdmin,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
