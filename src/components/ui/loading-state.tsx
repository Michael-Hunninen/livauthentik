import React, { useEffect } from 'react';

// Prevent scrolling when loading state is active
const usePreventScroll = () => {
  useEffect(() => {
    // Store the original overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

export function LoadingState() {
  usePreventScroll();
  
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay with blur */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(61, 46, 37, 0.85)', // #3d2e25 with 85% opacity
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', // For Safari
        }}
      />
      
      {/* Content container with higher z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping-slow" />
            <div 
              className="absolute inset-2 rounded-full border-4 border-primary/40 animate-ping-slow" 
              style={{ animationDelay: '0.2s' }} 
            />
            <div 
              className="absolute inset-4 rounded-full border-4 border-primary/60 animate-ping-slow" 
              style={{ animationDelay: '0.4s' }} 
            />
            <div 
              className="absolute inset-6 rounded-full border-4 border-accent/80 animate-ping-slow" 
              style={{ animationDelay: '0.6s' }} 
            />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-primary tracking-wider">
              Liv Authentik
            </h2>
            <p className="text-muted-foreground text-sm md:text-base tracking-wider">
              Crafting your wellness journey
            </p>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
