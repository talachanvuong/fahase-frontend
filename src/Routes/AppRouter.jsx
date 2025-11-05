// src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientRoutes from "../modules/client/routes/ClientRoutes";
import AdminRoutes from "../modules/admin/routes/AdminRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<ClientRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
