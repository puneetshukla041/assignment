'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // LERP: 0.04 is extremely smooth. It makes the content "drift."
      lerp: 0.04, 
      
      // DURATION: 1.8s makes the scroll transitions feel long and expensive.
      duration: 1.8, 
      
      // EASING: A more refined cubic-bezier for a "soft-landing" stop.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      
      // Multipliers: Slightly lower for wheel to remove any "stutter"
      wheelMultiplier: 0.7, 
      touchMultiplier: 1.5,
      
      // Prevent momentum from feeling too "slippery"
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}