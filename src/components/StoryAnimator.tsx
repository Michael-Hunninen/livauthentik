'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import '../styles/story-animations.css';

export default function StoryAnimator() {
  const sectionRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Register the ScrollTrigger plugin
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Get the section reference
    sectionRef.current = document.getElementById('story-section');
    
    if (!sectionRef.current) return;

    // Background elements
    const bgGradient = document.querySelector('.story-bg-gradient');
    const borderTop = document.querySelector('.story-border-top');
    const borderBottom = document.querySelector('.story-border-bottom');
    const orb1 = document.querySelector('.story-orb-1');
    const orb2 = document.querySelector('.story-orb-2');
    const texture = document.querySelector('.story-texture');
    
    // Content elements
    const textContent = document.querySelector('.story-text-content');
    const badge = document.querySelector('.story-badge');
    const heading = document.querySelector('.story-heading');
    const separator = document.querySelector('.story-separator');
    const paragraphs = document.querySelector('.story-paragraphs');
    const quote = document.querySelector('.story-quote');
    const imageContainer = document.querySelector('.story-image-container');
    const imageGlow = document.querySelector('.story-image-glow');

    // Create the timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',  // Make it trigger sooner (when top of section reaches 85% down from viewport top)
        toggleActions: 'play none none none'
      }
    });

    // Add animations to timeline with staggered timing - faster sequence
    tl.addLabel('start')
      // Background elements first - faster and more simultaneous
      .to(bgGradient, { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, 'start')
      .to([borderTop, borderBottom], { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, 'start+=0.1')
      .to([orb1, orb2], { 
        opacity: 1, 
        duration: 0.7, 
        ease: 'power2.out' 
      }, 'start+=0.2')
      .to(texture, { 
        opacity: 0.05, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, 'start+=0.1')
      
      // Content elements - faster and more overlapped
      .to(textContent, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power3.out' 
      }, 'start+=0.2')
      
      // Badge and heading together
      .to([badge, heading], { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out',
        stagger: 0.1
      }, 'start+=0.3')
      
      // Separator line - faster
      .to(separator, { 
        width: '6rem', 
        duration: 0.7, 
        ease: 'power3.out' 
      }, 'start+=0.4')
      
      // Paragraphs and image together
      .to(paragraphs, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, 'start+=0.5')
      
      // Quote and image together
      .to(quote, { 
        opacity: 1, 
        duration: 0.6, 
        ease: 'power2.out' 
      }, 'start+=0.6')
      
      // Image - faster and starts earlier
      .to(imageContainer, { 
        opacity: 1, 
        x: 0, 
        duration: 0.7, 
        ease: 'power3.out' 
      }, 'start+=0.4');

    // Add a pulsing animation to the glow
    if (imageGlow) {
      gsap.to(imageGlow, {
        opacity: 0.9,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Clean up
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return null; // This component doesn't render anything
}

// Define CSS styles that will be used globally
export const storyAnimationStyles = `
  /* Initial state of elements */
  .story-bg-gradient, 
  .story-border-top, 
  .story-border-bottom, 
  .story-orb-1, 
  .story-orb-2, 
  .story-texture {
    opacity: 0;
  }

  .story-text-content {
    opacity: 0;
    transform: translateY(3rem);
  }

  .story-badge, 
  .story-heading, 
  .story-paragraphs {
    opacity: 0;
    transform: translateY(1.5rem);
  }

  .story-quote {
    opacity: 0;
  }

  .story-separator {
    width: 0;
  }

  .story-image-container {
    opacity: 0;
    transform: translateX(3rem);
  }
`;
