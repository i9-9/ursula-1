'use client';

import { ReactNode, useEffect, useState } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  ssr?: boolean;
}

/**
 * HydrationSafe component that ensures consistent rendering between SSR and CSR
 * 
 * @param children - Content to render after hydration
 * @param fallback - Content to render during SSR or before hydration
 * @param ssr - Whether to render content during SSR (default: true)
 */
const HydrationSafe = ({ 
  children, 
  fallback = null, 
  ssr = true 
}: HydrationSafeProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR or before hydration, render fallback if ssr is false
  if (!isHydrated && !ssr) {
    return <>{fallback}</>;
  }

  // After hydration or during SSR, render children
  return <>{children}</>;
};

export default HydrationSafe;
