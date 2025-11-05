/* eslint-disable react-refresh/only-export-components */

import React, {createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load session user from backend if available
    const loadMe = async () => {
      try {
        const res = await api.get("/user/me");
        // backend returns { status, result }
        if (res.data?.result) {
          setUser(res.data.result);
        }
      } catch (_) {
        // not logged in or error -> ignore
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
    const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    window.location.href = `${backend}/api/passport/login`;
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
