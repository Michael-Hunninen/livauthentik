'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: "LivAuthentik's Devotion has completely transformed my morning routine. I've noticed a significant boost in my energy levels and focus throughout the day. The quality is unmatched!",
    author: "Sarah Johnson",
    role: "Wellness Coach",
    imageSrc: "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/6835e2edb543ef4287741c8e.png",
    rating: 5
  },
  {
    id: 2,
    content: "The Self Mastery program was exactly what I needed to break through my limiting beliefs. The personalized guidance and community support have been instrumental in my journey.",
    author: "Michael Chen",
    role: "Entrepreneur",
    imageSrc: "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/6835d244312289833ba25478.png",
    rating: 5
  },
  {
    id: 3,
    content: "As a fitness professional, I'm extremely selective about the supplements I recommend. LivAuthentik stands out for its transparency, quality, and remarkable results. My clients love it!",
    author: "Lisa Rodriguez",
    role: "Fitness Instructor",
    imageSrc: "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67c74aada5debb32c857bbfa.png",
    rating: 5
  },
  {
    id: 4,
    content: "The Authentik Integrated program has completely revolutionized my coaching business. I've been able to scale while maintaining the authentic connection with my clients.",
    author: "David Wilson",
    role: "Life Coach",
    imageSrc: "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67c5f9344094f417f82d7c87.png",
    rating: 5
  },
  {
    id: 5,
    content: "I was skeptical at first, but LivAuthentik's products exceeded all my expectations. The holistic approach to wellness has given me sustainable results that other programs couldn't provide.",
    author: "Jennifer Adams",
    role: "Nutrition Specialist",
    imageSrc: "https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67c5f9346d2b8374c7924e98.png",
    rating: 5
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const itemCount = testimonials.length;
  
  const itemWidth = 480; // Increased width for landscape images
  const angle = 360 / itemCount; // Angle between items
  const radius = Math.round((itemWidth / 2) / Math.tan(Math.PI / itemCount)); // Carousel radius

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + itemCount) % itemCount);
    setAutoplay(false);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, itemCount]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % itemCount);
    setAutoplay(false);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, itemCount]);

  // Auto-advance testimonials
  useEffect(() => {
    if (!autoplay || isAnimating) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, handleNext, isAnimating]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = touchStartX.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isAnimating) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      setIsAnimating(true);
      
      if (swipeDistance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      
      // Prevent rapid multiple swipes
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate position for each testimonial in the 3D carousel
  const getItemPosition = (index: number) => {
    // Calculate the position in the carousel accounting for current index
    const position = (index - currentIndex + itemCount) % itemCount;
    
    // Calculate angle in radians (0 to 2π)
    const angle = (position / itemCount) * Math.PI * 2;
    
    // Carousel dimensions - made more compact
    const radius = 300; // Adjusted radius for better fit with wider cards
    const centerOffset = 0; // How much to offset the center (0 = centered)
    
    // Calculate 3D position
    const x = Math.sin(angle) * radius;
    const z = (Math.cos(angle) * radius) - centerOffset;
    
    // Calculate scale and opacity based on angle (0 = front, π = back)
    const angleDeg = (angle * 180) / Math.PI;
    const normalizedAngle = ((angleDeg % 360) + 360) % 360; // Ensure 0-360 range
    const distanceFromFront = Math.min(
      Math.abs(normalizedAngle - 0),
      Math.abs(normalizedAngle - 360)
    ) / 180; // 0 to 1 (0 = front, 1 = back)
    
    const scale = 0.7 - (distanceFromFront * 0.3); // Scale down as items move away
    const opacity = 1 - (distanceFromFront * 1); // Fade out as items move away
    
    // Calculate rotation to face center (in degrees)
    const rotateY = (angle * 180) / Math.PI;
    
    return {
      x,
      z,
      rotateY: -rotateY,
      scale: Math.max(0.4, scale), // Ensure minimum scale
      opacity: Math.max(0.2, opacity), // Ensure minimum opacity
      zIndex: Math.round((1 - distanceFromFront) * 1000),
    };
  };

  return (
    <div 
      className="relative w-full h-[500px] overflow-visible flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={carouselRef}
    >
      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="carousel-nav-button carousel-nav-prev hidden md:flex"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <div className="relative w-full h-full" style={{ perspective: '800px' }}>
        <div 
          className="relative w-full h-full mx-auto" 
          style={{ 
            transformStyle: 'preserve-3d',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, index) => {
              const position = getItemPosition(index);
              const isActive = Math.abs(position.z) < 100; // Consider it active if it's near the front
              
              return (
                <motion.div
                  key={testimonial.id}
                  className={`absolute w-full max-w-[460px] mx-auto testimonial-card ${
                    isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                  }`}
                  style={{
                    x: position.x,
                    z: position.z,
                    rotateY: `${position.rotateY}deg`,
                    scale: position.scale,
                    opacity: position.opacity,
                    zIndex: position.zIndex,
                    transformOrigin: 'center center',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                  initial={false}
                  animate={{
                    x: position.x,
                    z: position.z,
                    rotateY: `${position.rotateY}deg`,
                    scale: position.scale,
                    opacity: position.opacity,
                    transition: {
                      type: 'spring',
                      stiffness: 80,
                      damping: 25,
                      mass: 0.8,
                    },
                  }}
                  onClick={() => !isActive && setCurrentIndex(index)}
                  transition={{
                    rotateY: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    z: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.8 },
                  }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-[#f9f5f0]/80 to-[#f0e6d9]/90 backdrop-blur-lg rounded-2xl border border-[#e0d0bc]/80 shadow-2xl"
                    whileHover={isActive ? { 
                      scale: 1.05,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    } : {}}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 300,
                      duration: 0.3
                    }}
                  >
                    {/* Image container */}
                    <div className="relative w-full h-80 overflow-hidden rounded-xl">
                      <Image 
                        src={testimonial.imageSrc} 
                        alt="Testimonial image" 
                        fill
                        sizes="(max-width: 768px) 100vw, 460px"
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center text-foreground hover:bg-white/20 transition-all z-20"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg flex items-center justify-center text-foreground hover:bg-white/20 transition-all z-20"
        aria-label="Next testimonial"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots navigation */}
      <div className="carousel-dots">
        {testimonials.map((_, index) => {
          const position = getItemPosition(index);
          const isActive = Math.abs(position.z) < 100;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`carousel-dot ${isActive ? 'active' : ''}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          );
        })}
      </div>
      
      <button 
        onClick={handleNext}
        className="carousel-nav-button carousel-nav-next hidden md:flex"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

export default TestimonialCarousel;
