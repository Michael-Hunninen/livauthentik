'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TICKER_IMAGES = [
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67ff02308a36784970d21593.png",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f80d564d83df6caf3.png",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f266b6fec89973618.png",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f71384bf591b91d78.svg",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f8a36784d1fd20173.svg",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37fc7a015469adc410a.jpeg",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f80d564e292f6caf4.webp",
  "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67fef37f266b6f6e45973619.svg"
];

function TickerContent() {
  return (
    <>
      {[...TICKER_IMAGES].map((src, index) => (
        <div 
          key={`${index}-${src}`} 
          className="ticker-logo flex-shrink-0 flex items-center justify-center h-20 px-4 hover:scale-110 transition-transform duration-300"
        >
          <div className="relative h-full w-32 flex items-center justify-center">
            <Image
              src={src}
              alt=""
              width={120}
              height={80}
              className="h-auto max-h-16 w-auto max-w-[120px] object-contain opacity-90 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
              loading="eager"
              priority
            />
          </div>
        </div>
      ))}
    </>
  );
}

export function FeaturedTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  const [duration, setDuration] = useState('40s');
  
  useEffect(() => {
    if (!tickerRef.current) return;
    
    const ticker = tickerRef.current;
    const tickerItems = Array.from(ticker.querySelectorAll('.ticker-logo'));
    if (tickerItems.length === 0) return;
    
    // Calculate the total width of one set of ticker items
    const itemWidth = tickerItems[0].getBoundingClientRect().width;
    const gap = parseInt(window.getComputedStyle(tickerItems[0]).marginRight) * 2 || 32;
    const itemsPerSet = tickerItems.length / 3; // We're rendering 3 sets
    const totalWidth = (itemWidth + gap) * itemsPerSet;
    
    setTickerWidth(totalWidth);
    
    // Calculate duration based on width and desired speed (pixels per second)
    const pixelsPerSecond = 80; // Slower speed for better visibility
    const durationInSeconds = totalWidth / pixelsPerSecond;
    setDuration(`${durationInSeconds}s`);
  }, []);

  return (
    <div className="w-full py-16 bg-gradient-to-b from-background to-primary/5 overflow-hidden relative z-10">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-5 mix-blend-overlay z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className="text-center mb-10 animate-fade-in-up"
        >
          <span className="text-xs font-medium tracking-widest text-accent/90 mb-2 inline-block">
            AS FEATURED IN
          </span>
          <h3 className="text-2xl font-serif font-light text-foreground mb-8">
            Trusted by Leading Brands
          </h3>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent via-amber-400 to-accent/80 mx-auto mb-8"></div>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Smooth fade effect on sides */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--background)) 0%, hsla(var(--background), 0.9) 50%, hsla(var(--background), 0) 100%)',
            }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(270deg, hsl(var(--background)) 0%, hsla(var(--background), 0.9) 50%, hsla(var(--background), 0) 100%)',
            }}
          />
          
          {/* Ticker track */}
          <div className="ticker-row w-full overflow-hidden">
            <div 
              ref={tickerRef}
              className="ticker-track flex items-center"
              style={{
                display: 'flex',
                width: 'max-content',
                willChange: 'transform',
                animation: `ticker-scroll ${duration} linear infinite`,
                animationPlayState: 'running'
              }}
            >
              {/* Render content three times for seamless looping */}
              <div className="flex items-center">
                <TickerContent />
              </div>
              <div className="flex items-center">
                <TickerContent />
              </div>
              <div className="flex items-center">
                <TickerContent />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        
        .ticker-track {
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        
        .ticker-logo {
          flex-shrink: 0;
          margin: 0 1.5rem;
          min-width: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        /* Force hardware acceleration */
        .ticker-row {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        @media (max-width: 1024px) {
          .ticker-track {
            gap: 3rem !important;
          }
        }

        @media (max-width: 768px) {
          .ticker-track {
            gap: 2rem !important;
            animation-duration: 30s;
          }
          .ticker-logo {
            height: 3.5rem !important;
          }
          .ticker-logo img {
            max-height: 3.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .ticker-track {
            gap: 1.5rem !important;
            animation-duration: 25s;
          }
          .ticker-logo {
            height: 2.5rem !important;
          }
          .ticker-logo img {
            max-height: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
