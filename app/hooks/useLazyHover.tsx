'use client';

import { useEffect, useRef, useState } from 'react';

interface UseLazyHoverProps {
  threshold?: number; // Distancia en píxeles para activar el preload
  onApproach?: () => void; // Callback cuando el mouse se acerca
}

export const useLazyHover = ({ 
  threshold = 100, 
  onApproach 
}: UseLazyHoverProps = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [hasApproached, setHasApproached] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasApproached) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      
      // Calcular distancia del mouse al elemento
      const distanceX = Math.max(
        rect.left - e.clientX,
        e.clientX - rect.right,
        0
      );
      const distanceY = Math.max(
        rect.top - e.clientY,
        e.clientY - rect.bottom,
        0
      );
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Si el mouse está cerca, activar preload
      if (distance <= threshold && !hasApproached) {
        setHasApproached(true);
        onApproach?.();
        
        // Remover listener después del primer approach
        document.removeEventListener('mousemove', handleMouseMove);
      }
    };

    // Añadir listener de mouse move global
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [threshold, onApproach, hasApproached]);

  // Handlers estándar de hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return {
    elementRef,
    isHovering,
    hasApproached,
    handleMouseEnter,
    handleMouseLeave
  };
};
