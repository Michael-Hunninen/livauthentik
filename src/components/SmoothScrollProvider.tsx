"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// @ts-ignore - Import Lenis from the new package name
import Lenis from 'lenis';

interface SmoothScrollContextType {
  lenis: any | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  options?: {
    lerp?: number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
  };
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ 
  children,
  options = {
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  } 
}) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  
  useEffect(() => {
    // Only initialize Lenis on client-side
    if (typeof window === 'undefined') return;
    
    // Create Lenis instance with correct options
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: options.lerp,
      // @ts-ignore - Lenis API has changed but types may not be updated
      smooth: options.smoothWheel,
      wheelMultiplier: options.wheelMultiplier,
    });
    
    setLenis(lenisInstance);
    
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenisInstance.destroy();
    };
  }, [options.lerp, options.smoothWheel, options.wheelMultiplier]);
  
  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
