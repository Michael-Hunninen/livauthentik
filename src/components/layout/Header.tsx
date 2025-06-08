'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
              <div className="relative">
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
              <Link 
                href="/account" 
                className={`hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300 rounded-full hover:bg-accent/10 ${isScrolled || !isTransparentHeaderPage ? 'text-foreground hover:text-accent' : 'text-[#fffff0] hover:text-accent'}`}
                aria-label="Sign In"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <CartButton />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-foreground hover:text-accent p-2 transition-colors duration-300"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full left-0 transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-5 space-y-3 bg-background/95 backdrop-blur-xl border-t border-b border-border/20 shadow-lg">
          {isLoggedIn ? (
            /* Balanced Navigation - Shopping + Account Management */
            <>
              {/* User Profile Summary */}
              <div className="mb-4 pb-3 border-b border-border/10">
                <div className="flex items-center px-3 py-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center border border-border/20">
                    <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">Alex Johnson</p>
                    <div className="flex items-center">
                      <svg className="h-3 w-3 text-accent mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-xs text-accent">750 points</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Featured Devotion Experience */}
              <div className="mb-4 pb-3 border-b border-border/10 bg-gradient-to-r from-accent/5 to-background rounded-md">
                <h3 className="px-3 text-xs font-semibold text-accent mb-2 uppercase tracking-wider pt-2">Featured Experience</h3>
                <Link href="/account/dashboard/devotion" 
                  className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">Devotion Experience</span>
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="mb-4 pb-3 border-b border-border/10">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Navigation</h3>
                
                {/* Home Link */}
                <Link 
                  href="/" 
                  className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </div>
                </Link>
                
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
                    </Link>
                  </div>
                </div>

                {/* About Link */}
                <Link 
                  href="/about" 
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

                {/* Rewards Link */}
                <Link 
                  href="/rewards" 
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

                {/* Blog Link */}
                <Link 
                  href="/blog" 
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
              </div>
              
              {/* Account Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">My Account</h3>
                <Link href="/account/dashboard" 
                  className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/account/dashboard/orders" 
                  className="text-foreground hover:text-accent flex items-center justify-between px-3 py-3 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Orders
                  </div>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/account/dashboard/rewards" 
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
      </div>
    </header>
  );
}
