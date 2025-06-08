"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const RewardsHero: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  // Set isClient to true on mount to avoid hydration issues
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle video play with debug info
  const handleVideoCanPlay = () => {
    console.log('Rewards video can play event fired');
    const video = videoRef.current;
    if (video) {
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video readyState:', video.readyState);
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Rewards video is playing successfully');
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
    <div id="rewards-hero" className="relative w-full h-screen">
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
              onPlaying={() => console.log('Rewards video is actually playing!')}
              onError={(e) => {
                console.error('Video error event:', e);
                console.log('Video element:', videoRef.current);
                console.log('Video readyState:', videoRef.current?.readyState);
              }}
              src="https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67c24ea11e6df223a891b42d.mp4"
            >
              Your browser does not support the video tag.
            </video>
            
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-white text-center p-6 rounded-lg">
                  <div className="animate-pulse text-lg mb-2">Loading video...</div>
                  <div className="text-sm text-gray-400">
                    Status: {videoRef.current?.readyState}
                  </div>
                </div>
              </div>
            )}
            
            {/* Premium Overlay with Gradient */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
            
            {/* Subtle Texture Overlay for Premium Feel */}
            <div className="absolute inset-0 bg-[url('/images/texture.png')] opacity-20 mix-blend-overlay"></div>
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
                }}>Rewards</span>
                <TypeAnimation
                  sequence={[
                    ' Program',
                    2000,
                    ' Benefits',
                    2000,
                    ' Points',
                    2000,
                    ' Perks',
                    2000,
                    ' Tiers',
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
              <Link href="#howItWorks" passHref>
                <button 
                  className="relative group overflow-hidden bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white py-4 px-10 rounded-full
                            font-medium shadow-lg hover:shadow-accent/20 transform hover:translate-y-[-2px]
                            transition-all duration-300"
                >
                  <span className="relative z-10">Explore Rewards</span>
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
      
      {/* Scroll Indicator - Fixed to viewport bottom within hero */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <motion.div 
          className="flex flex-col items-center text-white/80 hover:text-accent transition-colors cursor-pointer group pointer-events-auto"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          onClick={() => {
            const heroSection = document.getElementById('rewards-hero');
            if (heroSection) {
              const heroHeight = heroSection.offsetHeight;
              window.scrollTo({
                top: heroHeight,
                behavior: 'smooth'
              });
            }
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Scroll</p>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsHero;
