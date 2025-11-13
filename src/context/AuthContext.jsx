/* eslint-disable react-refresh/only-export-components */

import React, {createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session user from backend if available
    const loadMe = async () => {
      try {
        const res = await api.get("/user/me");
        // backend returns { status, result }
        if (res.data?.result) {
          setUser(res.data.result);
        }
      } catch {
        // not logged in or error -> ignore
      } finally {
        setLoading(false);
      }
    };

    loadMe();

    // hỗ trợ demo login
    const handleDemo = (e) => {
      setUser({ ...e.detail, token: "demo" });
    };
    window.addEventListener("demo-login", handleDemo);
    return () => window.removeEventListener("demo-login", handleDemo);
  }, []);

  const login = () => {
    // Allow disabling redirect for debugging
    const disableLogin = typeof window !== 'undefined' && window.localStorage?.getItem('DISABLE_LOGIN_FLOW') === '1'
    if (disableLogin) return;

    // Redirect to backend passport login flow
    // Prefer explicit VITE_BACKEND_URL. If not provided, derive backend origin from VITE_API_URL
    // (VITE_API_URL is expected to include the /api path). This avoids defaulting to the
    // frontend origin (localhost:3000) which would break the OAuth flow.
    const backend =
      import.meta.env.VITE_BACKEND_URL ||
      (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/i, '') : 'http://localhost:5000');

    window.location.href = `${backend}/api/passport/login`;
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
