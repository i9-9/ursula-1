'use client';

import { useSplash } from '../contexts/SplashContext';
import HydrationSafe from './HydrationSafe';

interface CopyrightProps {
  absolute?: boolean;
}

export default function Copyright({ absolute = false }: CopyrightProps) {
  const { isSplashVisible } = useSplash();

  // No mostrar el copyright si el splash/loader está visible
  if (isSplashVisible) {
    return null;
  }

  return (
    <HydrationSafe fallback={null}>
      <div className={absolute ? "" : "px-4 md:px-[30px] py-8"}>
        <div className="text-xs text-foreground text-right">
          © 2025
        </div>
      </div>
    </HydrationSafe>
  );
}
