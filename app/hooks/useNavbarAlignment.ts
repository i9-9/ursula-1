// hooks/useNavbarAlignment.ts
import { useEffect, useState, useCallback, useRef } from 'react';

interface NavbarMeasurements {
  offset: number;
  width: number;
  isReady: boolean;
}

export const useNavbarAlignment = (): NavbarMeasurements => {
  const [measurements, setMeasurements] = useState<NavbarMeasurements>({
    offset: 0,
    width: 0,
    isReady: false,
  });
  
  const lastOffset = useRef(0);
  const lastWidth = useRef(0);

  const calculateAlignment = useCallback(() => {
    const archiveElement = document.querySelector('[data-nav-item="archive"]') as HTMLElement;
    const container = document.querySelector('.layout-container') as HTMLElement;
    
    if (archiveElement && container) {
      const archiveRect = archiveElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const offset = archiveRect.left - containerRect.left;
      const width = archiveRect.width;
      
      // Solo actualizar si los valores han cambiado significativamente (más de 1px)
      if (Math.abs(offset - lastOffset.current) > 1 || Math.abs(width - lastWidth.current) > 1) {
        lastOffset.current = offset;
        lastWidth.current = width;
        
        setMeasurements({
          offset,
          width,
          isReady: true,
        });
        
        // Actualizar CSS custom property globalmente
        document.documentElement.style.setProperty('--navbar-archive-offset', `${offset}px`);
        document.documentElement.style.setProperty('--navbar-archive-width', `${width}px`);
      }
    }
  }, []);

  useEffect(() => {
    // Calcular después del render inicial
    const timer = setTimeout(calculateAlignment, 100);
    
    // Recalcular en resize con debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculateAlignment, 100);
    };
    
    window.addEventListener('resize', handleResize);

    // Recalcular cuando cambie el font loading
    document.fonts.ready.then(() => {
      setTimeout(calculateAlignment, 200);
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateAlignment]);

  return measurements;
};

// Versión simplificada si solo necesitas el offset
export const useArchiveOffset = (): number => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const getOffset = () => {
      const archiveElement = document.querySelector('[data-nav-item="archive"]') as HTMLElement;
      const container = document.querySelector('.layout-container') as HTMLElement;
      
      if (archiveElement && container) {
        const archiveRect = archiveElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const newOffset = archiveRect.left - containerRect.left;
        
        setOffset(newOffset);
        document.documentElement.style.setProperty('--navbar-archive-offset', `${newOffset}px`);
      }
    };

    const timer = setTimeout(getOffset, 100);
    window.addEventListener('resize', getOffset);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', getOffset);
    };
  }, []);

  return offset;
};