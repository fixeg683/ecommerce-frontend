import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paidProductIds, setPaidProductIds] = useState([]);

  // Restore paid products on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/my-paid-products/')
        .then(res => setPaidProductIds(res.data))
        .catch(() => {});
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i =>
      i.id === productId ? { ...i, quantity: qty } : i
    ));
  };

  const clearCart = () => setCart([]);

  const markProductsAsPaid = (ids) => {
    setPaidProductIds(prev => [...new Set([...prev, ...ids])]);
  };

  const hasPaid = (productId) => paidProductIds.includes(productId);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice,
      paidProductIds, markProductsAsPaid, hasPaid,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) return {
    cart: [], cartOpen: false, setCartOpen: () => {},
    addToCart: () => {}, removeFromCart: () => {},
    updateQuantity: () => {}, clearCart: () => {},
    totalItems: 0, totalPrice: 0,
    paidProductIds: [], markProductsAsPaid: () => {}, hasPaid: () => false,
  };
  return context;
};