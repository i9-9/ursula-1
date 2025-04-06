'use client';

import { useState, useEffect } from 'react';

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calcular el progreso del scroll (0-100)
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrolled / windowHeight) * 100));
      
      setScrollProgress(progress);
      
      // Mostrar el indicador solo después de un poco de scroll
      setIsVisible(scrolled > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Comprobar el estado inicial
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-0.5 bg-foreground/10 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="h-full bg-foreground/60 origin-left transition-transform duration-100"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  );
};

export default ScrollIndicator; 