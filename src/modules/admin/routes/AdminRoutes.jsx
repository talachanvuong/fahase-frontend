import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import AdminLogin from "../page/AdminLogin";
import Dashboard from "../page/DashBoard";

import OrderList from "../page/orders/OrderList";
import OrderDetail from "../page/orders/OrderDetail";

import ProductList from "../page/products/ProductList";
import ProductAdd from "../page/products/ProductAdd";
import ProductDetail from "../page/products/ProductDetail";
import ProductEdit from "../page/products/ProductEdit";

import CategoryList from "../page/CategoryList";

import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Login admin — không cần bảo vệ */}
      <Route path="login" element={<AdminLogin />} />

      {/* === Nếu muốn yêu cầu login admin === */}
      {/* Cách an toàn: comment từng Route */}
      {/*
      <Route path="/*" element={
        <ProtectedRoute requiredRole="admin" loginPath="/admin/login">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductAdd />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />

        <Route path="categories" element={<CategoryList />} />
      </Route>
      */}

      {/* === Nếu muốn bỏ ràng buộc login admin === */}
      <Route path="/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductAdd />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />

        <Route path="categories" element={<CategoryList />} />
      </Route>
    </Routes>
  );
}
