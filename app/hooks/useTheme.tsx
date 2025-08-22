'use client';

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Inicializar tema solo después de la hidratación
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      
      // Aplicar clase CSS
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

  return {
    theme,
    toggleTheme,
    isHydrated
  };
};
