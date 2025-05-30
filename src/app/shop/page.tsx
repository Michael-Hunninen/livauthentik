"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, BookOpen, ArrowRight, Star, Heart, Zap, Clock } from 'lucide-react';

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
    image: '/images/devotion-product.jpg',
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
    price: 497.00,
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
    price: 997.00,
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
    return `$${price.toFixed(2)}`;
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              LivAuthentik Shop
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Holistic Wellness Products & Programs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our carefully curated selection of premium products and transformative programs 
              designed to support your journey to optimal health and well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CheckoutButton
                priceId={`price_${programs[0].id}`}
                productName={programs[0].name}
                isSubscription={false}
                className="w-full"
                buttonText="Enroll Now"
              />
              <Button size="lg" variant="outline" asChild>
                <Link href="#programs">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Programs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Shop</h2>
              <p className="text-muted-foreground">Premium wellness products for your journey</p>
            </div>
            <div className="flex space-x-2">
              <Button variant={activeFilter === 'all' ? 'default' : 'outline'} onClick={() => setActiveFilter('all')}>
                All Products
              </Button>
              <Button variant={activeFilter === 'supplements' ? 'default' : 'outline'} onClick={() => setActiveFilter('supplements')}>
                Supplements
              </Button>
              <Button variant={activeFilter === 'programs' ? 'default' : 'outline'} onClick={() => setActiveFilter('programs')}>
                Programs
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border-2 ${hoveredProduct === product.id ? 'border-accent/80' : 'border-white/10'} shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Card Content */}
                  <div className="flex flex-col">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5"></div>
                      <Image 
                        src={product.image || `/images/${product.slug}.jpg`}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      {product.isNew && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-accent shadow-md">
                            NEW
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
                            <span className="text-lg font-medium">{formatPrice(product.price)}</span>
                            {product.subscriptionPrice && product.subscriptionPrice !== product.price && (
                              <span className="ml-2 text-xs text-accent">
                                {formatPrice(product.subscriptionPrice)} with subscription
                              </span>
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
                            href={`/products/${product.slug}`}
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

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Wellness Programs</h2>
              <p className="text-muted-foreground">Transformative journeys for holistic well-being</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/programs" className="flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div className="relative group" key={program.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border-2 ${hoveredProduct === program.id ? 'border-accent/80' : 'border-white/10'} shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative h-full`}
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
                  {/* Program Card Content */}
                  <div className="flex flex-col h-full">
                    {/* Program Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/5"></div>
                      <Image 
                        src={program.image || `/images/${program.slug}.jpg`}
                        alt={program.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        priority
                      />
                      {program.isPopular && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-accent shadow-md">
                            POPULAR
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Program Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <Badge variant="outline" className="text-xs mb-2">
                          {program.category}
                        </Badge>
                        <h2 className="text-xl font-serif font-bold text-foreground mb-1">
                          {program.name}
                        </h2>
                        <p className="text-accent text-sm mb-2">
                          {program.description}
                        </p>
                        
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {program.duration}
                          <span className="mx-2">•</span>
                          <div className="flex items-center text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1">{program.rating}</span>
                          </div>
                        </div>
                        
                        <div className={`transition-all duration-300 overflow-hidden mt-2 ${hoveredProduct === program.id ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                          <div className="flex items-baseline">
                            <span className="text-lg font-medium">{formatPrice(program.price)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expandable content - Show details when expanded */}
                      {expandedProduct === program.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          {program.features && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">Program Includes:</h4>
                              <ul className="space-y-1">
                                {program.features.map((feature, i) => (
                                  <li key={i} className="flex items-start text-xs">
                                    <div className="flex-shrink-0 h-4 w-4 rounded-full bg-accent/10 flex items-center justify-center mr-2 mt-0.5">
                                      <svg className="h-2 w-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className={`pt-4 border-t border-border/10 transition-all duration-300 ${hoveredProduct === program.id ? 'opacity-100 translate-y-0' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProduct(expandedProduct === program.id ? null : program.id);
                            }}
                          >
                            {expandedProduct === program.id ? 'Less Info' : 'More Info'}
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/programs/${program.slug}`} onClick={(e) => e.stopPropagation()}>
                              Learn More
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Special Offer
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get 15% Off Your First Order
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter and receive an exclusive discount on your first purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-grow"
              />
              <Button size="lg" className="whitespace-nowrap">
                Get My Discount
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
