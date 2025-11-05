import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientLayout from "../layout/ClientLayout";
import Home from "../page/Home";
import EbookDetail from "../page/EbookDetail";
import Cart from "../page/Cart";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ebook/:id" element={<EbookDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}
