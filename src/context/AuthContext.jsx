/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMe = async () => {
      try {
        // Kiểm tra user session
        const resUser = await api.get("/user/me");
        if (resUser.data?.result) {
          setUser(resUser.data.result);
        }
      } catch {
        console.log("User not logged in");
      }

      try {
        // Kiểm tra admin session
        const resAdmin = await api.get("/admin/me");
        if (resAdmin.data?.result) {
          setAdmin(resAdmin.data.result);
          localStorage.setItem("admin", JSON.stringify(resAdmin.data.result));
        }
      } catch {
        console.log("Admin not logged in");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  // ======= USER LOGIN (Google OAuth)
  const loginUser = () => {
    const backend =
      import.meta.env.VITE_BACKEND_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, "")
        : "http://localhost:5000");

    window.location.href = `${backend}/api/passport/login`;
  };

  // ======= ADMIN LOGIN (Form)
  const loginAdmin = async (display_name, password) => {
    try {
      const res = await api.post("/admin/login", { display_name, password });
      
      if (res.data?.status === 200 || res.data?.status === "success") {
        setAdmin(res.data.result);
        localStorage.setItem("admin", JSON.stringify(res.data.result));
        return { success: true, result: res.data.result };
      }
      
      return { 
        success: false, 
        message: res.data?.message || "Đăng nhập thất bại" 
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.result || err.message || "Lỗi server",
      };
    }
  };

  // ======= LOGOUT USER
  const logoutUser = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ======= LOGOUT ADMIN
  const logoutAdmin = async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // ignore
    }
    setAdmin(null);
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        setUser,
        setAdmin,
        loginUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};