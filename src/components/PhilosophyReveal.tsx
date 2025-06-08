"use client"

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PhilosophyReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    const section = document.getElementById('philosophy-section');
    if (!section) return;
    
    // Ultra smooth animation sequence for luxury feel
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers: false,
        once: true,
      }
    });

    // First animation: subtle fade-in of the entire section
    mainTimeline.to(section, {
      opacity: 1, 
      duration: 0.4, // Reduced from 0.6
      ease: "sine.inOut"
    });
    
    // Second animation: elegant line draw across the top
    mainTimeline.to('.philosophy-line', {
      width: '100%',
      duration: 1.3, // Reduced from 1.8
      ease: 'power1.inOut'
    }, "-=0.2"); // Adjusted overlap timing
    
    // Third animation: reveal section background with refined ease
    mainTimeline.to('.philosophy-reveal', {
      scaleY: 1,
      duration: 1.0, // Reduced from 1.4
      ease: 'power2.inOut'
    }, "-=0.9"); // Adjusted overlap timing
    
    // Fourth animation: fade in the title with subtle motion
    const title = document.querySelector('#philosophy-section .section-title');
    if (title) {
      mainTimeline.fromTo(title, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.9, ease: "sine.out" }, // Reduced from 1.2
        "-=0.6" // Adjusted overlap timing
      );
    }
    
    // Fifth animation: elegant fade-in of cards with subtle scale
    const contentElements = document.querySelectorAll('#philosophy-section .philosophy-content');
    if (contentElements.length) {
      mainTimeline.fromTo(contentElements, 
        { y: 20, opacity: 0, scale: 0.98 }, 
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.7, // Reduced from 1.0
          stagger: 0.1, // Reduced from 0.15 for faster card appearance
          ease: "sine.inOut" 
        },
        "-=0.7" // Adjusted overlap timing
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
