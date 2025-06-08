"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register the ScrollTrigger plugin with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryCard {
  id: string;
  heading?: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  isQuote?: boolean;
  gradientPosition?: string;
}

interface StorySliderProps {
  cards: StoryCard[];
}

const StorySlider: React.FC<StorySliderProps> = ({ cards }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollTriggerRef = useRef<any>(null);

  // Make navigation dots clickable - defined outside useEffect
  const handleDotClick = (index: number) => {
    if (scrollTriggerRef.current) {
      // Calculate progress for this card
      const progress = index / (cards.length - 1);
      
      // Animate to the selected card
      gsap.to(scrollTriggerRef.current, {
        progress: progress,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: () => scrollTriggerRef.current.update()
      });
    }
  };

  useEffect(() => {
    // Set isReady to true once mounted on client
    setIsReady(true);
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (!isReady || typeof window === 'undefined') return;

    const container = containerRef.current;
    const slider = sliderRef.current;
    
    if (!container || !slider) return;
    
    // Calculate the total width for horizontal scrolling
    const totalWidth = slider.scrollWidth;
    const windowWidth = window.innerWidth;
    const distanceToScroll = totalWidth - windowWidth;
    
    // Keep the last card visible persistently
    const lastCard = document.querySelector('.story-card:last-child');

    // Use a different approach with direct card control
    // First, get all card elements
    const cardElements = gsap.utils.toArray<HTMLElement>('.story-card');
    
    // Set up a scroll trigger that updates a progress value
    // Create the scroll trigger and store in ref for access outside the effect
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 0.3, // Use a number for smoother scrolling response (smaller = more responsive)
      // No snap - we'll handle this with custom logic for smooth transitions
      pin: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers: false,
      onUpdate: (self) => {
        // Calculate which card should be shown based on progress
        const cardIndex = Math.min(
          Math.max(
            Math.round(self.progress * (cards.length - 1)),
            0
          ),
          cards.length - 1
        );
        
        // Update active card index for UI
        setActiveCardIndex(cardIndex);
        
        // Apply active/inactive styling to cards
        cardElements.forEach((card, i) => {
          if (i === cardIndex) {
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              overwrite: true
            });
          } else {
            gsap.to(card, {
              opacity: 0.4,
              scale: 0.85,
              duration: 0.3,
              overwrite: true
            });
          }
        });
      }
    });
    
    // Track user scroll intent for direction-based navigation
    let lastScrollTime = 0;
    let scrollTimeout: NodeJS.Timeout;
    let lastProgress = 0;
    let userScrollDirection = 0;
    
    // Create the main timeline for horizontal sliding with smoother settings
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 0.3, // Smoother scrubbing with minimal delay
        pin: false,
        anticipatePin: 0.5, // Smoother pinning
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
          // Track scroll direction with debouncing
          const now = Date.now();
          const progress = self.progress;
          
          // Only update direction if enough time has passed to be intentional
          if (now - lastScrollTime > 50) {
            userScrollDirection = progress > lastProgress ? 1 : -1;
          }
          
          lastScrollTime = now;
          lastProgress = progress;
          
          // Calculate current position with floating point precision
          const currentPos = self.progress * (cards.length - 1);
          const currentCardIndex = Math.floor(currentPos);
          const nextCardIndex = Math.min(currentCardIndex + 1, cards.length - 1);
          const progressBetweenCards = currentPos - currentCardIndex;
          
          // Update card opacities smoothly based on scroll position
          cardElements.forEach((card, i) => {
            if (i === currentCardIndex) {
              // Current card - fade out as we scroll away
              gsap.to(card, {
                opacity: 1 - progressBetweenCards * 0.6,
                scale: 1 - progressBetweenCards * 0.1, // Very subtle scale down
                duration: 0.1,
                ease: "sine.out",
                overwrite: true
              });
            } else if (i === nextCardIndex) {
              // Next card - fade in as we approach it
              gsap.to(card, {
                opacity: 0.5 + progressBetweenCards * 0.5,
                scale: 0.9 + progressBetweenCards * 0.1, // Subtle scale up
                duration: 0.1,
                ease: "sine.out",
                overwrite: true
              });
            } else {
              // Other cards - ensure they're in the background
              if (i < currentCardIndex || i > nextCardIndex) {
                gsap.to(card, {
                  opacity: 0.4,
                  scale: 0.85,
                  duration: 0.2,
                  overwrite: true
                });
              }
            }
          });
          
          // Update active card index for dots
          const activeIndex = Math.round(currentPos);
          if (activeIndex !== activeCardIndex) {
            setActiveCardIndex(activeIndex);
          }
          
          // Clear any pending snap timeouts
          clearTimeout(scrollTimeout);
          
          // Set a timeout to finalize position if scrolling stops
          scrollTimeout = setTimeout(() => {
            const finalPos = self.progress * (cards.length - 1);
            const nearestCard = Math.round(finalPos);
            
            // Only animate if we're not already on a card
            if (Math.abs(finalPos - nearestCard) > 0.05) {
              gsap.to(self, {
                progress: nearestCard / (cards.length - 1),
                duration: 0.3,
                ease: "sine.out",
                overwrite: true
              });
            }
          }, 80); // Shorter delay for more responsive feel
        },
        onEnterBack: () => {
          // When scrolling back up, restore visibility
          gsap.to(container, {
            opacity: 1,
            duration: 0.3,
          });
        },
        onLeave: () => {
          // Keep full opacity when leaving the slider
          gsap.to(container, {
            opacity: 1,
            duration: 0.5,
          });
        }
      }
    });
    
    // Add the main horizontal scroll animation
    tl.to(slider, {
      x: -distanceToScroll,
      ease: "none", // Linear progress mapping for smooth movement
      duration: 1,
    }, 0);
    
    // Set initial states for all cards
    cardElements.forEach((card, i) => {
      gsap.set(card, { 
        opacity: i === 0 ? 1 : 0.4,
        scale: i === 0 ? 1 : 0.85
      });
    });
    
    // Note: handleDotClick is now defined outside useEffect
    
    // Add optional mouse wheel special handling for smoother experience
    container.addEventListener('wheel', (e) => {
      // Optional: Add custom wheel behavior here if needed
    }, { passive: true });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isReady, cards.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Luxurious 3D Background with Depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base Gradient with Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-50/95 to-amber-100/90">
          {/* Subtle 3D Mesh */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 100 100\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,0 L100,0 L100,100 L0,100 Z\' fill=\'none\' stroke=\'%23d4a76a\' stroke-width=\'0.5\' stroke-opacity=\'0.3\' vector-effect=\'non-scaling-stroke\'/%3E%3C/svg%3E")',
              backgroundSize: '50px 50px'
            }}
          />
        </div>
        
        {/* Dynamic Noise Texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
            mixBlendMode: 'soft-light' as const
          }}
        />
        
        {/* Elegant Damask Pattern with 3D Effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20c0-11 9-20 20-20h120c11 0 20 9 20 20v160c0 11-9 20-20 20H40c-11 0-20-9-20-20V20z\' fill=\'none\' stroke=\'%23d4a76a\' stroke-width=\'0.5\' stroke-opacity=\'0.2\'/%3E%3Cpath d=\'M60 20v160M140 20v160M20 60h160M20 140h160\' fill=\'none\' stroke=\'%23d4a76a\' stroke-width=\'0.3\' stroke-opacity=\'0.15\'/%3E%3C/svg%3E")',
            backgroundSize: '300px 300px',
            mixBlendMode: 'overlay' as const
          }}
        />
        
        {/* 3D Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 via-transparent to-amber-100/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/40 via-transparent to-amber-50/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-50/30" />
        
        {/* Dynamic Light Orbs with Animation */}
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-amber-200/40 via-amber-100/20 to-transparent rounded-full filter blur-4xl opacity-70 animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -left-1/4 w-3/5 h-3/5 bg-gradient-to-tr from-amber-100/30 via-amber-50/15 to-transparent rounded-full filter blur-4xl opacity-70 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Subtle Diagonal Lines */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #d4a76a 0px, #d4a76a 1px, transparent 1px, transparent 100px)',
            backgroundSize: '141.42px 141.42px'
          }}
        />
        
        {/* 3D Border Effect */}
        <div className="absolute inset-0 border-8 border-transparent" 
          style={{
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.03)',
            borderImage: 'linear-gradient(135deg, rgba(212,167,106,0.1) 0%, rgba(0,0,0,0) 50%, rgba(212,167,106,0.1) 100%) 1',
          }}
        />
        
        {/* Subtle Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-200/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-200/20" />
      </div>
      
      {/* Slider Container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-screen overflow-hidden" 
        style={{ zIndex: 30, transition: "opacity 0.5s ease", opacity: 1 }}
      >
        <div ref={sliderRef} className="flex h-screen">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              className={`story-card flex-shrink-0 w-screen h-screen flex items-center justify-center relative ${index === 0 ? 'active' : ''}`}
            >
              <div className={`w-full h-[80vh] max-w-4xl mx-auto relative overflow-hidden p-8 md:p-12 backdrop-blur-sm
                ${card.isQuote ? 'bg-white/10 border-l-4 border-accent shadow-xl' : 'bg-white/5 shadow-lg'}
                rounded-3xl flex items-center`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 -z-10 bg-gradient-to-${card.gradientPosition || 'tr'} from-accent/5 via-transparent to-accent/10 opacity-60`}></div>
                
                {/* Background Image with Brand Overlay */}
                <div className="absolute inset-0 -z-20">
                  {card.imageSrc ? (
                    <>
                      <Image
                        src={card.imageSrc}
                        alt={card.imageAlt || "Background"}
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-amber-900/20 to-amber-950/50"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-amber-50/80 to-amber-100/90"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-full p-8 md:p-12 bg-amber-50/90 backdrop-blur-sm rounded-2xl border border-amber-100/40 shadow-2xl 
                  transition-all duration-300 hover:shadow-3xl hover:shadow-amber-200/30 hover:-translate-y-1">
                  {/* Decorative corner accents */}
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/50 rounded-tr-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/50 rounded-bl-2xl"></div>
                  {card.heading && (
                    <h3 className="text-3xl md:text-4xl font-serif font-light mb-6 text-amber-950">
                      {card.heading}
                    </h3>
                  )}
                  
                  <div className={`${card.isQuote ? 'text-2xl md:text-3xl font-serif italic font-light' : 'text-lg md:text-xl'} text-amber-900/90 leading-relaxed max-w-4xl`}>
                    {card.content}
                  </div>
                  
                  {card.isQuote && (
                    <div className="h-px w-40 bg-gradient-to-r from-amber-500/70 to-transparent mt-8"></div>
                  )}
                </div>
                
                <div className="absolute bottom-8 right-8">
                  <div className="text-accent/60 text-sm font-serif">
                    {index + 1} / {cards.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-accent/10 px-4 py-2 rounded-full backdrop-blur-sm border border-accent/20 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-accent/90">Scroll to navigate</span>
            <div className="flex space-x-1">
              {cards.map((_, i) => (
                <div 
                  key={`dot-${i}`} 
                  className={`slider-nav-dot w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${i === activeCardIndex ? 'bg-accent scale-110' : 'bg-accent/30'}`}
                  onClick={() => handleDotClick(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySlider;
