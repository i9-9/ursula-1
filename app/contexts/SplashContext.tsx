'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const hideSplash = () => {
    console.log('SplashContext: hideSplash called');
    setIsSplashVisible(false);
    // Store in sessionStorage so splash won't show again in this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('splashShown', 'true');
    }
  };

  const resetSplash = () => {
    console.log('SplashContext: resetSplash called');
    setIsSplashVisible(true);
    // Remove from sessionStorage to allow splash to show again
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('splashShown');
    }
  };

  // Check if splash has already been shown in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        console.log('SplashContext: Keeping splash visible (home page, first visit)');
      }
      // If it's the home page and no splash shown yet, keep splash visible
    }
  }, []); // Remove hideSplash dependency to avoid infinite loop

  return (
    <SplashContext.Provider value={{ isSplashVisible, hideSplash, resetSplash }}>
      {children}
    </SplashContext.Provider>
  );
};
