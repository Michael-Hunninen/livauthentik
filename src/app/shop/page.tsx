"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import { ShoppingBag, BookOpen, Star, Heart, Zap, Clock, Quote, ArrowRight } from 'lucide-react';
import { TestimonialCarousel } from '@/components/testimonial-carousel';
import { ScrollTransitionWrapper } from '@/components/ScrollTransitionWrapper';

// Dynamically import ShopHero with no SSR to avoid hydration issues
const ShopHero = dynamic(() => import('@/components/ShopHero'), {
  ssr: false,
  loading: () => null, // Loading state is now handled by the layout
});

// Blog articles data
const blogArticles = [
  {
    id: 'article1',
    title: "The Science of Adaptogens: Nature's Stress Solution",
    excerpt: "Discover how adaptogenic herbs can help your body resist stressors and restore balance naturally.",
    image: '/images/blog/adaptogens.jpg',
    category: 'Wellness',
    author: 'Dr. Sarah Chen',
    date: 'May 28, 2025',
    readTime: '6 min read',
    slug: 'science-of-adaptogens'
  },
  {
    id: 'article2',
    title: 'Mindful Movement: Transforming Your Exercise Routine',
    excerpt: "Learn how bringing mindfulness to your workout can enhance results and deepen your mind-body connection.",
    image: '/images/blog/mindful-movement.jpg',
    category: 'Fitness',
    author: 'Michael Torres',
    date: 'May 15, 2025',
    readTime: '5 min read',
    slug: 'mindful-movement'
  },
  {
    id: 'article3',
    title: 'Nutritional Alchemy: Foods That Synergize for Optimal Health',
    excerpt: "Explore powerful food combinations that work together to enhance absorption and maximize nutritional benefits.",
    image: '/images/blog/nutritional-alchemy.jpg',
    category: 'Nutrition',
    author: 'Emma Blackwood',
    date: 'May 3, 2025',
    readTime: '7 min read',
    slug: 'nutritional-alchemy'
  },
  {
    id: 'article4',
    title: "The Luxury of Rest: Why Sleep Is Your Ultimate Wellness Investment",
    excerpt: "Understand why proper sleep might be the most important element in your wellness journey.",
    image: '/images/blog/luxury-of-rest.jpg',
    category: 'Sleep',
    author: 'Dr. James Wilson',
    date: 'April 22, 2025',
    readTime: '4 min read',
    slug: 'luxury-of-rest'
  }
];

// Products data
const products = [
  {
    id: '1',
    name: 'Devotion',
    description: 'Premium Protein & Colostrum Supplement',
    price: 120.00,
    subscriptionPrice: 97.00,
    category: 'Supplements',
    rating: 4.9,
    image: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    slug: 'devotion',
    isNew: true,
    variants: [
      {
        id: 'single',
        name: 'Single Pack',
        price: 120.00,
        subscriptionPrice: 97.00
      },
      {
        id: 'double',
        name: '2-Pack',
        price: 194.00,
        subscriptionPrice: 184.00
      },
      {
        id: 'family',
        name: 'Family Pack',
        price: 388.00,
        subscriptionPrice: 360.00
      }
    ]
  },
  {
    id: '2',
    name: 'Devotion Experience',
    description: 'Mind, Body & Nutrition Program with personalized guidance and community support.',
    price: 150.00,
    subscriptionPrice: 150.00,
    category: 'Digital Program',
    rating: 4.9,
    image: '/images/experience-product.jpg',
    slug: 'devotion-experience',
    isPopular: true,
    features: [
      'Personalized nutrition plans',
      'Guided mindfulness practices',
      'Expert coaching sessions',
      'Community support',
      'Exclusive content access'
    ]
  },
  {
    id: '3',
    name: 'Ultimate Devotion Bundle',
    description: 'Complete Wellness System with Devotion Supplement & Experience Program',
    price: 270.00,
    subscriptionPrice: 249.00,
    category: 'Bundles',
    rating: 5.0,
    image: '/images/bundle-product.jpg',
    slug: 'ultimate-devotion-bundle',
    isNew: true,
    variants: [
      {
        id: 'one-bag',
        name: '1 Bag',
        price: 270.00,
        subscriptionPrice: 249.00
      },
      {
        id: 'two-bags',
        name: '2 Bags',
        price: 449.00,
        subscriptionPrice: 449.00
      },
      {
        id: 'family',
        name: 'Family Pack',
        price: 849.00,
        subscriptionPrice: 849.00
      }
    ]
  }
];

// Programs data
const programs = [
  {
    id: 'p1',
    name: 'LivAuthentik Self Mastery',
    description: 'A transformative program designed to help you master self-awareness, emotional intelligence, and personal growth.',
    duration: '12 weeks',
    category: 'Self-Development',
    rating: 5.0,
    image: '/images/self-mastery-program.jpg',
    slug: 'livauthentik-self-mastery',
    isPopular: true,
    features: [
      '12-week guided journey',
      'Weekly video lessons',
      'Interactive workbooks',
      'Private community access',
      'Live Q&A sessions',
      'Progress tracking tools'
    ]
  },
  {
    id: 'p2',
    name: 'Authentik Integrated',
    description: 'A comprehensive program for integrating all aspects of your life into a cohesive, authentic whole.',
    duration: '6 months',
    category: 'Holistic Living',
    rating: 4.9,
    image: '/images/integrated-program.jpg',
    slug: 'authentik-integrated',
    isPopular: true,
    features: [
      '6-month intensive program',
      'Bi-weekly coaching calls',
      'Personalized action plans',
      'Exclusive resources',
      'Accountability partners',
      'Lifetime access to materials'
    ]
  }
];

// Collections data
const collections = [
  {
    id: 1,
    name: "Signature Supplements",
    description: "Our flagship collection of premium wellness formulas designed for optimal performance",
    image: "/images/collection-supplements.jpg",
    link: "/shop?collection=supplements"
  },
  {
    id: 2,
    name: "Essential Oils",
    description: "Pure, therapeutic-grade oils sourced from sustainable global partners",
    image: "/images/collection-oils.jpg",
    link: "/shop?collection=oils"
  },
  {
    id: 3,
    name: "Meditation Tools",
    description: "Elevate your practice with our curated selection of mindfulness accessories",
    image: "/images/collection-meditation.jpg",
    link: "/shop?collection=meditation"
  },
  {
    id: 4,
    name: "Gift Sets",
    description: "Luxurious wellness packages, perfectly presented for someone special",
    image: "/images/collection-gifts.jpg",
    link: "/shop?collection=gifts"
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Alexandra Davis",
    role: "Wellness Enthusiast",
    image: "/images/testimonial-1.jpg",
    quote: "LivAuthentik's products have transformed my daily wellness routine. The quality and efficacy are unmatched, and I feel more balanced and energized than ever.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Fitness Professional",
    image: "/images/testimonial-2.jpg",
    quote: "As someone who prioritizes performance and recovery, I've found LivAuthentik's supplements to be genuinely effective. I recommend them to all my clients.",
    rating: 5
  },
  {
    id: 3,
    name: "Sophia Reynolds",
    role: "Holistic Practitioner",
    image: "/images/testimonial-3.jpg",
    quote: "The attention to detail and purity of ingredients in these products aligns perfectly with my holistic approach to wellness. Truly a premium experience.",
    rating: 5
  }
];

export default function ShopPage() {
  // Define product variant for Checkout components
  const getProductVariants = (product: any) => {
    return product.variants?.map((variant: any) => (
      <div key={variant.id} className="space-y-3 py-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">{variant.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${variant.price.toFixed(2)}</span>
            {variant.subscriptionPrice && (
              <span className="text-sm text-muted-foreground">
                ${variant.subscriptionPrice.toFixed(2)} with subscription
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CheckoutButton
            priceId={`price_${variant.id}_${product.id}`} 
            productName={`${product.name} - ${variant.name}`}
            isSubscription={false}
            className="w-full"
            buttonText="Buy Now"
          />
          {variant.subscriptionPrice && (
            <CheckoutButton
              priceId={`price_${variant.id}_${product.id}_sub`}
              productName={`${product.name} - ${variant.name}`}
              isSubscription={true}
              className="w-full bg-muted hover:bg-muted/80"
              buttonText="Subscribe"
            />
          )}
        </div>
      </div>
    ));
  };
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'supplements' | 'programs'>('all');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-checkmark {
          animation: checkmark 0.5s ease-out forwards;
        }

        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>

      <div className="min-h-screen relative">
        {/* Hero Section - Sticky at the top */}
        <div className="sticky top-0 left-0 w-full h-screen z-0">
          <ShopHero />
        </div>
        
        {/* Content that overlays the hero immediately */}
        <section className="relative z-10 bg-background min-h-screen">
          <div className="pt-screen">
            <div className="relative z-10">

      {/* Featured Products */}
      <section id="products" className="py-12 md:py-20 relative overflow-hidden">
        {/* Fixed size background container - matching the home page featured section */}
        <div className="absolute inset-0 -z-10" style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'absolute' }}>
          {/* Enhanced background effects with specific image */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background/80"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-40"></div>
          <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-30"></div>
          <div className="absolute inset-0 bg-[url('https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67bf7ffd1185a5e16e45e460.png')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Shop</span> Our Collection
                </h2>
                <p className="text-muted-foreground text-lg font-light">Premium wellness products meticulously crafted to elevate your daily ritual with unparalleled elegance and efficacy.</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('all')}
                className={`${activeFilter === 'all' ? 'bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white shadow-md hover:shadow-accent/20' : 'backdrop-blur-sm bg-white/5 border-white/20 hover:border-accent/30 hover:text-accent'} rounded-full px-6 transition-all duration-300`}
              >
                All Products
              </Button>
              <Button 
                variant={activeFilter === 'supplements' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('supplements')}
                className={`${activeFilter === 'supplements' ? 'bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white shadow-md hover:shadow-accent/20' : 'backdrop-blur-sm bg-white/5 border-white/20 hover:border-accent/30 hover:text-accent'} rounded-full px-6 transition-all duration-300`}
              >
                Supplements
              </Button>
              <Button 
                variant={activeFilter === 'programs' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('programs')}
                className={`${activeFilter === 'programs' ? 'bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white shadow-md hover:shadow-accent/20' : 'backdrop-blur-sm bg-white/5 border-white/20 hover:border-accent/30 hover:text-accent'} rounded-full px-6 transition-all duration-300`}
              >
                Programs
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`bg-[rgba(61,46,37,0.5)] backdrop-blur-[20px] rounded-2xl border border-white/10 overflow-hidden relative z-10
                             before:content-[''] before:absolute before:inset-0 before:rounded-2xl 
                             before:bg-gradient-to-r before:from-accent/80 before:via-amber-400 before:to-accent/80
                             before:-z-10 before:opacity-0 before:transition-opacity before:duration-300
                             hover:before:opacity-100
                             after:content-[''] after:absolute after:inset-[1px] after:rounded-2xl
                             after:bg-[#3d2e25] after:bg-opacity-50 after:backdrop-blur-[20px] after:-z-5`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Decorative background elements */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-400"></div>
                  <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
                  
                  {/* Product Card Content */}
                  <div className="flex flex-col relative z-10">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-primary/5 to-transparent z-10"></div>
                      <Image 
                        src={product.image || `/images/${product.slug}.jpg`}
                        alt={product.name}
                        fill
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4"
                        priority
                      />
                      {product.isNew && (
                        <motion.div 
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                        >
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">NEW</span>
                          </span>
                        </motion.div>
                      )}
                      {product.isPopular && (
                        <motion.div 
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                        >
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">POPULAR</span>
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4 sm:p-5 flex flex-col h-full">
                      <div className="flex-grow">
                        <h2 className="text-lg sm:text-xl font-serif font-light text-foreground mb-0.5 group-hover:text-accent transition-colors duration-300">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{product.name}</span>
                        </h2>
                        <p className="text-[#fffff0] text-xs sm:text-sm mb-1.5 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex items-baseline mt-1">
                          <span className="text-base sm:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{formatPrice(product.price)}</span>
                          {product.subscriptionPrice && product.subscriptionPrice !== product.price && (
                            <span className="ml-1.5 text-[11px] sm:text-xs text-[#fffff0]">
                              {formatPrice(product.subscriptionPrice)} with subscription
                            </span>
                          )}
                        </div>
                      </div>
                      
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
                          href={`/products/${product.slug}`}
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background/80 z-0"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-40 z-0"></div>
        <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-10 mix-blend-overlay z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Wellness</span> Programs
                </h2>
                <p className="text-[#fffff0]/80 font-light">Transformative journeys for holistic well-being</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button 
                variant="ghost" 
                className="hover:text-accent hover:bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300"
                asChild
              >
                <Link href="/programs" className="flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">View all</span> <ArrowRight className="w-4 h-4 ml-2 text-accent" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {programs.map((program, index) => (
              <motion.div 
                className="relative group" 
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`bg-[rgba(61,46,37,0.5)] backdrop-blur-[20px] rounded-2xl border border-white/10 overflow-hidden relative z-10 h-full
                             before:content-[''] before:absolute before:inset-0 before:rounded-2xl 
                             before:bg-gradient-to-r before:from-accent/80 before:via-amber-400 before:to-accent/80
                             before:-z-10 before:opacity-0 before:transition-opacity before:duration-300
                             hover:before:opacity-100
                             after:content-[''] after:absolute after:inset-[1px] after:rounded-2xl
                             after:bg-[#3d2e25] after:bg-opacity-50 after:backdrop-blur-[20px] after:-z-5
                             transition-all duration-500 transform group-hover:scale-[1.01]`}
                  onMouseEnter={() => setHoveredProduct(program.id)}
                  onMouseLeave={() => {
                    setHoveredProduct(null);
                    // Also close expanded details when mouse leaves
                    if (expandedProduct === program.id) {
                      setExpandedProduct(null);
                    }
                  }}
                  onClick={() => setExpandedProduct(expandedProduct === program.id ? null : program.id)}
                >
                  {/* Decorative background elements */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-amber-400"></div>
                  <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
                  
                  {/* Program Card Content */}
                  <div className="flex flex-col h-full relative z-10">
                    {/* Program Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-primary/5 to-transparent z-10"></div>
                      <Image 
                        src={program.image || `/images/${program.slug}.jpg`}
                        alt={program.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      {program.isPopular && (
                        <motion.div 
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                        >
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">POPULAR</span>
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Program Info */}
                    <div className="p-6 flex flex-col h-full relative z-10">
                      <div className="mb-4 flex-grow">
                        <Badge 
                          variant="outline" 
                          className="text-xs mb-2 backdrop-blur-sm bg-white/5 border-accent/20 text-accent"
                        >
                          {program.category}
                        </Badge>
                        <h2 className="text-xl font-serif font-light text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{program.name}</span>
                        </h2>
                        <p className="text-[#fffff0] text-sm mb-2">
                          {program.description}
                        </p>
                        
                        <div className="flex items-center text-sm text-[#fffff0]/80 mt-2">
                          <Clock className="w-4 h-4 mr-1 text-accent/80" />
                          {program.duration}
                          <span className="mx-2 text-accent/50">•</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="ml-1 text-accent">{program.rating}</span>
                          </div>
                        </div>
                        
                        <motion.div 
                          className={`overflow-hidden mt-2`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: hoveredProduct === program.id ? 'auto' : 0,
                            opacity: hoveredProduct === program.id ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-baseline pt-1">
                            <span className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">Contact for Details</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Expandable content - Show details when expanded */}
                      {expandedProduct === program.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 border-t border-accent/10 pt-4"
                        >
                          {program.features && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">Program Includes:</span>
                              </h4>
                              <ul className="space-y-2">
                                {program.features.map((feature, i) => (
                                  <motion.li 
                                    key={i} 
                                    className="flex items-start text-xs"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                                  >
                                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-accent/10 flex items-center justify-center mr-2 mt-0.5">
                                      <svg className="h-2 w-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span className="text-[#fffff0]">{feature}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Action Buttons */}
                      <motion.div 
                        className="pt-4 border-t border-accent/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: hoveredProduct === program.id ? 1 : 0,
                          y: hoveredProduct === program.id ? 0 : 10
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs backdrop-blur-sm bg-white/5 border-white/20 text-[#fffff0] hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProduct(expandedProduct === program.id ? null : program.id);
                            }}
                          >
                            {expandedProduct === program.id ? 'Less Info' : 'More Info'}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-[#fffff0] font-medium shadow-sm
                                     border border-transparent hover:bg-transparent hover:bg-none hover:border-[#fffff0] hover:transition-none transition-colors duration-200"
                            asChild
                          >
                            <Link href={`/programs/${program.slug}`} onClick={(e) => e.stopPropagation()}>
                              Learn More
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Blog Articles Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background z-0"></div>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl opacity-30 z-0"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl opacity-20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Wellness Insights</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Articles</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Discover expert insights and transformative wisdom for your wellness journey</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {blogArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-white/10 hover:border-accent/30 transition-all duration-500"
              >
                {/* Article image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent z-10"></div>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{article.category}</span>
                    </span>
                  </div>
                </div>
                
                {/* Article content */}
                <div className="p-5">
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <span>{article.date}</span>
                    <span className="mx-2 text-accent/50">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-serif font-light text-foreground mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{article.title}</span>
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      By {article.author}
                    </span>
                    
                    <Link 
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center text-xs font-medium text-accent hover:text-amber-400 transition-colors duration-300"
                    >
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Link 
              href="/blog"
              className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-accent/10 to-amber-400/10 backdrop-blur-md border border-accent/20 text-accent hover:text-amber-500 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/40"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-accent/5"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-sm font-medium tracking-wider uppercase text-accent/80 mb-3 block">Authentic Experiences</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              <span className="relative inline-block">
                Client <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Testimonials</span>
                <div className="absolute -bottom-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover how our premium products have elevated the wellness journeys of our valued clients
            </p>
          </motion.div>
          
          <div className="relative max-w-6xl mx-auto">
            <TestimonialCarousel />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background/80"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-20"></div>
          <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <motion.div 
            className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden p-8 md:p-12 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(61, 46, 37, 0.5) 0%, rgba(61, 46, 37, 0.7) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Background image matching featured collection */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background/80"></div>
              <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-40"></div>
              <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-30"></div>
              <div className="absolute inset-0 bg-[url('https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67bf7ffd1185a5e16e45e460.png')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
            </div>

            <motion.div 
              className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium mb-4 backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Zap className="w-4 h-4 mr-2 text-accent" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">Special Offer</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Get <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">25% Off</span> Your First Order
            </motion.h2>
            
            <motion.p 
              className="text-xl text-[#3d2e25] mb-8 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Subscribe to our newsletter and receive an exclusive discount on your first purchase.
            </motion.p>
            
            <motion.div 
              className="flex flex-col gap-4 justify-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="px-4 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[#3d2e25] placeholder-[#3d2e25]/60 focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-amber-500/20 flex-grow shadow-md transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[#3d2e25] placeholder-[#3d2e25]/60 focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-amber-500/20 flex-grow shadow-md transition-all duration-300"
                />
              </div>
              <div className="relative inline-block group">
                <a 
                  href="/shop"
                  className="relative z-10 w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full whitespace-nowrap overflow-hidden transition-all duration-300 transform group-hover:scale-[1.02] group-active:scale-[0.98] border-2 border-transparent group-hover:border-[#3d2e25]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent via-amber-400 to-accent/80 transition-opacity duration-300 group-hover:opacity-0"></span>
                  <span className="relative z-10 transition-colors duration-300 text-white group-hover:text-[#3d2e25]">
                    Get My 25% Discount
                  </span>
                </a>
              </div>
            </motion.div>
            
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-accent/10 blur-xl opacity-70"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-accent/10 blur-xl opacity-60"></div>
          </motion.div>
        </div>
      </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
