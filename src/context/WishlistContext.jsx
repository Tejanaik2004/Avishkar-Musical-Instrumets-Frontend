import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'FETCH_WISHLIST':
      return {
        ...state,
        wishlistItems: action.payload,
        loading: false,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        wishlistItems: [...state.wishlistItems, action.payload],
        loading: false,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (item) => (item._id || item.id || item.productId) !== action.payload
        ),
        loading: false,
      };
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        wishlistItems: [],
        loading: false,
      };
    case 'WISHLIST_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_WISHLIST' });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.get('/wishlist');
      const items = response.data.items || response.data;
      dispatch({ type: 'FETCH_WISHLIST', payload: Array.isArray(items) ? items : [] });
    } catch (error) {
      dispatch({
        type: 'WISHLIST_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch wishlist',
      });
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to manage your wishlist' };
    }

    const isInList = state.wishlistItems.some(
      (item) => (item._id || item.id || item.productId) === productId
    );

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.post(`/wishlist/toggle/${productId}`);
      if (isInList) {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
        return { success: true, inWishlist: false };
      } else {
        dispatch({ type: 'ADD_ITEM', payload: { productId } });
        return { success: true, inWishlist: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update wishlist';
      dispatch({ type: 'WISHLIST_ERROR', payload: message });
      return { success: false, error: message };
    }
  }, [isAuthenticated, state.wishlistItems]);

  const isInWishlist = useCallback(
    (productId) => {
      return state.wishlistItems.some(
        (item) => (item._id || item.id || item.productId) === productId
      );
    },
    [state.wishlistItems]
  );

  const value = {
    wishlistItems: state.wishlistItems,
    loading: state.loading,
    error: state.error,
    fetchWishlist,
    toggleWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
