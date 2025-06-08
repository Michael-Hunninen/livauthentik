'use client';

import React, { useRef, useEffect } from 'react';
import { useCart, CartItem } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, toggleSubscription, isCartOpen, closeCart, cartTotal } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, closeCart]);

  // Render quantity control
  const QuantityControl = ({ item }: { item: CartItem }) => {
    return (
      <div className="flex items-center border border-border/40 rounded-full w-24 h-8 overflow-hidden bg-background shadow-sm">
        <button 
          onClick={() => updateQuantity(item.cartItemId || `${item.id}-${item.isSubscription ? 'sub' : 'one'}`, Math.max(1, item.quantity - 1))}
          className="w-8 h-full flex items-center justify-center text-foreground hover:text-accent transition-colors"
          aria-label="Decrease quantity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.cartItemId || `${item.id}-${item.isSubscription ? 'sub' : 'one'}`, item.quantity + 1)}
          className="w-8 h-full flex items-center justify-center text-foreground hover:text-accent transition-colors"
          aria-label="Increase quantity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          ref={sidebarRef}
          className="w-screen max-w-md transform transition-all duration-500 ease-in-out shadow-2xl"
        >
          <div className="flex h-full flex-col overflow-y-scroll bg-background">
            {/* Header */}
            <div className="py-6 px-8 border-b border-border/20 flex justify-between items-center bg-background/95 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-xl font-serif font-medium tracking-tight">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="p-2 text-foreground hover:text-accent transition-colors rounded-full hover:bg-muted/30"
                aria-label="Close cart"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto py-6 px-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-3">Your cart is empty</h3>
                  <p className="text-muted mb-8 max-w-xs">Looks like you haven't added any items to your cart yet.</p>
                  <Link 
                    href="/products"
                    onClick={closeCart}
                    className="px-8 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-accent/20 transform hover:-translate-y-0.5 inline-block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map(item => (
                    <li 
                      key={item.cartItemId || `${item.id}-${item.isSubscription ? 'sub' : 'one'}`} 
                      className="border-b border-border/20 pb-6"
                    >
                      <div className="flex gap-5">
                        {/* Product Image */}
                        <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-muted/10 border border-border/20">
                          {item.imageSrc ? (
                            <Image 
                              src={item.imageSrc} 
                              alt={item.imageAlt || item.name} 
                              fill 
                              sizes="(max-width: 768px) 96px, 96px"
                              className="object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted/20">
                              <span className="text-muted text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{item.name}</h3>
                              <p className="text-sm text-muted mt-1">{item.description}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.cartItemId || `${item.id}-${item.isSubscription ? 'sub' : 'one'}`)}
                              className="text-muted hover:text-accent transition-colors p-1 hover:bg-muted/20 rounded-full"
                              aria-label="Remove item"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <p className="font-medium text-lg">
                                {item.isSubscription && item.subscriptionPrice ? item.subscriptionPrice : item.price}
                              </p>
                              {item.isSubscription && (
                                <p className="text-xs text-accent mt-0.5">Subscription</p>
                              )}
                            </div>
                            <QuantityControl item={item} />
                          </div>
                          
                          {/* Subscription Toggle */}
                          {item.subscriptionPrice && item.subscriptionPrice !== 'Billed monthly' && (
                            <button 
                              onClick={() => toggleSubscription(item.cartItemId || `${item.id}-${item.isSubscription ? 'sub' : 'one'}`)}
                              className={`mt-3 text-xs inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-300 ${item.isSubscription 
                                ? 'bg-accent/10 text-accent' 
                                : 'bg-muted/10 text-muted hover:bg-accent/5 hover:text-accent'}`}
                            >
                              <svg 
                                className="h-3.5 w-3.5 mr-1.5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={1.5} 
                                  d={item.isSubscription 
                                    ? "M5 13l4 4L19 7"
                                    : "M8 7h12m-12 7h12m-5 5l5-5-5-5"} 
                                />
                              </svg>
                              {item.isSubscription ? 'Subscription active' : 'Switch to subscription'}
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer with total and checkout button */}
            {cartItems.length > 0 && (
              <div className="p-8 border-t border-border/20 bg-background/95 backdrop-blur-md sticky bottom-0">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="h-px w-full bg-border/20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link 
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-4 bg-accent text-white rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-accent/20 transform hover:-translate-y-0.5 font-medium tracking-wide"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-3 mt-3 text-foreground hover:text-accent text-sm transition-colors font-medium border border-border/40 rounded-full hover:bg-muted/30"
                >
                  View Full Cart
                </Link>
                <p className="text-xs text-muted text-center mt-6">
                  We offer free shipping on orders over $100. Taxes calculated at checkout.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
