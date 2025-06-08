'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

// Featured products data
interface Product {
  id: number;
  name: string;
  description: string;
  price?: string;
  subscriptionPrice?: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  badge: string;
  rating: number;
  reviewCount: number;
  variants: { id: string; title: string; price: number }[];
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Devotion',
    description: 'Premium Protein & Colostrum Supplement',
    price: '$120.00',
    subscriptionPrice: '$97.00',
    href: '/products/devotion',
    imageSrc: 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png',
    imageAlt: 'Devotion protein and colostrum supplement',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 124,
    variants: [
      { id: 'one-time', title: 'One-time purchase', price: 120 },
      { id: 'subscription', title: 'Monthly subscription', price: 97 },
    ],
  },
  {
    id: 2,
    name: 'LivAuthentik Self Mastery',
    description: 'Transform Your Life with Intentional Growth',
    href: '/programs/self-mastery',
    imageSrc: '/images/self-mastery.jpg',
    imageAlt: 'LivAuthentik Self Mastery coaching program',
    badge: 'FLAGSHIP PROGRAM',
    rating: 5.0,
    reviewCount: 48,
    variants: [
      { id: 'one-time', title: 'One-time purchase', price: 3500 },
      { id: 'subscription', title: 'Monthly subscription', price: 350 },
    ],
  },
  {
    id: 3,
    name: 'Authentik Integrated',
    description: 'For Coaches Ready to Scale as True CEOs',
    href: '/programs/integrated',
    imageSrc: '/images/integrated.jpg',
    imageAlt: 'Authentik Integrated program for coaches',
    badge: 'EXECUTIVE LEVEL',
    rating: 4.8,
    reviewCount: 36,
    variants: [
      { id: 'one-time', title: 'One-time purchase', price: 8500 },
      { id: 'subscription', title: 'Monthly subscription', price: 850 },
    ],
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="group relative rounded-2xl overflow-hidden shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10
                before:content-[''] before:absolute before:inset-0 before:rounded-2xl 
                before:bg-gradient-to-r before:from-accent/80 before:via-amber-400 before:to-accent/80
                before:-z-10 before:opacity-0 before:transition-opacity before:duration-300
                hover:before:opacity-100
                after:content-[''] after:absolute after:inset-[1px] after:rounded-2xl
                after:bg-[#3d2e25] after:bg-opacity-50 after:backdrop-blur-[20px] after:-z-5"
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: 'rgba(61, 46, 37, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Decorative background elements with enhanced blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 bg-gradient-to-r from-accent/30 via-amber-400/30 to-accent/20"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 delay-100 bg-gradient-to-l from-accent/30 via-amber-400/30 to-accent/20"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay"></div>
      </div>
      
      {/* Badge - positioned with higher z-index */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium shadow-lg border border-accent/20">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80">{product.badge}</span>
          </span>
        </div>
      )}

      {/* Product Card Content */}
      <div className="flex flex-col relative z-10">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-primary/5 to-transparent z-10"></div>
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4"
            priority
          />
        </div>
        <div className="p-5 flex flex-col h-full text-ivory">
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-muted'} ${i === Math.floor(product.rating) && product.rating % 1 > 0 ? 'half-filled' : ''}`}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-amber-400/90">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          
          <h3 className="text-xl font-serif font-medium mb-2 text-[#fffff0]">{product.name}</h3>
          <p className="text-[#fffff0] text-sm mb-4">{product.description}</p>

          <div className="flex-grow">
            {product.price && product.name !== 'Devotion' && (
              <div className="flex items-baseline mb-3">
                <span className="text-lg font-medium text-ivory">{product.price}</span>
                {product.subscriptionPrice && (
                  <span className="ml-2 text-xs text-ivory/70">
                    {product.subscriptionPrice} with subscription
                  </span>
                )}
              </div>
            )}

            <motion.div 
              className="border-t border-accent/10 pt-3 pb-0.5 mt-auto overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isHovered ? 'auto' : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href={product.href} 
                className="block w-full px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-accent via-amber-400 to-accent/80 
                         text-[#fffff0] font-medium text-center 
                         transition-colors duration-200
                         border border-transparent
                         hover:bg-transparent hover:bg-none hover:border-[#fffff0] hover:transition-none"
              >
                Choose Options
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HomeFeaturedProducts = () => {
  return (
    <section className="py-24 md:py-32 relative">
      {/* Fixed size background container */}
      <div className="absolute inset-0 -z-10" style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'absolute' }}>
        {/* Enhanced background effects with specific image */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background/80"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-40"></div>
        <div className="absolute bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67bf7ffd1185a5e16e45e460.png')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
      </div>
      {/* Content container - fixed size to prevent affecting background */}
      <div className="relative z-10" style={{ position: 'relative' }}>

      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block relative mb-3"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-accent/80 font-medium bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">
              Curated Selection
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-amber-400 to-accent/80 font-medium">Featured</span> Collection
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-prose mx-auto">
            Experience our meticulously crafted range of premium wellness formulations, designed to elevate your daily ritual with unparalleled elegance and efficacy.
          </p>
        </motion.div>

        <div className="relative overflow-hidden" style={{ minHeight: '550px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-accent via-amber-400 to-accent/80 hover:from-amber-400 hover:to-amber-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-accent/20 group"
          >
            <span>Explore Full Collection</span>
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
      </div>
    </section>
  );
};
