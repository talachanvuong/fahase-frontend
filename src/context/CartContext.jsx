import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend when component mounts (when user is logged in)
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/cart/get");
      if (res.data?.result?.products) {
        setCartItems(res.data.result.products);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.message || "Lỗi tải giỏ hàng");
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const productId = product._id || product.id;
      const res = await api.post("/cart/add", { product: productId });
      if (res.data?.status === 201 || res.data?.status === 200) {
        await loadCart();
        alert(`${product.title || product.name} đã được thêm vào giỏ hàng!`);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.result || err.message || "Lỗi thêm vào giỏ";
      setError(errorMsg);
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      if (res.data?.status === 200) {
        await loadCart();
        alert("Xóa khỏi giỏ hàng thành công");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.result || err.message || "Lỗi xóa khỏi giỏ";
      setError(errorMsg);
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const quantity = cartItems.length;
  const price = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        quantity,
        price,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
