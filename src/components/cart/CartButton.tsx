'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CartButton() {
  const { cartCount, openCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Determine if we're on pages that need a transparent header (home, shop, products, programs, about, rewards)
  const isTransparentHeaderPage = 
    pathname === '/' || 
    pathname === '/shop' || 
    pathname === '/about' ||
    pathname === '/rewards' ||
    pathname.startsWith('/products') || 
    pathname.startsWith('/programs');

  // Animate the cart icon when count changes
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);
  
  // Handle scroll effect for color change
  useEffect(() => {
    const handleScroll = () => {
      // Use exactly 5px threshold for instant synchronization with header
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent/10 transition-colors duration-200 group"
      onClick={openCart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open cart"
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <svg 
            className={`h-6 w-6 transition-all duration-200 group-hover:text-accent ${isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
            />
          </svg>
        </motion.div>
        
        {/* Cart count badge */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 z-20"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-md text-xs font-medium text-white">
                {cartCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
