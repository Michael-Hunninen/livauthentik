import { useState, useEffect, RefObject } from 'react';

interface ScrollTriggerOptions {
  // Element to track for visibility
  targetRef: RefObject<HTMLElement>;
  // Offset from the top of the viewport (in pixels)
  offset?: number;
  // Only trigger once
  triggerOnce?: boolean;
  // How much of the element should be visible (0 to 1)
  threshold?: number;
}

/**
 * Custom hook that returns true when the target element comes into view
 */
export function useScrollTrigger({
  targetRef,
  offset = 0, 
  triggerOnce = true,
  threshold = 0.1
}: ScrollTriggerOptions): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    // If already triggered and triggerOnce is true, don't add observers
    if (triggerOnce && triggered) return;

    // Don't proceed if we don't have a valid reference
    if (!targetRef.current) return;

    const options = {
      root: null, // Use the viewport as root
      rootMargin: `${-offset}px 0px 0px 0px`,
      threshold: threshold
    };

    // Setup intersection observer
    const observer = new IntersectionObserver(entries => {
      // We're only observing a single element
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        setTriggered(true);
        
        // If triggerOnce is true, disconnect the observer after triggering
        if (triggerOnce) {
          observer.disconnect();
        }
      } else if (!triggerOnce) {
        // Only reset if we're not in triggerOnce mode
        setTriggered(false);
      }
    }, options);

    // Start observing
    observer.observe(targetRef.current);

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [targetRef, offset, triggerOnce, threshold, triggered]);

  return triggered;
}
