"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import ImageSlider from './ImageSlider';

const AboutHero: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  // Define slider images
  const sliderImages = [
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e2b5aa1103471f6ed186e.jpeg",
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e366bd9a12e2524a92e3d.png",
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e30f2a1103436dbed27b8.jpeg",
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e3518d9a12e4bf5a92d79.png",
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e3105d9a12eb939a92365.jpeg",
    "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/674e3817d9a12e7a69a92f25.png"
  ];

  // Set isClient to true on mount to avoid hydration issues
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Image Slider Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {isClient && (
          <div className="relative w-full h-full">
            {/* Image Slider */}
            <div className="absolute inset-0 w-full h-full">
              <ImageSlider 
                images={sliderImages} 
                interval={7000} 
                className="fixed inset-0"
              />
            </div>
            
            {/* Premium Overlay with Gradient */}
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            
            {/* Subtle Texture Overlay for Premium Feel */}
            <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-20 mix-blend-overlay"></div>
            
            {/* Light Glow Effects */}
            <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-accent/5 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-1/4 w-[25rem] h-[25rem] rounded-full bg-accent/10 blur-3xl opacity-20"></div>
          </div>
        )}
      </div>
      
      {/* Hero Content - Fixed to stay with video */}
      <div className="fixed inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-light text-[#fffff0] tracking-tight whitespace-nowrap">
                <span style={{
                  background: 'linear-gradient(to right, #fffff0, #caac8e, #fffff0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'var(--font-cinzel)',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '0.02em'
                }}>Authentik</span>
                <TypeAnimation
                  sequence={[
                    ' Story',
                    2000,
                    ' Journey',
                    2000,
                    ' Mission',
                    2000,
                    ' Philosophy',
                    2000,
                    ' Vision',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ 
                    display: 'inline-block',
                    background: 'linear-gradient(to right, #caac8e, #d4b998, #caac8e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500,
                    marginLeft: '0.25em'
                  }}
                  repeat={Infinity}
                />
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              <Link href="#mission" passHref>
                <button 
                  className="relative group overflow-hidden bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white py-4 px-10 rounded-full
                            font-medium shadow-lg hover:shadow-accent/20 transform hover:translate-y-[-2px]
                            transition-all duration-300"
                >
                  <span className="relative z-10">Discover Our Story</span>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.div 
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-sm mb-1">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutHero;
