'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

export function ScrollTransitionWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['100vh', '0vh']
  );
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.10],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
  );
  
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.10],
    ['3rem', '0rem']
  );
  
  const borderGlow = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1],
    ['0px 0px 15px rgba(255, 215, 0, 0.5)', '0px 0px 8px rgba(255, 215, 0, 0.2)', '0px 0px 0px rgba(255, 215, 0, 0)']
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Decorative blurred circles - luxury brand element */}
      <motion.div 
        className="absolute left-[10%] top-[5%] w-32 h-32 rounded-full bg-amber-300/20 filter blur-xl"
        style={{ 
          opacity: useTransform(scrollYProgress, [0, 0.1], [0.8, 0]),
          scale: useTransform(scrollYProgress, [0, 0.1], [1, 0.6]),
        }}
      />
      <motion.div 
        className="absolute right-[15%] top-[15%] w-48 h-48 rounded-full bg-amber-400/10 filter blur-xl"
        style={{ 
          opacity: useTransform(scrollYProgress, [0, 0.1], [0.6, 0]),
          scale: useTransform(scrollYProgress, [0, 0.1], [1, 0.7]),
        }}
      />
      
      <motion.div 
        className="w-full overflow-hidden" 
        style={{ 
          y, 
          position: 'relative', 
          zIndex: 10,
          backgroundColor,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          boxShadow: borderGlow
        }}
      >
        <div className="backdrop-blur-sm">
          <div className="relative">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
