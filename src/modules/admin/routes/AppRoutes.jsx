// src/Routes/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "../modules/client/layout/ClientLayout";
import AdminLayout from "../modules/admin/layout/AdminLayout";
import Home from "../modules/client/page/Home";
import Shop from "../modules/client/page/Shop";
import EbookDetail from "../modules/client/page/EbookDetail";
import Login from "../modules/client/page/Login";
import Dashboard from "../modules/admin/page/Dashboard";
import ManageBooks from "../modules/admin/page/ManageBooks";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client routes (nested under layout) */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="ebook/:id" element={<EbookDetail />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-books" element={<ManageBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
