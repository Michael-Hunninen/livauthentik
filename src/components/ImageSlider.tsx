"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
  images: string[];
  interval?: number;
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  interval = 5000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState<boolean[]>(Array(images.length).fill(false));
  const [isAllLoaded, setIsAllLoaded] = React.useState(false);

  // Handle image loading
  const handleImageLoad = (index: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[index] = true;
    setIsLoaded(newLoadedState);
    
    // Check if at least first image is loaded
    if (index === 0) {
      setIsAllLoaded(true);
    }
  };

  // Auto-advance slides
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Preload all images
  React.useEffect(() => {
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => handleImageLoad(index);
    });
  }, [images]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {!isAllLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-center p-6 rounded-lg">
            <div className="animate-pulse text-lg mb-2">Loading images...</div>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
