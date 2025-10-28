'use client';

import { useEffect, useState, ReactNode } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

/**
 * Component that prevents hydration mismatches by deferring
 * client-only rendering until after hydration completes
 */
export default function HydrationSafe({
  children,
  fallback = null,
  delay = 0
}: HydrationSafeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Render fallback during SSR and initial client render (prevents mismatch)
  // After hydration, show children
  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook for detecting when component has mounted (client-side)
 * Returns false during SSR and initial render to prevent hydration mismatch
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
