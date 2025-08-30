'use client';

import { useEffect, useState, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

/**
 * Component that prevents hydration mismatches by ensuring
 * consistent rendering between server and client
 */
export default function HydrationSafe({ 
  children, 
  fallback = null, 
  delay = 0 
}: HydrationSafeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook for safely accessing client-side only features
 */
export function useHydrationSafe() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
