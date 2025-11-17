import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientRoutes from "../modules/client/routes/ClientRoutes";
import AdminRoutes from "../modules/admin/routes/AdminRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* CLIENT */}
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
