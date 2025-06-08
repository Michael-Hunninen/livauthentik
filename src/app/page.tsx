'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTransitionWrapper } from '@/components/ScrollTransitionWrapper';
import { HomeFeaturedProducts } from './home-featured-products';
import { HomeBenefits } from './home-benefits';
import { HomeTestimonials } from './home-testimonials';
import { HomeBlogArticles } from './home-blog-articles';
import { HomeCta } from './home-cta';
import { FeaturedTicker } from '@/components/featured-ticker';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import LeadMagnetPopup from '@/components/LeadMagnetPopup';

// Dynamically import HomeHero with no SSR to avoid hydration issues
const HomeHero = dynamic(() => import('@/components/HomeHero'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  // Reference for the featured products section
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  
  // State for controlling popup visibility
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  
  // Check if we're already stored the user's email
  useEffect(() => {
    const hasSubmitted = localStorage.getItem('livauthentik-lead-submitted') === 'true';
    const lastShownTimestamp = localStorage.getItem('livauthentik-lead-timestamp');
    
    // If user submitted or popup was shown in the last 7 days, don't show again
    if (hasSubmitted) return;
    
    if (lastShownTimestamp) {
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const lastShown = parseInt(lastShownTimestamp, 10);
      const shouldShowAgain = Date.now() - lastShown > sevenDaysInMs;
      
      if (!shouldShowAgain) return;
    }
    
    setPopupShown(false);
  }, []);
  
  // Track scroll position to trigger the popup
  const scrollTriggered = useScrollTrigger({
    targetRef: featuredSectionRef,
    triggerOnce: true,
    offset: 100, // Trigger a bit before the section is fully visible
    threshold: 0.2
  });
  
  // Show popup when scroll trigger activates
  useEffect(() => {
    if (scrollTriggered && !popupShown) {
      // Add a small delay for better user experience
      const timer = setTimeout(() => {
        setPopupVisible(true);
        setPopupShown(true);
        
        // Record that we've shown the popup
        localStorage.setItem('livauthentik-lead-timestamp', Date.now().toString());
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [scrollTriggered, popupShown]);
  
  const handleClosePopup = () => setPopupVisible(false);
  return (
    <div className="bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -right-20 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl opacity-50 z-0"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-600/5 blur-3xl opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-[url('/images/texture-overlay.png')] opacity-10 mix-blend-overlay z-0"></div>
      </div>
      {/* Global styles for animations */}
      <style jsx global>{`
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

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>

      <div className="relative">
        {/* Hero Section - Sticky at the top */}
        <div className="sticky top-0 left-0 w-full h-screen z-0">
          <HomeHero />
        </div>
        
        {/* Content that overlays the hero immediately */}
        <section className="relative z-10 bg-background min-h-screen">
          <div className="pt-screen">
            <div className="relative z-10 bg-background">
            {/* Featured Ticker */}
            <div className="bg-background/50 backdrop-blur-sm border-y border-accent/5">
              <FeaturedTicker />
            </div>
            
            {/* Featured Products Section - This is where we'll trigger the popup */}
            <div ref={featuredSectionRef}>
              <HomeFeaturedProducts />
            </div>
            
            {/* Benefits Section */}
            <HomeBenefits />
            
            {/* Testimonials Section */}
            <HomeTestimonials />
            
            {/* Blog Articles Section */}
            <HomeBlogArticles />
            
            {/* CTA Section */}
            <HomeCta />
            </div>
          </div>
        </section>
      </div>
      
      {/* Lead Magnet Popup */}
      <LeadMagnetPopup isVisible={popupVisible} onClose={handleClosePopup} />
    </div>
  );
}
