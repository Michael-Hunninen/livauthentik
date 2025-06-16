'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const HomeHero: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);
  
  // Video source with fallback
  const videoSrc = 'https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67ec3ecfe519ed4c3d31db76.mp4';
  const fallbackImage = '/images/hero-fallback.jpg'; // Add this image to your public folder

  // Set isClient to true on mount to avoid hydration issues
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle video play with debug info
  const handleVideoCanPlay = () => {
    console.log('Video can play event fired');
    const video = videoRef.current;
    if (video) {
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('Video readyState:', video.readyState);
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video is playing successfully');
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
      <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
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
              onPlaying={() => console.log('Video is actually playing!')}
              onError={(e) => {
                console.error('Video error event:', e);
                console.log('Video element:', videoRef.current);
                console.log('Video readyState:', videoRef.current?.readyState);
                setVideoError(true);
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
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
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
      </div>
      
      {/* Hero Content - Fixed to stay with video */}
      <div className="fixed inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-light text-[#fffff0] tracking-tight whitespace-nowrap">
                <TypeAnimation
                  sequence={[
                    'Liv',
                    2000,
                    '',
                    400,
                    'Eat',
                    2000,
                    '',
                    400,
                    'Move',
                    2000,
                    '',
                    400,
                    'Think',
                    2000,
                    '',
                    400,
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
                    letterSpacing: '0.02em',
                    paddingRight: '0.05em' // Slight adjustment for better spacing
                  }}
                  repeat={Infinity}
                  cursor={false}
                />
                <span 
                  className="ml-[-0.1em]" // Tighter margin between words
                  style={{
                    background: 'linear-gradient(to right, #fffff0, #caac8e, #fffff0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-cinzel)',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    letterSpacing: '0.02em',
                    paddingLeft: '0.05em' // Slight adjustment for better spacing
                  }}
                >
                  Authentik
                </span>
              </span>
            </motion.div>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link 
                href="/shop" 
                className="px-8 py-3 bg-gradient-to-r from-accent via-amber-400 to-accent/80 text-white rounded-full shadow-lg hover:shadow-accent/30 transition duration-300 text-sm font-medium uppercase tracking-wider flex items-center"
              >
                Shop Now
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 border border-[#fffff0] text-[#fffff0] hover:bg-[#fffff0]/30 bg-[#fffff0]/20 rounded-full transition duration-300 text-sm font-medium uppercase tracking-wider"
              >
                About Us
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
    </div>
  );
};

export default HomeHero;
