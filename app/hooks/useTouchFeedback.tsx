'use client';

import { useEffect } from 'react';

// Hook para aplicar respuesta táctil a elementos interactivos
const useTouchFeedback = (selector = 'a, button, [role="button"]') => {
  useEffect(() => {
    // Evitar ejecución en servidor
    if (typeof window === 'undefined') return;
    
    // Detectar dispositivos táctiles para adaptar comportamiento
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Si no es un dispositivo táctil, no aplicamos feedback
    if (!isTouchDevice) return;
    
    const handleTouchStart = (e: Event) => {
      const element = e.target as HTMLElement;
      const interactiveElement = element.closest(selector);
      
      if (interactiveElement) {
        interactiveElement.classList.add('touch-active');
      }
    };
    
    const handleTouchEnd = (e: Event) => {
      const element = e.target as HTMLElement;
      const interactiveElement = element.closest(selector);
      
      if (interactiveElement) {
        // Pequeño delay para que se aprecie la animación
        setTimeout(() => {
          interactiveElement.classList.remove('touch-active');
        }, 150);
      }
    };
    
    // Aplicar listeners al documento para capturar todos los eventos
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
    
    // Limpieza
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [selector]);
};

export default useTouchFeedback; 