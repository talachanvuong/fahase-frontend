import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data?.result) {
          setUser(res.data.result);
        }
      } catch {
        console.log("User not logged in");
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

  const login = () => {
    const disableLogin = typeof window !== 'undefined' && 
      window.localStorage?.getItem('DISABLE_LOGIN_FLOW') === '1';
    
    if (disableLogin) return;

    const backend =
      import.meta.env.VITE_BACKEND_URL
      window.location.href = `${backend}/api/passport/login`;
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore
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
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};