'use client';

import { ReactNode, useState, useEffect } from 'react';

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mostrar fallback hasta que se complete la hidratación
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
