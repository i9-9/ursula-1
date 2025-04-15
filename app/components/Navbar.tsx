'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    if (currentTheme === newTheme) return;

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

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
      <div className="w-full grid grid-cols-12 items-center px-2.5 md:px-[15px] h-full">
        <Link href="/" className="text-[11px] col-span-6 md:col-span-6 flex items-center h-full font-neue-haas-grotesk-display uppercase" style={{ fontFamily: 'neue-haas-grotesk-display', fontWeight: 500, fontStyle: 'normal' }}>
          URSULA BENAVIDEZ
        </Link>
        
        <div className="flex gap-4 md:gap-6 text-[11px] col-span-6 md:col-start-7 md:col-span-3 items-center h-full justify-end md:justify-start">
          <Link 
            href="#selected-works" 
            className={`relative flex items-center h-full font-neue-haas-grotesk-display uppercase`}
            style={{ fontFamily: 'neue-haas-grotesk-display', fontWeight: 500, fontStyle: 'normal' }}
          >
            work
            {activeSection === 'selected-works' && (
              <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
            )}
          </Link>
          <Link 
            href="#archive" 
            className={`relative flex items-center h-full font-neue-haas-grotesk-display uppercase`}
            style={{ fontFamily: 'neue-haas-grotesk-display', fontWeight: 500, fontStyle: 'normal' }}
          >
            archive
            {activeSection === 'archive' && (
              <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
            )}
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="#contact" 
              className={`relative flex items-center h-full font-neue-haas-grotesk-display uppercase`}
              style={{ fontFamily: 'neue-haas-grotesk-display', fontWeight: 500, fontStyle: 'normal' }}
            >
              contact
              {activeSection === 'contact' && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground"></span>
              )}
            </Link>
            
            {/* Theme Toggle */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => toggleTheme('light')}
                className={`w-3 h-3 rounded-full bg-[#f5f5f5] border border-[#0a0a0a] transition-opacity duration-200 ${
                  theme === 'dark' ? 'opacity-50' : 'opacity-100'
                }`}
                aria-label="Light mode"
              />
              <button
                onClick={() => toggleTheme('dark')}
                className={`w-3 h-3 rounded-full bg-[#0a0a0a] border ${theme === 'dark' ? 'border-[#f5f5f5]' : 'border-transparent'} transition-opacity duration-200 ${
                  theme === 'light' ? 'opacity-50' : 'opacity-100'
                }`}
                aria-label="Dark mode"
              />
            </div>
          </div>
        </div>

        <div className="col-start-10 col-span-3 text-[11px] text-foreground hidden md:flex items-center h-full uppercase justify-end">
          art direction & set design
        </div>
      </div>
    </nav>
  );
};

export default Navbar;