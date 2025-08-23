'use client';

import { useEffect, useState } from 'react';
import UrsulaLogo from './UrsulaLogo';
import { useThemeContext } from './ThemeProvider';

interface HomeLoaderProps {
  onLoadingComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export default function HomeLoader({ onLoadingComplete, duration = 2000 }: HomeLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useThemeContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Small delay to allow fade out animation
      setTimeout(() => {
        onLoadingComplete();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300">
      <div 
        className={`w-full h-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-background' : 'bg-background'
        }`}
      >
        <div className="text-center">
          <UrsulaLogo 
            className="h-6 w-auto animate-pulse" 
            title="Ursula"
          />

        </div>
      </div>
    </div>
  );
}
