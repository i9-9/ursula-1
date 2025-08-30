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
  // Start with splash hidden to ensure server/client consistency
  // We'll show it only after client-side initialization if needed
  const [isSplashVisible, setIsSplashVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initialize splash state after component mounts (client-side only)
  useEffect(() => {
    if (isInitialized) return;
    
    setIsInitialized(true);
    
    // Only check splash state on client side
    if (typeof window === 'undefined') return;
    
    const splashShown = sessionStorage.getItem('splashShown');
    const isHomePage = window.location.pathname === '/';
    
    console.log('SplashContext: splashShown:', splashShown, 'isHomePage:', isHomePage);
    
    if (splashShown === 'true') {
      console.log('SplashContext: Hiding splash (already shown)');
      setIsSplashVisible(false);
    } else if (!isHomePage) {
      console.log('SplashContext: Hiding splash (not home page)');
      // If no splash has been shown yet and we're not on home page, hide immediately
      // This prevents navbar flickering on direct navigation to other pages
      setIsSplashVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    } else {
      console.log('SplashContext: Showing splash (home page, first visit)');
      setIsSplashVisible(true);
    }
  }, [isInitialized]);

  return (
    <SplashContext.Provider value={{ isSplashVisible, hideSplash, resetSplash }}>
      {children}
    </SplashContext.Provider>
  );
};
