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
  variant?: string; // Added variant field to distinguish between different variants
  cartItemId?: string; // Unique identifier for cart items
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: any, quantity: number, isSubscription: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleSubscription: (cartItemId: string) => void;
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
      // Get the stored cart data
      let items = JSON.parse(storedCart);
      
      // Migrate any items without cartItemId to ensure all items have proper IDs
      items = items.map((item: CartItem) => {
        if (!item.cartItemId) {
          const variant = item.variant || item.description || '';
          return {
            ...item,
            variant: variant,
            cartItemId: `${item.id}-${variant}-${item.isSubscription ? 'sub' : 'one'}`
          };
        }
        return item;
      });
      
      // Update the cart with properly ID'd items
      setCartItems(items);
      
      // Save the migrated items back to localStorage
      localStorage.setItem('livauthentik-cart', JSON.stringify(items));
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
      
      // Normalize variant name to ensure consistent keys
      const variantName = product.variant || product.description || '';
      const cartItemId = `${productId}-${variantName}-${isSubscription ? 'sub' : 'one'}`;
      
      console.log('Adding to cart:', {
        productId,
        variantName,
        isSubscription,
        cartItemId,
        quantity
      });
      
      // First check for existing item with cartItemId
      let existingItemIndex = prevItems.findIndex(item => 
        item.cartItemId === cartItemId
      );
      
      // If not found by cartItemId, check for legacy items (before our fix)
      // that might match by ID and subscription status
      if (existingItemIndex === -1) {
        existingItemIndex = prevItems.findIndex(item => 
          item.id === productId && 
          item.isSubscription === isSubscription && 
          (item.variant || '') === variantName
        );
      }

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        console.log('Found existing item, updating quantity');
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          // Ensure it has cartItemId
          variant: variantName,
          cartItemId: cartItemId
        };
        return updatedItems;
      } else {
        // Add new item with a unique cart item ID
        console.log('No existing item found, adding new item');
        return [...prevItems, {
          ...product,
          id: productId,
          quantity,
          isSubscription,
          variant: variantName,
          cartItemId: cartItemId
        }];
      }
    });
    openCart();
  };

  const removeFromCart = (cartItemId: string) => {
    // For debugging
    console.log('Attempting to remove item:', cartItemId);
    console.log('Current cart items:', cartItems);
    
    setCartItems(prevItems => {
      // First ensure all items have cartItemId
      const itemsWithIds = prevItems.map((item: CartItem) => {
        if (!item.cartItemId) {
          const variant = item.variant || item.description || '';
          return {
            ...item,
            variant: variant,
            cartItemId: `${item.id}-${variant}-${item.isSubscription ? 'sub' : 'one'}`
          };
        }
        return item;
      });
      
      // Then filter out the item to remove
      const updatedItems = itemsWithIds.filter(item => item.cartItemId !== cartItemId);
      
      // Log what's being kept and what's being removed
      console.log('Filtered cart items:', updatedItems);
      console.log('Items removed:', itemsWithIds.filter(item => item.cartItemId === cartItemId));
      
      return updatedItems;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map((item: CartItem) => {
        // If the item doesn't have a cartItemId, generate one
        if (!item.cartItemId) {
          const variant = item.variant || item.description || '';
          const generatedId = `${item.id}-${variant}-${item.isSubscription ? 'sub' : 'one'}`;
          
          // If this is the item we're updating
          if (generatedId === cartItemId) {
            return { 
              ...item, 
              quantity,
              variant: variant,
              cartItemId: generatedId
            };
          }
          
          // Otherwise just add the ID
          return {
            ...item,
            variant: variant,
            cartItemId: generatedId
          };
        }
        
        // Normal case - item has ID
        return item.cartItemId === cartItemId ? { ...item, quantity } : item;
      })
    );
  };

  const toggleSubscription = (cartItemId: string) => {
    setCartItems(prevItems => {
      // Ensure all items have cartItemId
      const itemsWithIds = prevItems.map((item: CartItem) => {
        if (!item.cartItemId) {
          const variant = item.variant || item.description || '';
          return {
            ...item,
            variant: variant,
            cartItemId: `${item.id}-${variant}-${item.isSubscription ? 'sub' : 'one'}`
          };
        }
        return item;
      });
      
      // Find the item to toggle
      const itemIndex = itemsWithIds.findIndex(item => item.cartItemId === cartItemId);
      if (itemIndex === -1) {
        console.log('Item not found for toggle subscription:', cartItemId);
        console.log('Available items:', itemsWithIds);
        return itemsWithIds;
      }
      
      const item = itemsWithIds[itemIndex];
      const newItems = [...itemsWithIds];
      
      // Create a new cart item ID with updated subscription status
      const newSubscriptionStatus = !item.isSubscription;
      const variant = item.variant || item.description || '';
      const newCartItemId = `${item.id}-${variant}-${newSubscriptionStatus ? 'sub' : 'one'}`;
      
      console.log('Toggling subscription for item:', item);
      console.log('New subscription status:', newSubscriptionStatus);
      console.log('New cart item ID:', newCartItemId);
      
      // Update the item with the new subscription status and cart item ID
      newItems[itemIndex] = {
        ...item,
        isSubscription: newSubscriptionStatus,
        cartItemId: newCartItemId
      };
      
      return newItems;
    });
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
