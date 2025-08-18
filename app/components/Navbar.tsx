'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UrsulaLogo from './UrsulaLogo';

interface NavbarProps {
  isLoaded?: boolean;
}

const Navbar = ({ isLoaded = true }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  // Inicializar tema de localStorage o preferencia del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Si no hay tema guardado usar preferencia del sistema
    if (!savedTheme) {
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      localStorage.setItem('theme', systemTheme);
    } else {
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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.05
          }}
          className={`fixed top-0 left-0 w-full z-50 py-8 transition-all duration-300 h-[var(--navbar-height)] flex items-center justify-center ${
            scrolled ? 'bg-background/90 backdrop-blur-md' : 'bg-transparent'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="w-full flex md:grid md:grid-cols-3 items-baseline justify-between md:justify-start px-2.5 md:px-[15px] min-h-full">
            {/* Left: Logo */}
            <div className="flex items-baseline justify-center md:justify-self-start">
              <Link 
                href="/" 
                className="text-[13px] flex items-center font-['Suisse_BP_INTL'] uppercase text-foreground hover:text-neutral-500 transition-colors" 
                style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal', lineHeight: 1 }}
                aria-label="Home"
              >
                <UrsulaLogo className="h-5 w-auto" title="Ursula" />
              </Link>
            </div>

            {/* Center: Nav items */}
            <div className="flex gap-4 md:gap-6 items-baseline justify-center md:justify-self-center">
              <Link 
                href="/work" 
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/work' ? 'text-neutral-500' : 'text-foreground'}`}
                style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal', lineHeight: 1 }}
                aria-label="Selected works"
                aria-current={pathname === '/work' ? 'page' : undefined}
              >
                work
              </Link>

              <Link 
                href="/archive" 
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/archive' ? 'text-neutral-500' : 'text-foreground'}`}
                style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal', lineHeight: 1 }}
                aria-label="Archive"
                aria-current={pathname === '/archive' ? 'page' : undefined}
              >
                archive
              </Link>

              <Link 
                href="/about" 
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/about' ? 'text-neutral-500' : 'text-foreground'}`}
                style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal', lineHeight: 1 }}
                aria-label="About"
                aria-current={pathname === '/about' ? 'page' : undefined}
              >
                about
              </Link>
            </div>

            {/* Right: Theme toggle */}
            <div className="flex items-baseline justify-center md:justify-self-end" role="group" aria-label="Theme toggle">
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
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;  