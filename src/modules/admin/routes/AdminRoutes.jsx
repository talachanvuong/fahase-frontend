import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import AdminLogin from "../page/AdminLogin";
import Dashboard from "../page/DashBoard";

import OrderList from "../page/orders/OrderList";
import OrderDetail from "../page/orders/OrderDetail";

import CategoryList from "../page/Category/CategoryList";
import CategoryProducts from "../page/Category/CategoryProducts";
import ProductAdd from "../page/Category/ProductAdd";
import ProductDetail from "../page/Category/ProductDetail";
import ProductEdit from "../page/Category/ProductEdit";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Login admin */}
      <Route path="login" element={<AdminLogin />} />

      {/* Layout admin */}
      <Route path="/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        {/* Orders */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        {/* Categories */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/:categoryId/products" element={<CategoryProducts />} />
        <Route path="categories/:categoryId/products/add" element={<ProductAdd />} />
        <Route path="categories/:categoryId/products/:productId" element={<ProductDetail />} />
        <Route path="categories/:categoryId/products/:productId/edit" element={<ProductEdit />} />
      </Route>
    </Routes>
  );
}
