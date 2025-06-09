'use client';

import React, { useState, useEffect, useRef, ReactPortal } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import CartButton from '../cart/CartButton';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Inline styles to force mobile menu to have consistent behavior
  // Mobile menu constant styles to ensure they're not affected by scroll state
  const mobileMenuOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 9998 // Very high z-index to ensure it's above everything
  } as React.CSSProperties;
  
  const mobileMenuPanelStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    height: '100vh',
    width: '85%',
    maxWidth: '24rem',
    backgroundColor: 'white',
    color: '#0f172a', // dark color
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 9999, // Higher than overlay
    overflowY: 'scroll',
    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
    visibility: isMobileMenuOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease-out'
  };
  
  // Create a portal component for the mobile menu
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  

  // Toggle between shop and dashboard views
  const toggleView = () => {
    const newView = !isDashboardView;
    setIsDashboardView(newView);
    if (newView) {
      router.push('/account/dashboard');
    } else {
      router.push('/products');
    }
  };

  // Update view state based on current path
  useEffect(() => {
    setIsDashboardView(pathname?.includes('/account/dashboard') || false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
        // Only close shop dropdown if not hovering over it
        const target = event.target as HTMLElement;
        const isHoveringShop = target.closest('.shop-dropdown-container');
        if (!isHoveringShop) {
          setIsShopDropdownOpen(false);
        }
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Check if user is logged in and update on path changes
  useEffect(() => {
    // This code runs only on the client side
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
    
    // Auto-login if accessing dashboard
    if (typeof window !== 'undefined' && pathname?.includes('/account/dashboard')) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(loggedIn);
    }
  }, [pathname]);

  // Handle navigation to account pages
  const handleNavigation = (path: string) => {
    setIsProfileDropdownOpen(false);
    setIsShopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      // Use exactly 5px threshold for instant synchronization with other components
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Determine if we're on pages that need a transparent header (home, shop, products, programs, about, rewards)
  const isTransparentHeaderPage = 
    pathname === '/' || 
    pathname === '/shop' || 
    pathname === '/about' ||
    pathname === '/rewards' ||
    pathname.startsWith('/products') || 
    pathname.startsWith('/programs');

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 border-b ${
        isScrolled || !isTransparentHeaderPage 
          ? 'bg-background/90 backdrop-blur-xl shadow-md border-border/10 text-foreground' 
          : 'bg-transparent border-transparent text-[#fffff0]'
      }`}
    >
      <nav className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-20">
            <Link href="/" className="flex items-center group h-full">
              <div className="relative w-48 h-12 flex items-center">
                <div className="relative w-full h-full">
                  <div className="relative w-full h-full group/logo">
                    {/* White logo on home page (not scrolled) */}
                    <div className={`absolute inset-0 transition-opacity duration-200 ${!isScrolled && isTransparentHeaderPage ? 'opacity-100' : 'opacity-0'}`}>
                      <Image 
                        src="https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/ede1039b-2398-4da9-8c51-558cc788ca26.svg+xml"
                        alt="LivAuthentik Logo"
                        width={192}
                        height={48}
                        className="w-full h-full object-contain filter invert brightness-0"
                        priority
                        unoptimized
                      />
                    </div>
                    
                    {/* Black logo (scrolled or not home page) with foreground color - hides on hover */}
                    <div className={`absolute inset-0 transition-opacity duration-200 ${isScrolled || !isTransparentHeaderPage ? 'opacity-100 group-hover/logo:opacity-0' : 'opacity-0'}`}>
                      <div 
                        className="w-full h-full text-foreground" 
                        style={{
                          WebkitMaskImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/ede1039b-2398-4da9-8c51-558cc788ca26.svg+xml)',
                          maskImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/ede1039b-2398-4da9-8c51-558cc788ca26.svg+xml)',
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                          backgroundColor: 'currentColor'
                        }}
                      />
                    </div>
                    
                    {/* Accent color logo on hover - uses exact same text-accent class as navigation */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200 z-10 text-accent" 
                      style={{
                        WebkitMaskImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/ede1039b-2398-4da9-8c51-558cc788ca26.svg+xml)',
                        maskImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/ede1039b-2398-4da9-8c51-558cc788ca26.svg+xml)',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        backgroundColor: 'currentColor' // Uses the text-accent color from the className
                      }}
                    />
                    
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {/* Main Navigation */}
              {isDashboardView ? (
                // Dashboard Navigation
                <>
                  <Link 
                    href="/account/dashboard" 
                    className={`hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/account/dashboard' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/account/dashboard/orders" 
                    className={`hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname?.startsWith('/account/dashboard/orders') ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Orders
                  </Link>
                  <Link 
                    href="/account/dashboard/rewards" 
                    className={`hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname?.startsWith('/account/dashboard/rewards') ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Rewards
                  </Link>
                  <Link 
                    href="/account/dashboard/devotion" 
                    className={`hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname?.startsWith('/account/dashboard/devotion') ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Devotion
                  </Link>
                </>
              ) : (
                // Shop Navigation
                <>
                  <Link 
                    href="/" 
                    className={`${isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]'} hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <div 
                    className="relative group"
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <div 
                        className={`flex items-center cursor-pointer hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/shop' || pathname === '/products' || pathname?.startsWith('/product/') || pathname === '/programs' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                        onClick={() => {
                          router.push('/shop');
                          setIsShopDropdownOpen(false);
                        }}
                      >
                        Shop
                      </div>
                    </div>
                    <div 
                      className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-48 rounded-md shadow-lg ${isScrolled || !isTransparentHeaderPage ? 'bg-background/95 text-foreground' : 'bg-[#22201E]/95 text-[#fffff0]'} backdrop-blur-lg border border-border/20 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 z-50 ${isShopDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                      onMouseEnter={() => setIsShopDropdownOpen(true)}
                      onMouseLeave={() => setIsShopDropdownOpen(false)}
                    >
                      <div className="py-1" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href="/products"
                          className={`flex items-center px-4 py-2 text-sm ${isScrolled || !isTransparentHeaderPage ? 'hover:bg-accent/5' : 'hover:bg-white/10'} transition-all duration-200`}
                          onClick={() => {
                            setIsShopDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <svg className={`mr-2 h-4 w-4 ${isScrolled || !isTransparentHeaderPage ? 'text-accent' : 'text-[#caac8e]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Products
                        </Link>
                        <Link
                          href="/programs"
                          className={`flex items-center px-4 py-2 text-sm ${isScrolled || !isTransparentHeaderPage ? 'hover:bg-accent/5' : 'hover:bg-white/10'} transition-all duration-200`}
                          onClick={() => {
                            setIsShopDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <svg className={`mr-2 h-4 w-4 ${isScrolled || !isTransparentHeaderPage ? 'text-accent' : 'text-[#caac8e]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Programs
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/about" 
                    className={`${isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]'} hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/about' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    About
                  </Link>
                  
                  <Link 
                    href="/rewards" 
                    className={`${isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]'} hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/rewards' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Rewards
                  </Link>
                  
                  <Link 
                    href="/blog" 
                    className={`${isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]'} hover:text-accent py-2 text-sm uppercase tracking-widest font-medium transition-all duration-200 border-b-2 ${pathname === '/blog' ? 'border-accent text-accent' : 'border-transparent hover:border-accent'}`}
                  >
                    Blog
                  </Link>
                </>
              )}
              

            </div>
          </div>

          {/* Right Section with Cart and Account */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative hidden md:block">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsShopDropdownOpen(false);
                  }}
                  className="flex items-center hover:text-accent transition-all duration-200"
                  id="account-dropdown"
                  aria-label="Account menu"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                  aria-controls="account-dropdown-menu"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent/10 transition-all duration-200">
                    <svg 
                      className={`h-5 w-5 transition-all duration-200 ${isProfileDropdownOpen ? 'text-accent' : isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0] hover:text-accent'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      ref={dropdownRef}
                      id="account-dropdown-menu"
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-background/95 backdrop-blur-lg border border-border/20 shadow-lg py-1 z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="account-dropdown"
                    >
                    <div className="px-4 py-3 border-b border-border/10">
                      <p className="text-sm font-medium text-foreground">Alex Johnson</p>
                      <p className="text-xs text-muted-foreground truncate">alex@example.com</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/account/dashboard/settings" 
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/5 transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation('/account/dashboard/settings');
                        }}
                      >
                        <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <button 
                        onClick={toggleView}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/5 transition-all duration-200"
                      >
                        <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {isDashboardView ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          )}
                        </svg>
                        {isDashboardView ? 'Back to Store' : 'Go to Dashboard'}
                      </button>
                    </div>
                    <div className="py-1 border-t border-border/10">
                      <button 
                        onClick={() => {
                          localStorage.removeItem('isLoggedIn');
                          setIsLoggedIn(false);
                          setIsProfileDropdownOpen(false);
                          // Use window.location.href for full page reload to reset app state
                          window.location.href = '/';
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-accent/5 transition-colors duration-150"
                      >
                        <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Profile link - Desktop only */}
                <Link 
                  href="/account" 
                  className="hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300 rounded-full hover:bg-accent/10 text-foreground hover:text-accent"
                  aria-label="Sign In"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                
                {/* Cart Button - Desktop - Only show when not in account section */}
                {!pathname?.startsWith('/account') && <CartButton />}
              </>
            )}
            {/* Mobile Menu Button and Cart */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Cart Button - Only show when not in account section */}
              {!pathname?.startsWith('/account') && <CartButton />}
              
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className={`${isMobileMenuOpen ? 'text-foreground' : (isScrolled || !isTransparentHeaderPage ? 'text-foreground' : 'text-[#fffff0]')} hover:text-accent p-2 transition-all duration-300 relative z-50`}
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-5 flex flex-col justify-between items-center">
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} 
                  />
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} 
                  />
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with consistent backdrop blur */}
      {isMounted && isMobileMenuOpen && createPortal(
        <div 
          style={{
            ...mobileMenuOverlayStyle, 
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            transition: 'opacity 0.3s, visibility 0.3s'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />,
        document.body
      )}
      
      {/* Mobile Menu Panel with forced dark text */}
      {isMounted && createPortal(
        <div style={mobileMenuPanelStyle}>
          <div className="px-6 py-16 space-y-6">
          {isLoggedIn ? (
            /* Balanced Navigation - Shopping + Account Management */
            <>
              {/* Close button and profile section */}
              <div className="absolute top-5 right-5">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* User Profile Card */}
              <div className="mb-8 pb-6 border-b border-border/10">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border-2 border-accent/20 shadow-lg shadow-accent/5">
                    <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">Alex Johnson</p>
                    <div className="flex items-center mt-1 bg-accent/10 rounded-full px-3 py-1">
                      <svg className="h-3.5 w-3.5 text-accent mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-sm font-medium text-accent">750 points</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick account links */}
                <div className="flex gap-2 mt-5">
                  <Link 
                    href="/account/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg py-2.5 px-4 text-center text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/account/dashboard/rewards" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg py-2.5 px-4 text-center text-sm font-medium transition-colors duration-200"
                  >
                    Rewards
                  </Link>
                </div>
              </div>
              
              {/* Featured Devotion Experience */}
              <div className="mb-8">
                <h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-4">Devotion Experience</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Fitness */}
                  <Link 
                    href="/account/dashboard/devotion/fitness" 
                    className="relative overflow-hidden rounded-xl bg-[#6366f1]/10 hover:bg-[#6366f1]/15 p-4 transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative z-10">
                      <div className="w-9 h-9 rounded-lg bg-[#6366f1]/20 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Fitness</h4>
                      <p className="text-xs text-muted-foreground">3 active plans</p>
                    </div>
                  </Link>
                  
                  {/* Nutrition */}
                  <Link 
                    href="/account/dashboard/devotion/meals" 
                    className="relative overflow-hidden rounded-xl bg-[#22c55e]/10 hover:bg-[#22c55e]/15 p-4 transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative z-10">
                      <div className="w-9 h-9 rounded-lg bg-[#22c55e]/20 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Nutrition</h4>
                      <p className="text-xs text-muted-foreground">5 meal plans</p>
                    </div>
                  </Link>
                  
                  {/* Mind */}
                  <Link 
                    href="/account/dashboard/devotion/coaching/mindful-mornings" 
                    className="relative overflow-hidden rounded-xl bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/15 p-4 transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative z-10">
                      <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 12H6" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Mindfulness</h4>
                      <p className="text-xs text-muted-foreground">Daily sessions</p>
                    </div>
                  </Link>
                  
                  {/* View All */}
                  <Link 
                    href="/account/dashboard/devotion" 
                    className="relative overflow-hidden rounded-xl bg-background border border-border/30 hover:border-accent/30 hover:bg-accent/5 p-4 transition-all duration-300 flex flex-col items-center justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm font-medium text-accent">View All</span>
                    </div>
                    <div className="text-accent">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mb-6">
                <h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
                
                {/* Main navigation grid layout */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Home Link */}
                  <Link 
                    href="/" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-accent/5 border border-border/10 hover:border-accent/20 hover:bg-accent/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Home</span>
                  </Link>
                  
                  {/* Shop Link */}
                  <Link 
                    href="/shop" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-amber-500/5 border border-border/10 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Shop</span>
                  </Link>
                  
                  {/* Products Link */}
                  <Link 
                    href="/products" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-amber-600/5 border border-border/10 hover:border-amber-600/20 hover:bg-amber-600/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Products</span>
                  </Link>
                  
                  {/* Programs Link */}
                  <Link 
                    href="/programs" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-amber-700/5 border border-border/10 hover:border-amber-700/20 hover:bg-amber-700/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-700/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Programs</span>
                  </Link>
                </div>

                {/* Secondary navigation grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* About Link */}
                  <Link 
                    href="/about" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-blue-500/5 border border-border/10 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">About</span>
                  </Link>

                  {/* Rewards Link */}
                  <Link 
                    href="/rewards" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-amber-400/5 border border-border/10 hover:border-amber-400/20 hover:bg-amber-400/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Rewards</span>
                  </Link>

                  {/* Blog Link */}
                  <Link 
                    href="/blog" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-purple-500/5 border border-border/10 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Blog</span>
                  </Link>
                  
                  {/* Contact Link */}
                  <Link 
                    href="/contact" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-emerald-500/5 border border-border/10 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Contact</span>
                  </Link>
                </div>
              </div>
              
              {/* Account Section */}
              <div className="mt-8 mb-6">
                <h3 className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-4">My Account</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Dashboard Link */}
                  <Link 
                    href="/account/dashboard" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-blue-600/5 border border-border/10 hover:border-blue-600/20 hover:bg-blue-600/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>

                  {/* Orders Link */}
                  <Link 
                    href="/account/dashboard/orders" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-indigo-500/5 border border-border/10 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Orders</span>
                  </Link>

                  {/* Rewards Link */}
                  <Link 
                    href="/account/dashboard/rewards" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-amber-400/5 border border-border/10 hover:border-amber-400/20 hover:bg-amber-400/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Rewards</span>
                  </Link>
                  
                  {/* Settings Link */}
                  <Link 
                    href="/account/settings" 
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-slate-500/5 border border-border/10 hover:border-slate-500/20 hover:bg-slate-500/5 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </div>
              </div>
              
              {/* Premium Styled Logout Button */}
              <div className="mt-6 px-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Add logout functionality here
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-rose-500/20 text-rose-600 font-medium hover:bg-rose-500/20 transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          ) : /* Main Site Navigation */ (
            <>
              {/* Shop Dropdown */}
              <div className="mb-1">
                <div className="text-foreground flex items-center justify-between px-3 py-3 text-base font-medium">
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Shop
                  </div>
                </div>
                <div className="pl-8">
                  <Link 
                    href="/products" 
                    className="text-foreground hover:text-accent flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Products
                    </div>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link 
                    href="/programs" 
                    className="text-foreground hover:text-accent flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Programs
                    </div>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <Link href="/about" 
                className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </div>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/rewards" 
                className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rewards
                </div>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/blog" 
                className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Blog
                </div>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          )}

          {/* Sign In Button (Mobile) */}
          {!isLoggedIn && (
            <div className="px-3 py-4 border-t border-border/10">
              <Link
                href="/account"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>,
      document.body
      )}
    </header>
  );
}
