'use client';

import { useState, useEffect, useCallback } from 'react';

export const useSafeScroll = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Scroll handler seguro
  const handleScroll = useCallback(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    setScrolled(window.scrollY > 50);
  }, [isHydrated]);

  // Agregar event listener solo después de hidratación
  useEffect(() => {
    if (!isHydrated) return;

    // Ejecutar una vez para establecer el estado inicial
    handleScroll();

    // Agregar event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, isHydrated]);

  return { scrolled, isHydrated };
};
