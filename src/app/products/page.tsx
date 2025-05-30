'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

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
    imageSrc: '/images/devotion-product.jpg',
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
  const [devotionSubscription, setDevotionSubscription] = useState(false); // Track subscription status for Devotion
  
  const { addToCart } = useCart();

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
    <div className="bg-background min-h-screen">
      {/* Hero Section - Compact */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background/90"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-3">
              Luxury <span className="text-accent">Products</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl mx-auto">
              Discover our premium collection of wellness solutions designed to transform your health journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid-based Product Layout */}
      <section className="py-8 md:py-10">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {productsData.map((product: Product) => (
              <div className="relative group" key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border-2 ${hoveredProduct === product.id ? 'border-accent/80' : 'border-white/10'} shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => {
                    setHoveredProduct(null);
                    // Also close expanded details when mouse leaves
                    if (expandedProduct === product.id) {
                      setExpandedProduct(null);
                    }
                  }}
                >
                  {/* Product Card Content */}
                  <div className="flex flex-col">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5"></div>
                      {product.imageSrc && (
                        <Image 
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          fill
                          className="object-cover object-center transition-transform duration-700 hover:scale-105"
                          priority
                        />
                      )}
                      {product.badge && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-accent shadow-md">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-serif font-bold text-foreground mb-1">
                          {product.name}
                        </h2>
                        <p className="text-accent text-sm mb-2">
                          {product.description}
                        </p>
                        
                        <div className={`transition-all duration-300 overflow-hidden ${hoveredProduct === product.id ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                          <div className="flex items-baseline">
                            <span className="text-lg font-medium">{product.price}</span>
                            {product.regularPrice && (
                              <span className="ml-2 text-xs line-through text-muted-foreground">{product.regularPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Empty div to maintain spacing */}
                      <div className="h-0 overflow-hidden"></div>
                      
                      {/* CTA - Only show on hover */}
                      <div className={`transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 h-auto mt-4' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <div className="pt-4 border-t border-border/10">
                          <Link 
                            href={product.href}
                            className="block w-full px-4 py-2 rounded-full bg-accent text-white text-sm font-medium text-center shadow-md hover:bg-accent/90 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Choose Options
                          </Link>
                        </div>
                      </div>
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
