'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

// Add animation for checkmark icon
const globalStyles = `
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
`;

const products = [
  {
    id: 1,
    name: 'Devotion',
    description: 'Premium Protein & Colostrum Supplement',
    price: '$120.00',
    subscriptionPrice: '$97.00',
    href: '/products/devotion',
    imageSrc: '/images/devotion-product.jpg',
    imageAlt: 'Devotion protein and colostrum supplement',
    cta: 'Shop Now',
    badge: 'BESTSELLER'
  },
  {
    id: 2,
    name: 'LivAuthentik Self Mastery',
    description: 'Transform Your Life with Intentional Growth',
    price: '$3,500.00',
    subscriptionPrice: '$350.00/month',
    href: '/programs/self-mastery',
    imageSrc: '/images/self-mastery.jpg',
    imageAlt: 'LivAuthentik Self Mastery coaching program',
    cta: 'Learn More',
    badge: 'FLAGSHIP PROGRAM'
  },
  {
    id: 3,
    name: 'Authentik Integrated',
    description: 'For Coaches Ready to Scale as True CEOs',
    price: '$8,500.00',
    subscriptionPrice: '$850.00/month',
    href: '/programs/integrated',
    imageSrc: '/images/integrated.jpg',
    imageAlt: 'Authentik Integrated program for coaches',
    cta: 'Learn More',
    badge: 'EXECUTIVE LEVEL'
  },
];

const features = [
  {
    name: 'Premium Quality',
    description: 'Sourced from the finest ingredients for optimal wellness',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Scientifically Formulated',
    description: 'Backed by research for maximum effectiveness',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15c-1.876 0-3.67.402-5.227 1.13L5 14.5m14.8.8l1.402 1.402c.5.5.5 1.3 0 1.8l-1.2 1.2a1.2 1.2 0 01-1.8 0l-1.4-1.4m-12.6 0l-1.4 1.4a1.2 1.2 0 01-1.8 0l-1.2-1.2a1.2 1.2 0 010-1.8l1.4-1.4m12.6 0l-1.4-1.4m-12.6 0l-1.4-1.4'
  },
  {
    name: 'Holistic Approach',
    description: 'Nourishing mind, body, and spirit for complete wellness',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    name: 'Sustainable Sourcing',
    description: 'Ethically and responsibly sourced ingredients',
    icon: 'M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6z'
  }
];



export default function Home() {
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState<{[key: number]: boolean}>({});
  
  // Handle Add to Cart functionality
  const handleAddToCart = (product: any, isSubscription: boolean = false) => {
    addToCart(product, 1, isSubscription);
    
    // Show visual feedback that product was added
    setAddedProducts(prev => ({
      ...prev,
      [product.id]: true
    }));
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedProducts(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-background to-background/90"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="relative container px-6 mx-auto py-20 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-tight">
                Elevate Your <span className="text-accent italic">Wellness</span> <span className="relative inline-block">Journey
                  <motion.span 
                    className="absolute -bottom-2 left-0 h-1 bg-accent/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl"
              >
                Discover the perfect harmony of premium supplements and transformative experiences designed to nourish your body, mind, and soul.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-12 flex flex-col sm:flex-row items-center gap-6"
              >
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-lg hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Explore Collection
                </Link>
                <Link 
                  href="/about" 
                  className="group flex items-center text-foreground hover:text-accent transition-colors duration-300"
                >
                  <span className="font-medium">Our Story</span>
                  <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-primary/5 blur-2xl"></div>
                <div className="absolute -inset-2 rounded-full border border-accent/10 animate-pulse"></div>
                <div className="absolute inset-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
                  <Image 
                    src="/images/devotion-product.jpg" 
                    alt="LivAuthentik Devotion" 
                    width={400} 
                    height={400} 
                    className="rounded-full object-cover h-full w-full p-8"
                  />
                </div>
                <div className="absolute top-0 right-0 -mr-4 mt-6 bg-white rounded-full shadow-lg p-4 backdrop-blur-sm bg-white/80 border border-white/20">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="text-accent font-serif font-bold text-lg"
                  >
                    Premium<br/>Quality
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 -ml-4 mb-6 bg-white rounded-full shadow-lg p-4 backdrop-blur-sm bg-white/80 border border-white/20">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="text-accent font-serif font-bold text-lg"
                  >
                    Ethically<br/>Sourced
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
            <motion.div 
              className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1"
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <motion.div className="w-1.5 h-1.5 bg-accent rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Featured Products */}
      <section className="py-24 sm:py-32">
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="inline-block text-accent font-medium mb-3 tracking-wider text-sm uppercase">Discover Excellence</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              <span className="relative inline-block">
                Our Premium
                <motion.span 
                  className="absolute -bottom-2 left-0 h-1 bg-accent/40 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </span> Offerings
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of science and nature with our carefully crafted products designed to elevate your wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-16">
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-3xl bg-card shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="grid md:grid-cols-5 gap-6 p-6 sm:p-8 relative z-10">
                  {/* Product Image */}
                  <div className="md:col-span-2 overflow-hidden rounded-2xl">
                    <div className="relative aspect-square bg-gradient-to-br from-accent/10 to-background overflow-hidden rounded-2xl">
                      {product.imageSrc ? (
                        <Image 
                          src={product.imageSrc} 
                          alt={product.imageAlt || product.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/5">
                          <span className="text-3xl font-serif font-medium text-muted-foreground/40">
                            {product.name}
                          </span>
                        </div>
                      )}
                      {product.badge && (
                        <div className="absolute top-4 right-4 z-20">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-accent shadow-md">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="md:col-span-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                            <svg className="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-foreground">Premium Quality Ingredients</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                            <svg className="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-foreground">Scientifically Formulated</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                            <svg className="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-foreground">Free Shipping Over $100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-6">
                        <p className="text-2xl font-medium text-foreground">{product.price}</p>
                        {product.subscriptionPrice && (
                          <div className="flex items-center text-accent">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12M8 12h12M8 17h12" />
                            </svg>
                            <span className="text-sm font-medium">
                              {product.subscriptionPrice} with subscription
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={product.href}
                          className="flex-1 inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-md hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          {product.cta}
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className={`inline-flex items-center justify-center px-6 py-3 rounded-full ${addedProducts[product.id] 
                            ? 'bg-accent/10 text-accent border border-accent/20' 
                            : 'bg-background border border-border hover:bg-accent/5'} transition-all duration-300`}
                          aria-label="Add to cart"
                        >
                          {addedProducts[product.id] ? (
                            <>
                              <svg className="h-5 w-5 animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="ml-2">Added!</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <span className="ml-2">Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-background border border-border text-foreground font-medium hover:bg-accent/5 transition-colors duration-300"
            >
              View All Products
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-background to-background/90"></div>
          <div className="absolute -left-64 -bottom-64 w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <span className="inline-block text-accent font-medium mb-3 tracking-wider text-sm uppercase">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              <span className="relative inline-block">
                The LivAuthentik
                <motion.span 
                  className="absolute -bottom-2 left-0 h-1 bg-accent/40 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </span> Difference
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're committed to excellence in every aspect of our products and your wellness journey, 
              delivering premium quality and scientifically backed results.
            </p>
          </motion.div>
          
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  className="relative flex items-start"
                >
                  <div className="shrink-0 mr-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-accent/10 blur-md transform scale-150"></div>
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 shadow-lg">
                        <svg
                          className="h-8 w-8 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-0 top-1/4 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-background to-background shadow-2xl border border-white/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-40"></div>
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-20 md:p-20 lg:p-24 grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left max-w-lg">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-block text-accent font-medium mb-3 tracking-wider text-sm uppercase"
                >
                  Join Our Community
                </motion.span>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight"
                >
                  Ready to transform your wellness journey?
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 text-lg leading-relaxed text-muted-foreground"
                >
                  Join thousands of satisfied customers who have elevated their health with our premium products and programs. Experience the LivAuthentik difference today.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-accent text-white font-medium tracking-wide shadow-lg hover:shadow-accent/20 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Explore Our Products
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-background border border-border hover:bg-accent/5 transition-colors duration-300"
                  >
                    Explore Our Programs
                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-12 flex items-center space-x-4"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">500+</span> customers already trust us
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-2xl"></div>
                  <div className="absolute inset-8 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl overflow-hidden">
                    <Image 
                      src="/images/self-mastery.jpg" 
                      alt="LivAuthentik Programs" 
                      width={400} 
                      height={400} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Testimonial or Trust elements */}
          <div className="mt-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-medium text-accent mb-8">Trusted by wellness enthusiasts worldwide</h3>
              <div className="flex flex-wrap justify-center items-center gap-12">
                {/* Replace with actual partner logos if available */}
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-8 w-32 bg-muted/20 rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">PARTNER {i}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
