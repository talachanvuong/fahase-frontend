import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load session user & admin khi refresh
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data?.result) {
          setUser(res.data.result);
        }
      } catch {
        console.log("User not logged in");
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

    loadMe();

    const handleDemo = (e) => {
      setUser({ ...e.detail, token: "demo" });
      setLoading(false);
    };
    window.addEventListener("demo-login", handleDemo);
    return () => window.removeEventListener("demo-login", handleDemo);
  }, []);

  // ======= USER LOGIN 
  const login = () => {
    const disableLogin = typeof window !== 'undefined' && 
      window.localStorage?.getItem('DISABLE_LOGIN_FLOW') === '1';
    
    if (disableLogin) return;

    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backend}/api/passport/login`;
  };

  // ======= ADMIN LOGIN (Form)
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

  // ====LOGOUT CHUNG
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
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  const value = {
    user,
    setUser,
    loading,
    login,      
    loginAdmin,   
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};