import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'FETCH_CART':
      return {
        ...state,
        cartItems: action.payload.items,
        cartCount: action.payload.count,
        loading: false,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        cartCount: action.payload.count,
        loading: false,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        cartCount: action.payload.count,
        loading: false,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: action.payload.items,
        cartCount: action.payload.count,
        loading: false,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        cartCount: 0,
        loading: false,
      };
    case 'CART_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  cartItems: [],
  cartCount: 0,
  loading: false,
  error: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  const calculateCount = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.get('/cart');
      const items = response.data.items || response.data;
      const count = Array.isArray(items) ? calculateCount(items) : 0;
      dispatch({ type: 'FETCH_CART', payload: { items: Array.isArray(items) ? items : [], count } });
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message || 'Failed to fetch cart' });
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, [isAuthenticated, fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!isAuthenticated) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.put(`/cart/${itemId}?quantity=${quantity}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, [isAuthenticated, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!isAuthenticated) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, [isAuthenticated, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.delete('/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, [isAuthenticated]);

  const value = {
    cartItems: state.cartItems,
    cartCount: state.cartCount,
    loading: state.loading,
    error: state.error,
    fetchCart,
    addToCart,
    updateQuantity,
    updateCartItem: updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
