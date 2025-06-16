'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const ShopHero: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);
  
  // Video source with fallback
  const videoSrc = 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67c24ea11e6df223a891b42d.mp4';
  const fallbackImage = '/images/shop-hero-fallback.jpg'; // Add this image to your public folder

  // Set isClient to true on mount to avoid hydration issues
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle video play with debug info
  const handleVideoCanPlay = () => {
    console.log('Shop video can play event fired');
    const video = videoRef.current;
    if (video) {
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video readyState:', video.readyState);
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Shop video is playing successfully');
            setIsVideoLoaded(true);
            // Force show the video
            video.style.opacity = '1';
            video.style.zIndex = '0';
          })
          .catch(err => {
            console.error('Autoplay failed, will try again on interaction', err);
            // Add click handler to play on user interaction
            const playOnInteraction = () => {
              console.log('User interaction detected, trying to play video...');
              video.play()
                .then(() => {
                  console.log('Video started playing after user interaction');
                  setIsVideoLoaded(true);
                  video.style.opacity = '1';
                  document.removeEventListener('click', playOnInteraction);
                })
                .catch(e => console.error('Still cannot play video:', e));
            };
            document.addEventListener('click', playOnInteraction);
          });
      }
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {isClient && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: isVideoLoaded ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,0.5)' // Darker background for better text contrast
              }}
              onCanPlay={handleVideoCanPlay}
              onPlaying={() => console.log('Shop video is actually playing!')}
              onError={(e) => {
                console.error('Video error event:', e);
                console.log('Video element:', videoRef.current);
                console.log('Video readyState:', videoRef.current?.readyState);
                setVideoError(true);
              }}
              src={videoSrc}
            >
              Your browser does not support the video tag.
            </video>
            
            {!isVideoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-white text-center p-6 rounded-lg">
                  <div className="animate-pulse text-lg mb-2">Loading video...</div>
                  <div className="text-sm text-gray-400">
                    Status: {videoRef.current?.readyState}
                  </div>
                </div>
              </div>
            )}
            
{/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Fallback image when video fails to load */}
            {videoError && (
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${fallbackImage})`,
                  zIndex: 1
                }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="block mb-3 text-[#caac8e] text-base sm:text-lg md:text-xl uppercase tracking-widest font-cinzel font-medium">
                Devotion Is Your
              </span>
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-cinzel font-light text-[#fffff0] tracking-tight">
                <TypeAnimation
                  sequence={[
                    'Protein',
                    2000,
                    'Vitamins',
                    2000,
                    'Minerals',
                    2000,
                    'Probiotics',
                    2000,
                    'Prebiotics',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ 
                    display: 'inline-block',
                    background: 'linear-gradient(to right, #fffff0, #caac8e, #fffff0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-cinzel)',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    letterSpacing: '0.05em'
                  }}
                  repeat={Infinity}
                />
              </span>
            </motion.h1>
            
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link 
                href="#products" 
                className="px-8 py-3 bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white rounded-full shadow-lg hover:shadow-accent/30 transition duration-300 text-sm font-medium uppercase tracking-wider flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Collection
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </Link>
              <Link 
                href="/products/devotion" 
                className="px-8 py-3 border border-[#fffff0] text-[#fffff0] hover:bg-[#fffff0]/30 bg-[#fffff0]/20 rounded-full transition duration-300 text-sm font-medium uppercase tracking-wider flex items-center"
              >
                Featured Product
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>

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
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="text-sm mb-1">Explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
