'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useHydration, useSafeBrowserEffect } from '../hooks/useHydration';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Start with a consistent default theme to avoid hydration mismatch
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isHydrated = useHydration();

  // Initialize theme only after hydration
  useSafeBrowserEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        
        // Apply CSS class safely after hydration
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Save theme if it didn't exist
        if (!savedTheme) {
          localStorage.setItem('theme', initialTheme);
        }
      } catch (error) {
        console.warn('Error initializing theme:', error);
        // Keep default theme to avoid hydration mismatch
      }
    };

    // Small delay to ensure hydration is complete
    const timer = setTimeout(initializeTheme, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (!isHydrated) return;

    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Error saving theme:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isHydrated
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
