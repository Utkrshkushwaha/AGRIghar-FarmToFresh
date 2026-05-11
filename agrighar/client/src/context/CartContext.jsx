import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("agrighar_cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("agrighar_cart", JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((i) => i._id === product._id);
    if (existing) {
      saveCart(cartItems.map((i) =>
        i._id === product._id ? { ...i, cartQty: i.cartQty + qty } : i
      ));
    } else {
      saveCart([...cartItems, { ...product, cartQty: qty }]);
    }
  };

  const removeFromCart = (productId) => {
    saveCart(cartItems.filter((i) => i._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    saveCart(cartItems.map((i) => i._id === productId ? { ...i, cartQty: qty } : i));
  };

  const clearCart = () => saveCart([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.cartQty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.cartQty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
