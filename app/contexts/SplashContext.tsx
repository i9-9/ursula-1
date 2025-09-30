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
  // Start with splash visible to prevent flash, then hide if not needed
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const hideSplash = useCallback(() => {
    setIsSplashVisible(false);
    // Store in sessionStorage so splash won't show again in this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
  }, []);

  const resetSplash = useCallback(() => {
    setIsSplashVisible(true);
    // Remove from sessionStorage to allow splash to show again
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('splashShown');
    }
  }, []);

  // Check if splash should be shown after hydration
  useEffect(() => {
    const isHomePage = window.location.pathname === '/';
    const splashShown = sessionStorage.getItem('splashShown');
    
    // Hide splash immediately if not on home page or already shown
    if (!isHomePage || splashShown === 'true') {
      setIsSplashVisible(false);
    }
  }, []);

  // Auto-hide splash after 2.5 seconds if it's visible
  useEffect(() => {
    if (!isSplashVisible) return;
    
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
