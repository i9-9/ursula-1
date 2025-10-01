'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

interface UseOptimizedMediaProps {
  src?: string;
  videoUrl?: string;
  preload?: boolean;
  isPreloaded?: boolean; // Nuevo: indica si el asset ya fue precargado masivamente
}

interface UseOptimizedMediaReturn {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  optimizedSrc: string | undefined;
  shouldPreload: boolean;
  handleLoad: () => void;
  handleError: () => void;
}

export const useOptimizedMedia = ({
  src,
  videoUrl,
  preload = false,
  isPreloaded = false
}: UseOptimizedMediaProps): UseOptimizedMediaReturn => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Determinar la fuente optimizada
  const optimizedSrc = useMemo(() => {
    if (src) return src;
    if (videoUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i)) return videoUrl;
    return undefined;
  }, [src, videoUrl]);

  // Determinar si debe precargar
  // Si ya fue precargado masivamente, siempre usar eager loading
  const shouldPreload = useMemo(() => {
    return (preload || isPreloaded) && !!optimizedSrc;
  }, [preload, isPreloaded, optimizedSrc]);

  // Handlers para eventos de carga
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsLoaded(false);
  }, []);

  // Reset del estado cuando cambia la fuente
  useEffect(() => {
    setIsLoaded(false);
  }, [optimizedSrc]);

  // Si ya fue precargado masivamente, marcar como cargado
  useEffect(() => {
    if (isPreloaded) {
      setIsLoaded(true);
    }
  }, [isPreloaded]);

  return {
    isLoaded,
    setIsLoaded,
    optimizedSrc,
    shouldPreload,
    handleLoad,
    handleError
  };
};