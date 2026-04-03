import React, { createContext, useContext, useState } from 'react';

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook (SAFE)
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    console.error("useCart must be used inside CartProvider");
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
    };
  }

  return context;
};