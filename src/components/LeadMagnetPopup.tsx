'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import Image from 'next/image';

interface LeadMagnetPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LeadMagnetPopup({ isVisible, onClose }: LeadMagnetPopupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send this data to your CRM or email service
    console.log('Submitted:', { email, name });
    
    // Show success state
    setSubmitted(true);
    
    // Store in local storage to prevent showing again for some time
    localStorage.setItem('livauthentik-lead-submitted', 'true');
    localStorage.setItem('livauthentik-lead-timestamp', Date.now().toString());
    
    // Close after 3 seconds
    setTimeout(() => {
      onClose();
      // Reset form for next time
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setName('');
      }, 500);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={popupRef}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="relative mx-4 w-full max-w-4xl bg-gradient-to-br from-[#f9f5f0] to-[#f0e6d9] rounded-xl overflow-hidden shadow-2xl border border-[#e0d0bc] flex flex-col md:flex-row"
            style={{ maxHeight: '90vh' }}
          >
            {/* Gold accent decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/texture-overlay.png')] bg-blend-overlay"></div>
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-accent/5 blur-xl"></div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-accent/5 blur-xl"></div>

            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[#8c7157] hover:text-accent transition-colors z-10"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>
            
            {/* Left column - Devotion single bag image */}
            <div className="md:w-1/2 relative overflow-hidden hidden md:block">
              <div className="relative h-full overflow-hidden py-8 px-4">
                <div className="relative h-full w-full">
                  <Image 
                    src="https://storage.googleapis.com/msgsndr/5aAlQ1qN7UqHLdGzV8gr/media/67be57a4b8175c4a378822f0.png" 
                    alt="Devotion Supplement" 
                    fill 
                    className="object-contain object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Right column - Form */}
            <div className="p-8 relative z-0 md:w-1/2">
              {!submitted ? (
                <>

                  <h2 className="text-2xl font-serif text-[#3a2e24] text-center mb-2">Unlock <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-amber-600">Premium</span> Benefits</h2>
                  <p className="text-[#5d4c3a] text-center mb-6">Join our exclusive list to receive a personalized wellness guide and <span className="font-bold text-[#3a2e24]">25% off</span> your first order.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your Name"
                        className="block w-full px-4 py-3 bg-white/90 border border-[#d4c4b0] focus:border-accent focus:ring focus:ring-accent/20 rounded-lg text-[#3a2e24] placeholder-[#8c7d6a]/70 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <input 
                        type="email" 
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Your Email"
                        className="block w-full px-4 py-3 bg-white/90 border border-[#d4c4b0] focus:border-accent focus:ring focus:ring-accent/20 rounded-lg text-[#3a2e24] placeholder-[#8c7d6a]/70 outline-none transition-all"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full py-3 px-6 bg-gradient-to-r from-accent to-amber-600 text-white font-medium rounded-lg hover:opacity-90 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 shadow-lg shadow-amber-500/20"
                    >
                      Claim Your Offer
                    </button>
                  </form>
                  
                  <p className="text-xs text-[#8c7d6a] text-center mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </>
              ) : (
                <div className="py-8 w-full flex flex-col items-center justify-center">
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        damping: 10, 
                        stiffness: 100,
                        delay: 0.2 
                      }}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-amber-600 flex items-center justify-center shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-serif text-[#3a2e24] text-center mb-4">Thank You!</h2>
                    <p className="text-[#5d4c3a] text-center mb-2">
                      Your exclusive wellness guide is on its way to your inbox.
                    </p>
                    <p className="text-[#8c7d6a] text-center">
                      Use code <span className="font-bold bg-gradient-to-r from-accent to-amber-600 bg-clip-text text-transparent">WELCOME25</span> at checkout for 25% off.
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
