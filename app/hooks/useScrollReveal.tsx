'use client';

import { useEffect } from 'react';

// Hook para animar elementos cuando aparecen en el viewport
export const useScrollReveal = () => {
  useEffect(() => {
    // Evitar ejecución en servidor
    if (typeof window === 'undefined') return;
    
    const animateOnScroll = () => {
      // Seleccionar todos los elementos animables que aún no han sido animados
      const reveals = document.querySelectorAll('.section-title:not(.revealed)');
      
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100; // Px antes de que el elemento sea visible
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };
    
    // Ejecutar una vez al inicio
    setTimeout(animateOnScroll, 300);
    
    // Ejecutar en cada scroll
    window.addEventListener('scroll', animateOnScroll);
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);
};

// Reexportar useTouchFeedback para facilitar su uso
export { default as useTouchFeedback } from './useTouchFeedback';

export function useSnapScroll() {
  useEffect(() => {
    let isScrolling = false;
    let sections: HTMLElement[] = [];
    
    // Obtenemos las secciones principales
    sections = Array.from(document.querySelectorAll('section[id]'));
    
    const scrollToSection = (targetSection: HTMLElement) => {
      if (isScrolling) return;
      
      isScrolling = true;
      const targetOffset = targetSection.offsetTop;
      
      window.scrollTo({
        top: targetOffset - 80, // Ajuste para navbar
        behavior: 'smooth'
      });
      
      // Resetear flag después de la animación
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Buscar la sección activa
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Si estamos en el "umbral" de una sección
        if (
          scrollPosition >= sectionTop - windowHeight / 3 &&
          scrollPosition < sectionTop + sectionHeight - windowHeight / 3
        ) {
          // Si no estamos "anclados" a esta sección, scrolleamos a ella
          const threshold = 100; // umbral de tolerancia
          if (Math.abs(scrollPosition - (sectionTop - 80)) > threshold) {
            scrollToSection(section);
          }
          break;
        }
      }
    };
    
    // Deshabilitar temporalmente en móviles
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
} 