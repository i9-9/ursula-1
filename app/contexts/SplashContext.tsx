'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface SplashContextType {
  isSplashVisible: boolean;
  hideSplash: () => void;
  resetSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
};

interface SplashProviderProps {
  children: ReactNode;
}

export const SplashProvider: React.FC<SplashProviderProps> = ({ children }) => {
  // Start with splash visible on home page to show immediately
  const [isSplashVisible, setIsSplashVisible] = useState(() => {
    // Only run on client side
    if (typeof window === 'undefined') return false;
    
    const isHomePage = window.location.pathname === '/';
    const splashShown = sessionStorage.getItem('splashShown');
    
    // Show splash immediately on home page if not shown before
    return isHomePage && splashShown !== 'true';
  });

  const hideSplash = useCallback(() => {
    console.log('SplashContext: hideSplash called');
    setIsSplashVisible(false);
    // Store in sessionStorage so splash won't show again in this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
  }, []);

  const resetSplash = useCallback(() => {
    console.log('SplashContext: resetSplash called');
    setIsSplashVisible(true);
    // Remove from sessionStorage to allow splash to show again
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('splashShown');
    }
  }, []);

  // Auto-hide splash after 2.5 seconds if it's visible
  useEffect(() => {
    if (!isSplashVisible) return;
    
    console.log('SplashContext: Auto-hiding splash after 2.5 seconds');
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [isSplashVisible]);

  return (
    <SplashContext.Provider value={{ isSplashVisible, hideSplash, resetSplash }}>
      {children}
    </SplashContext.Provider>
  );
};
