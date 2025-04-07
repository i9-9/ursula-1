'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Detectar sección activa
      const sections = ['hero', 'selected-works', 'archive', 'contact'];
      let currentSection = '';
      
      // Obtenemos la altura de la ventana para calcular mejor la visibilidad
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight * 0.3; // 30% desde la parte superior
      
      // Comprobar si estamos cerca del final de la página para activar la sección de contacto
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      
      if (nearBottom) {
        // Si estamos cerca del final, activamos la sección de contacto
        currentSection = 'contact';
      } else {
        // Detección normal de sección en el resto de casos
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            
            // Si hemos pasado el inicio de la sección
            if (scrollPosition >= elementTop) {
              currentSection = section;
            }
          }
        }
      }
      
      setActiveSection(currentSection === 'hero' ? '' : currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Disparar una vez al cargar para establecer la sección inicial
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[var(--navbar-height)] flex items-center ${
        scrolled ? 'bg-background/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full grid grid-cols-12 items-center px-[30px] h-full">
        <Link href="/" className="text-p tracking-wider col-span-6 flex items-center h-full">
          URSULA BENAVIDEZ
        </Link>
        
        <div className="flex gap-6 md:gap-8 text-p col-start-7 col-span-6 items-center h-full">
          <Link 
            href="#selected-works" 
            className={`transition-all tracking-wide relative flex items-center h-full ${
              activeSection === 'selected-works' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            WORK
            {activeSection === 'selected-works' && (
              <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
            )}
          </Link>
          <Link 
            href="#archive" 
            className={`transition-all tracking-wide relative flex items-center h-full ${
              activeSection === 'archive' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            ARCHIVE
            {activeSection === 'archive' && (
              <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
            )}
          </Link>
          <Link 
            href="#contact" 
            className={`transition-all tracking-wide relative flex items-center h-full ${
              activeSection === 'contact' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            CONTACT
            {activeSection === 'contact' && (
              <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 