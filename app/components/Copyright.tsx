'use client';

import { useSplash } from '../contexts/SplashContext';
import HydrationSafe from './HydrationSafe';

export default function Copyright() {
  const { isSplashVisible } = useSplash();

  // No mostrar el copyright si el splash/loader está visible
  if (isSplashVisible) {
    return null;
  }

  return (
    <HydrationSafe fallback={null}>
      <div className="fixed bottom-8 right-8 z-40 text-xs text-foreground">
        © 2025
      </div>
    </HydrationSafe>
  );
}
