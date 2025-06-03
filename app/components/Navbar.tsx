'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AboutModal from './AboutModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If no theme is saved, use system preference
    if (!savedTheme) {
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      localStorage.setItem('theme', systemTheme);
    } else {
      // If theme is saved, use it but ensure it matches system preference
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
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
      const sections = ['hero', 'selected-works', 'archive', 'about'];
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
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[var(--navbar-height)] flex items-center ${
          scrolled ? 'bg-background/90 backdrop-blur-md' : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full grid grid-cols-12 items-center px-2.5 md:px-[15px] h-full ">
          <Link 
            href="/" 
            className="text-[13px] col-span-6 md:col-span-6 flex items-center h-full font-['Suisse_BP_INTL'] uppercase" 
            style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
            aria-label="Home"
          >
            URSULA BENAVIDEZ
          </Link>
          
          <div className="flex gap-4 md:gap-6 col-span-6 md:col-span-3 items-center h-full justify-end md:justify-start">
            <Link 
              href="#selected-works" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px]`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Selected works section"
              aria-current={activeSection === 'selected-works' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                // First show the section
                window.dispatchEvent(new CustomEvent('show-section', { detail: 'works' }));
                
                // Wait for the section to be mounted and then scroll
                setTimeout(() => {
                  const worksSection = document.getElementById('selected-works');
                  if (worksSection) {
                    const yOffset = -100;
                    const y = worksSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              work
              {activeSection === 'selected-works' && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground" aria-hidden="true"></span>
              )}
            </Link>

            <Link 
              href="#archive" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px]`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Archive section"
              aria-current={activeSection === 'archive' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                // First show the section
                window.dispatchEvent(new CustomEvent('show-section', { detail: 'archive' }));
                
                // Wait for the section to be mounted and then scroll
                setTimeout(() => {
                  const archiveSection = document.getElementById('archive');
                  if (archiveSection) {
                    const yOffset = -100;
                    const y = archiveSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    
                    // Wait for scroll to start before opening accordion
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-archive'));
                    }, 300);
                  }
                }, 100);
              }}
            >
              archive
              {activeSection === 'archive' && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground" aria-hidden="true"></span>
              )}
            </Link>

            <button
              onClick={() => setIsAboutModalOpen(true)}
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px] cursor-pointer`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="About section"
              aria-current={activeSection === 'contact' ? 'page' : undefined}
            >
              about
              {activeSection === 'contact' && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground" aria-hidden="true"></span>
              )}
            </button>

            <Link 
              href="#contact" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px]`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Contact section"
              aria-current={activeSection === 'contact' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                // First show the section
                window.dispatchEvent(new CustomEvent('show-section', { detail: 'contact' }));
                
                // Wait for the section to be mounted and then scroll
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const yOffset = -100;
                    const y = contactSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              contact
              {activeSection === 'contact' && (
                <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-foreground" aria-hidden="true"></span>
              )}
            </Link>
          </div>

          {/* Theme Toggle - Alineado por col-span */}
          <div className="hidden md:flex col-span-1 items-center" role="group" aria-label="Theme toggle">
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-5 bg-white' : 'translate-x-1 bg-black'
                }`}
              />
            </button>
          </div>

          <div 
            className="col-span-2 text-[11px] text-foreground hidden md:flex items-center h-full uppercase justify-end"
            aria-label="Professional role"
          >
            production designer ~ art director
          </div>
        </div>
      </nav>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;