'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Inicializar tema solo después de hidratación
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      
      // Aplicar clase CSS de forma segura
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Guardar tema si no existía
      if (!savedTheme) {
        localStorage.setItem('theme', initialTheme);
      }
    } catch (error) {
      console.warn('Error initializing theme:', error);
      setTheme('light');
    }
  }, [isHydrated]);

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
