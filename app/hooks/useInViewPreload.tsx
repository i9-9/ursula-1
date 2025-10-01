'use client';

import { useRef, useEffect, useCallback } from 'react';

interface UseInViewPreloadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Hook para precargar contenido cuando entra en viewport
 * Optimiza performance precargando solo cuando es necesario
 */
export const useInViewPreload = (
  callback: () => void,
  options: UseInViewPreloadOptions = {}
) => {
  const targetRef = useRef<HTMLElement>(null);
  const hasTriggered = useRef(false);
  
  const {
    rootMargin = '200px',
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      callback();
      
      if (triggerOnce) {
        hasTriggered.current = true;
      }
    }
  }, [callback, triggerOnce]);

  useEffect(() => {
    if (!targetRef.current || (triggerOnce && hasTriggered.current)) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    });

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, rootMargin, threshold, triggerOnce]);

  return targetRef;
};

export default useInViewPreload;
