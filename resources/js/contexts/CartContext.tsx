import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

// Types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  formatted_price: string;
  image_url: string;
  weight: number;
  unit: string;
  quantity: number;
  notes?: string;
  category: {
    id: number;
    name: string;
  };
  stock_quantity?: number;
  available_stock?: number;
  max_order_quantity?: number;
  track_stock?: boolean;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        // Update quantity if item already exists
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
      };
    }

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from API on mount
  useEffect(() => {
    loadCart();
    
    // Reload cart after Inertia navigations (login, logout, etc.)
    const handleFinish = () => {
      setTimeout(() => {
        loadCart();
      }, 100);
    };

    router.on('finish', handleFinish);
    
    // Note: Inertia router doesn't support removing listeners
    // This is acceptable as it's a singleton and we want cart to always reload on navigation
  }, []);

  // Load cart from API
  const loadCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      dispatch({ type: 'LOAD_CART', payload: response.data.items });
    } catch (error: any) {
      // Silently handle 401 (unauthenticated) - expected for logged out users
      if (error.response?.status === 401) {
        dispatch({ type: 'LOAD_CART', payload: [] });
        return;
      }
      // Silently handle other errors - don't log to avoid console noise
      // Empty cart on error to prevent showing stale data
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
  };

  // Action creators with API calls
  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      await axios.post('/api/cart', {
        product_id: item.id,
        quantity: 1,
        notes: item.notes || null,
      });
      // Reload cart to get updated data with stock info
      await loadCart();
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart. Please try again.';
      alert(errorMessage);
      
      // Reload cart to ensure consistency
      await loadCart();
    }
  };

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      // Reload cart to get updated data
      await loadCart();
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      
      // Show error but reload cart anyway to stay in sync
      const errorMessage = error.response?.data?.message || 'Failed to remove item. Please try again.';
      alert(errorMessage);
      
      // Reload to show current state
      await loadCart();
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(id);
        return;
      }
      
      await axios.put(`/api/cart/${id}`, { quantity });
      // Reload cart to get updated data with stock validation
      await loadCart();
    } catch (error: any) {
      console.error('Error updating cart quantity:', error);
      
      // Show specific error (e.g., stock limit exceeded)
      const errorMessage = error.response?.data?.message || 'Failed to update quantity. Please try again.';
      alert(errorMessage);
      
      // Reload cart to show correct quantity
      await loadCart();
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      dispatch({ type: 'CLEAR_CART' });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      
      // Even if API fails, reload to get current state
      await loadCart();
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
