import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (product) => {
    const normalized = {
      id: product._id ?? product.id,
      name: product.title ?? product.name,
      price: product.price ?? 0,
      image:
        product.thumbnail ?? product.image ?? (product._id ? `/api/blob/thumbnail/${product._id}` : undefined),
      quantity: 1,
    };
    setCartItems((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      if (exists) return prev; // keep single instance, no increase
      return [...prev, normalized];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, quantity) => {
    // Quantity changes are disabled per requirement; keep as no-op
    return;
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
