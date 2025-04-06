'use client';

import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const scrollHandler = () => {
      const revealElements = document.querySelectorAll('.reveal');
      
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };
    
    // Ejecutar una vez al inicio para elementos visibles en la carga
    setTimeout(scrollHandler, 300);
    
    // Agregar evento de scroll
    window.addEventListener('scroll', scrollHandler);
    
    // Limpiar listener
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);
}

export function useTouchFeedback() {
  useEffect(() => {
    const touchableElements = document.querySelectorAll('.touchable');
    
    const handleTouchStart = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(15); // Vibración sutil de 15ms
      }
    };
    
    touchableElements.forEach(element => {
      element.addEventListener('touchstart', handleTouchStart);
    });
    
    return () => {
      touchableElements.forEach(element => {
        element.removeEventListener('touchstart', handleTouchStart);
      });
    };
  }, []);
}

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