'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: string | number;
  subscriptionPrice?: string | number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
  isSubscription: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: any, quantity: number, isSubscription: boolean) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  toggleSubscription: (productId: number | string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Initialize cart from localStorage on client side only
  useEffect(() => {
    const storedCart = localStorage.getItem('livauthentik-cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('livauthentik-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Update cart count and total whenever cartItems change
  useEffect(() => {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);

    const total = cartItems.reduce((sum, item) => {
      // Handle both string and number price formats
      const getNumericPrice = (price: string | number | undefined): number => {
        if (price === undefined) return 0;
        if (typeof price === 'number') return price;
        return parseFloat(price.replace('$', ''));
      };
      
      const price = item.isSubscription && item.subscriptionPrice 
        ? getNumericPrice(item.subscriptionPrice) 
        : getNumericPrice(item.price);
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cartItems]);

  const addToCart = (product: any, quantity: number, isSubscription: boolean) => {
    setCartItems(prevItems => {
      const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
      const existingItemIndex = prevItems.findIndex(
        item => item.id === productId && item.isSubscription === isSubscription
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item with normalized ID
        return [...prevItems, {
          ...product,
          id: productId,
          quantity,
          isSubscription
        }];
      }
    });
    openCart();
  };

  // Helper function to compare IDs safely (handles both string and number IDs)
  const compareIds = (id1: string | number, id2: string | number): boolean => {
    return String(id1) === String(id2);
  };

  const removeFromCart = (productId: number | string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !compareIds(item.id, productId))
    );
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        compareIds(item.id, productId) ? { ...item, quantity } : item
      )
    );
  };

  const toggleSubscription = (productId: number | string) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        compareIds(item.id, productId)
          ? { ...item, isSubscription: !item.isSubscription }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('livauthentik-cart');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSubscription,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
