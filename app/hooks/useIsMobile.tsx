'use client';

import { useState, useEffect, useRef } from 'react';

export const useIsMobile = (breakpoint: number = 1024) => {
  // Start with false (desktop) to match SSR - prevents hydration mismatch
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth < breakpoint;
      // Solo actualizar si el valor realmente cambió
      setIsMobile(prev => prev !== newIsMobile ? newIsMobile : prev);
    };

    // Verificar inicialmente
    checkIsMobile();

    // Debounce resize para evitar demasiados re-renders
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(checkIsMobile, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [breakpoint]);

  // Always return boolean (never undefined) to match SSR
  return isMobile;
};
