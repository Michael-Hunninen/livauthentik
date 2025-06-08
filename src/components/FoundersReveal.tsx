"use client"

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FoundersReveal() {
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    const section = document.getElementById('founders-section');
    if (!section) return;
    
    // Premium animation sequence for luxury reveal
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top 25%',
        scrub: false,
        markers: false,
        once: true,
      }
    });

    // First animation: reveal horizontal dividing line
    mainTimeline.to('.founders-line', {
      width: '100%',
      duration: 0.8,
      ease: 'power1.inOut'
    });
    
    // Fade in the main section background
    mainTimeline.to('.founders-reveal', {
      opacity: 1,
      duration: 0.7,
      ease: 'sine.inOut'
    }, "-=0.5");
    
    // Fade in section heading and subheading
    const headerElements = document.querySelectorAll('#founders-section .founders-header');
    if (headerElements.length) {
      mainTimeline.fromTo(headerElements, 
        { y: 20, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "sine.out" 
        },
        "-=0.4"
      );
    }
    
    // Staggered entrance of founder cards
    const founderCards = document.querySelectorAll('#founders-section .founder-card');
    if (founderCards.length) {
      mainTimeline.fromTo(founderCards, 
        { y: 40, opacity: 0, scale: 0.95 }, 
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "back.out(1.2)" 
        },
        "-=0.5"
      );
    }
    
    // Clean up animations on unmount
    return () => {
      mainTimeline.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  return null; // This is a behavior component that doesn't render anything
}
