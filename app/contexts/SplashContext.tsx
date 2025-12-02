'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface SplashContextType {
  isSplashVisible: boolean;
  hideSplash: () => void;
  resetSplash: () => void;
  isInitialized: boolean;
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
  // Start with splash hidden by default, will be shown only on home page if needed
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initialize splash state based on current page and session
  useEffect(() => {
    const isHomePage = window.location.pathname === '/';
    const splashShown = sessionStorage.getItem('splashShown');
    
    // Only show splash on home page and if not already shown
    if (isHomePage && splashShown !== 'true') {
      setIsSplashVisible(true);
    } else {
      setIsSplashVisible(false);
    }
    
    // Mark as initialized to prevent flashing
    setIsInitialized(true);
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
    <SplashContext.Provider value={{ isSplashVisible, hideSplash, resetSplash, isInitialized }}>
      {children}
    </SplashContext.Provider>
  );
};
