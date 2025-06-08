'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

export const HomeCta = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background"></div>
        <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <motion.div 
          className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden p-8 md:py-10 md:px-12 shadow-xl"
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
  );
};
