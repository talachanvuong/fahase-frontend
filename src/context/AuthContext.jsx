/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // session user
  const [admin, setAdmin] = useState(null); // session admin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admin session từ localStorage
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

    const loadMe = async () => {
      try {
        // Kiểm tra user session
        const resUser = await api.get("/user/me");
        if (resUser.data?.result) setUser(resUser.data.result);

        // Kiểm tra admin session từ API
        const resAdmin = await api.get("/admin/me");
        if (resAdmin.data?.result) {
          setAdmin(resAdmin.data.result);
          localStorage.setItem("admin", JSON.stringify(resAdmin.data.result));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadMe();

    // Hỗ trợ demo login cho user
    const handleDemo = (e) => {
      setUser({ ...e.detail, token: "demo" });
    };
    window.addEventListener("demo-login", handleDemo);
    return () => window.removeEventListener("demo-login", handleDemo);
  }, []);

  // Login admin bằng credentials
  const loginAdmin = async (display_name, password) => {
    try {
      const res = await api.post("/admin/login", { display_name, password });
      if (res.data?.status === 200 || res.data?.status === "success") {
        setAdmin(res.data.result);
        localStorage.setItem("admin", JSON.stringify(res.data.result));
        return { success: true, result: res.data.result };
      }
      return { success: false, message: res.data?.message || "Đăng nhập thất bại" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.result || err.message || "Lỗi server",
      };
    }
  };

  // Logout admin
  const logoutAdmin = async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // ignore
    }
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  // Login user via OAuth (redirect)
  const loginUser = () => {
    const disableLogin =
      typeof window !== "undefined" &&
      window.localStorage?.getItem("DISABLE_LOGIN_FLOW") === "1";
    if (disableLogin) return;

    const backend =
      import.meta.env.VITE_BACKEND_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, "")
        : "http://localhost:3000");

    window.location.href = `${backend}/api/passport/login`;
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
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
