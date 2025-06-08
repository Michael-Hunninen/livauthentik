'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { motion, useAnimation, AnimatePresence, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ProductVariant {
  id: string;
  name: string;
  description: string;
  price: number;
  subscriptionPrice: number;
  features: string[];
  badge?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  variants?: ProductVariant[];
  price?: string | number;
  subscriptionPrice?: string | number;
  regularPrice?: string | number;
  subscriptionOnly?: boolean;
  href: string;
  imageSrc: string;
  imageAlt: string;
  cta: string;
  badge?: string;
}

// In a real app, this would come from an API or database
const productsData = [
  {
    id: 1,
    name: 'Devotion',
    description: 'Premium Protein & Colostrum Supplement',
    longDescription: 'Our flagship supplement designed to enhance your overall wellness. Made with premium ingredients including the highest quality colostrum and protein blend to support immunity, vitality, and optimal health.',
    features: [
      'Premium grass-fed colostrum',
      'High-quality protein blend',
      'Immune system support',
      'Enhanced recovery',
      'Improved gut health'
    ],
    variants: [
      {
        id: 'single',
        name: 'Single Pack',
        description: '1-month supply',
        price: 120.00,
        subscriptionPrice: 97.00,
        features: ['1-month supply', 'Standard shipping']
      },
      {
        id: 'double',
        name: '2-Pack',
        description: '2-month supply',
        price: 194.00,
        subscriptionPrice: 184.00,
        features: ['2-month supply', 'Save $46', 'Free priority shipping'],
        badge: 'POPULAR'
      },
      {
        id: 'family',
        name: 'Family Pack',
        description: '4-month supply',
        price: 388.00,
        subscriptionPrice: 360.00,
        features: ['4-month supply', 'Save $92', 'Free express shipping', 'Best value'],
        badge: 'BEST VALUE'
      }
    ],
    href: '/products/devotion',
    imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    imageAlt: 'Devotion protein and colostrum supplement',
    cta: 'Shop Now',
    badge: 'BESTSELLER'
  },
  {
    id: 2,
    name: 'Devotion Experience',
    description: 'Mind, Body & Nutrition Program',
    longDescription: 'Transform your wellness journey with our comprehensive digital program that combines nutrition guidance, mindfulness practices, and expert coaching to help you achieve optimal health and vitality. Subscription includes ongoing support and content updates.',
    features: [
      'Personalized nutrition plans',
      'Guided mindfulness practices',
      'Expert coaching sessions',
      'Community support',
      'Exclusive content access',
      'Monthly live Q&A sessions',
      'Ongoing program updates'
    ],
    price: 150.00,
    subscriptionPrice: 150.00,
    subscriptionOnly: true,
    href: '/products/devotion-experience',
    imageSrc: '/images/experience-product.jpg',
    imageAlt: 'Devotion Experience digital program',
    cta: 'Subscribe Now',
    badge: 'EXCLUSIVE'
  },
  {
    id: 3,
    name: 'Ultimate Devotion Bundle',
    description: 'Complete Wellness System',
    longDescription: 'Experience the full power of the LivAuthentik ecosystem with our premium bundle that includes both the Devotion supplement and the complete Devotion Experience program at a special value.',
    features: [
      'Devotion supplement (customizable monthly supply)',
      'Full access to Devotion Experience program',
      'Priority customer support',
      'Exclusive wellness consultation',
      'Special bundle savings',
      'Digital starter guide',
      'Access to member community'
    ],
    variants: [
      {
        id: 'one-bag',
        name: '1 Bag',
        description: '1 bag per month',
        price: 249.00,
        subscriptionPrice: 249.00,
        features: ['1 bag monthly', 'Full digital access', 'Free shipping']
      },
      {
        id: 'two-bags',
        name: '2 Bags',
        description: '2 bags per month',
        price: 449.00,
        subscriptionPrice: 449.00,
        features: ['2 bags monthly', 'Full digital access', 'Free shipping', 'Save $49'],
        badge: 'POPULAR'
      },
      {
        id: 'family',
        name: 'Family Pack',
        description: '4 bags per month',
        price: 849.00,
        subscriptionPrice: 849.00,
        features: ['4 bags monthly', 'Full digital access', 'Free express shipping', 'Save $147'],
        badge: 'BEST VALUE'
      }
    ],
    subscriptionOnly: true,
    regularPrice: 270.00,
    href: '/products/bundle',
    imageSrc: '/images/bundle-product.jpg',
    imageAlt: 'Ultimate Devotion Bundle with supplement and digital program',
    cta: 'Subscribe Now',
    badge: 'LIMITED TIME'
  }
];

export default function ProductsPage() {
  // Track product states
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Record<number, string>>({
    1: 'single', // Default to single pack for Devotion
    3: 'one-bag' // Default to one bag for Ultimate Devotion Bundle
  });
  const [devotionSubscription, setDevotionSubscription] = useState(false);
  const { addToCart } = useCart();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Animation state
  const [showHero, setShowHero] = useState(true);
  
  // Use a simple approach for the Products page animation
  // This state controls whether scroll is locked or not
  const [scrollLocked, setScrollLocked] = React.useState(false);
  const savedScrollPos = React.useRef(0);
  
  // Simple approach to lock/unlock scroll on ONLY the Products page
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if we're actually on the Products page
    const isProductsPage = window.location.pathname === '/products';
    if (!isProductsPage) return;
    
    if (scrollLocked) {
      // Save current scroll position
      savedScrollPos.current = window.scrollY;
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      console.log('Products page: Scroll locked for animation');
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      console.log('Products page: Scroll unlocked after animation');
    }
    
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      console.log('Products page: Cleanup - scroll unlocked');
    };
  }, [scrollLocked]);
  
  // Set scroll lock when hero is showing
  React.useEffect(() => {
    if (showHero) {
      setScrollLocked(true);
    }
  }, [showHero]);
  
  // Automatic animation sequence
  React.useEffect(() => {
    // Only run the animation sequence after component is mounted
    // and when showHero is true
    if (showHero && controls) {
      const sequence = async () => {
        try {
          // Ensure scroll is locked at the start of the animation
          setScrollLocked(true);
          console.log('Animation started - scroll locked');
          
          // Reduced initial wait time
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // Animate into full view
          await controls.start({
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1] 
            }
          });
          
          // Shorter wait time for quicker transition to product cards
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Exit animation
          await controls.start({
            opacity: 0,
            y: -100,
            scale: 0.9,
            filter: 'blur(10px)',
            transition: { 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3 
            }
          });
          
          // Unlock scrolling as soon as the animation completes
          setScrollLocked(false);
          console.log('Animation complete - scroll unlocked');
          
          // Hide hero section after exit animation completes
          setShowHero(false);
        } catch (error) {
          console.error('Animation error:', error);
          
          // Make sure to unlock scrolling if there's an animation error
          setScrollLocked(false);
          console.log('Animation error - scroll unlocked as fallback');
          
          // Fallback in case of animation errors
          setShowHero(false);
        }
      };
      
      sequence();
    }
    
    // Add controls to dependency array so this effect runs after controls are initialized
  }, [showHero, controls]);

  const handleAddToCart = (product: Product) => {
    const variantId = selectedVariant[product.id];
    // For Devotion (id: 1), use the devotionSubscription state, otherwise use subscriptionOnly property
    const isSubscription = product.id === 1 ? devotionSubscription : product.subscriptionOnly || false;
    
    // If product has variants, use the selected variant's price
    if (product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        const productWithVariant = {
          ...product,
          name: `${product.name} - ${variant.name}`,
          price: isSubscription ? variant.subscriptionPrice : variant.price,
          subscriptionPrice: variant.subscriptionPrice,
          variant: variant.name
        };
        addToCart(productWithVariant, 1, isSubscription);
      }
    } else {
      // For products without variants
      addToCart(product, 1, isSubscription);
    }
    
    // Show added feedback
    const timer = setTimeout(() => {
      // Reset feedback after animation
    }, 2000);
    return () => clearTimeout(timer);
  };
  
  const formatPrice = (price: string | number | undefined) => {
    if (price === undefined) return '';
    return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${parseFloat(price).toFixed(2)}`;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen">
      {/* Full Screen Hero Section */}
      <section className={`relative w-full flex items-center justify-center overflow-hidden -mt-20 pt-20 transition-all duration-500 ${
        showHero ? 'h-screen' : 'h-0'
      }`}>
        {/* Background image with proper styling */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url(https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67bf7ffd1185a5e16e45e460.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              height: '100vh',
              width: '100vw',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: -1
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>
        
        <div className="container px-6 mx-auto text-center relative z-10 h-full flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-4xl" ref={ref}>
            <AnimatePresence>
              <motion.div
                className="relative"
                initial={{ 
                  opacity: 0,
                  scale: 0.8,
                  y: 100,
                  filter: 'blur(10px)'
                }}
                animate={controls}
                exit={{ 
                  opacity: 0,
                  y: -100,
                  scale: 0.9,
                  filter: 'blur(10px)',
                  transition: { 
                    duration: 1.2, 
                    ease: [0.22, 1, 0.36, 1] 
                  } 
                }}
              >
                {/* Background glow */}
                <motion.div 
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 0.4, 0],
                    scale: [0.8, 1.5, 1.2],
                    transition: {
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-amber-600/20 rounded-full blur-3xl" />
                </motion.div>

                {/* Main text */}
                <div className="relative">
                  <motion.div 
                    className="overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { 
                        delay: 0.3, 
                        duration: 1, 
                        ease: [0.22, 1, 0.36, 1] 
                      }
                    }}
                  >
                    <span className="block mb-3 text-[#caac8e] text-base sm:text-lg md:text-xl uppercase tracking-widest font-cinzel font-medium">
                      Devotion Is Your
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="relative inline-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { 
                        delay: 0.6, 
                        duration: 1.2, 
                        ease: [0.22, 1, 0.36, 1] 
                      }
                    }}
                  >
                    <span 
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-cinzel font-light text-[#fffff0] tracking-tight"
                      style={{
                        background: 'linear-gradient(to right, #fffff0, #caac8e, #fffff0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'var(--font-cinzel)',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Luxury
                    </span>
                    
                    {/* Shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0"
                      initial={{ x: '-100%' }}
                      animate={{
                        x: '100%',
                        opacity: [0, 0.8, 0],
                        transition: {
                          delay: 1.5,
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: 'easeInOut'
                        }
                      }}
                      style={{
                        transform: 'rotate(15deg)',
                        filter: 'blur(10px)'
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Subtle decorative elements */}
                <motion.div 
                  className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-amber-400/20"
                  initial={{ opacity: 0, x: -30, y: -30 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: { delay: 0.9, duration: 1, ease: 'easeOut' }
                  }}
                />
                <motion.div 
                  className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-amber-400/20"
                  initial={{ opacity: 0, x: 30, y: 30 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: { delay: 1.1, duration: 1, ease: 'easeOut' }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Scroll indicator removed as requested */}
      </section>
      
      {/* Products Section */}
      <section id="products-section" className="py-16 md:py-24">
        {/* Grid-based Product Layout */}
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {productsData.map((product: Product) => (
              <div className="relative group" key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-[rgba(61,46,37,0.5)] backdrop-blur-[20px] rounded-2xl border border-white/10 overflow-hidden relative z-0
                             before:content-[''] before:absolute before:inset-0 before:rounded-2xl 
                             before:bg-gradient-to-r before:from-accent/80 before:via-amber-400 before:to-accent/80
                             before:z-0 before:opacity-0 before:transition-opacity before:duration-300
                             hover:before:opacity-100
                             after:content-[''] after:absolute after:inset-[1px] after:rounded-2xl
                             after:bg-[#3d2e25] after:bg-opacity-50 after:backdrop-blur-[20px] after:z-0`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => {
                    setHoveredProduct(null);
                    if (expandedProduct === product.id) {
                      setExpandedProduct(null);
                    }
                  }}
                >
                  {/* Decorative background elements */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-400"></div>
                  <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
                  {/* Product Card Content */}
                  <div className="flex flex-col">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-primary/5 to-transparent"></div>
                      {product.imageSrc && (
                        <div className="relative w-full h-full">
                          <Image 
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4"
                            priority
                          />
                        </div>
                      )}
                      {product.badge && (
                        <motion.div
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{product.badge}</span>
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 sm:p-5 flex flex-col h-full relative z-10">
                      <div className="flex-grow">
                        <h2 className="text-lg sm:text-xl font-serif font-light text-foreground mb-0.5 group-hover:text-accent transition-colors duration-300">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{product.name}</span>
                        </h2>
                        <p className="text-[#fffff0] text-xs sm:text-sm mb-1.5 line-clamp-2">
                          {product.description}
                        </p>
                        
                          <div className="mt-1">
                          {![2, 3].includes(product.id) && (
                            <div className="flex items-baseline">
                              <span className="text-base sm:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">
                                {product.price}
                              </span>
                              {product.regularPrice && (
                                <span className="ml-1.5 text-[11px] sm:text-xs text-[#fffff0]">
                                  {product.regularPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Empty div to maintain spacing */}
                      <div className="h-0 overflow-hidden"></div>
                      
                      {/* CTA - Show on hover with animation */}
                      <motion.div 
                        className="border-t border-accent/10 pt-3 pb-0.5 mt-auto overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: hoveredProduct === product.id ? 'auto' : 0,
                          opacity: hoveredProduct === product.id ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={product.href}
                          className="block w-full px-3 py-1.5 text-xs sm:text-sm rounded-full bg-gradient-to-r from-accent via-amber-400 to-accent/80 
                                   text-[#fffff0] font-medium text-center transition-colors duration-200
                                   border border-transparent hover:bg-transparent hover:bg-none hover:border-[#fffff0] hover:transition-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Choose Options
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Removed redundant expanded details section */}
                
                {/* This ensures the cards maintain consistent height */}
                <div className="invisible h-0 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-serif font-bold text-foreground mb-1">Placeholder</h2>
                    <p className="text-accent text-sm mb-2">Placeholder description</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose + CTA Combined Section (Compact) */}
      <section className="py-8 md:py-12">
        <div className="container px-6 mx-auto">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Why Choose (Left Side) - 7 columns */}
            <div className="md:col-span-7">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg p-6 h-full">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-4">
                  Why Choose LivAuthentik
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      title: 'Premium Quality',
                      description: 'Only the finest, ethically sourced ingredients',
                      icon: (
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Science-Backed',
                      description: 'Formulations based on cutting-edge research',
                      icon: (
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Transformational Results',
                      description: 'Experience profound changes in your wellness journey',
                      icon: (
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* CTA (Right Side) - 5 columns */}
            <div className="md:col-span-5">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-accent/10 via-background to-background shadow-lg border border-white/10 h-full flex flex-col justify-center p-6"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-30"></div>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                    Ready to Transform Your Wellness?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Take the first step towards extraordinary health with our premium products.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="#"
                      className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium shadow-md hover:bg-accent/90 transition-colors duration-300 text-center"
                    >
                      Shop All Products
                    </Link>
                    <Link
                      href="/contact"
                      className="px-4 py-2 rounded-full bg-background border border-border text-sm hover:bg-accent/5 transition-colors duration-300 text-center"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
