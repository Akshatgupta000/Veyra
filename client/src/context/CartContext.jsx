import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cart as cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [bagTotal, setBagTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setBagTotal(0);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.get();
      setItems(res.data.items || []);
      setBagTotal(res.data.bagTotal || 0);
      setTotalItems(res.data.totalItems || 0);
    } catch {
      setItems([]);
      setBagTotal(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login first' };
    try {
      await cartApi.add(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartApi.update(cartItemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update' };
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartApi.remove(cartItemId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to remove' };
    }
  };

  return (
    <CartContext.Provider value={{ items, bagTotal, totalItems, loading, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
