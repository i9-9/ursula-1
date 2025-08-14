'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import UrsulaLogo from './UrsulaLogo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
        <div className="w-full grid grid-cols-3 items-center px-2.5 md:px-[15px] h-full pt-1 md:pt-2">
          {/* Left: Logo */}
          <div className="justify-self-start">
            <Link 
              href="/" 
              className="text-[13px] flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-foreground hover:text-neutral-500 transition-colors" 
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Home"
            >
              <UrsulaLogo className="h-6 w-auto" title="Ursula" />
            </Link>
          </div>

          {/* Center: Nav items */}
          <div className="flex gap-4 md:gap-6 items-center h-full justify-self-center">
            <Link 
              href="/work" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/work' ? 'text-neutral-500' : 'text-foreground'}`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Selected works"
              aria-current={pathname === '/work' ? 'page' : undefined}
            >
              work
            </Link>

            <Link 
              href="/archive" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/archive' ? 'text-neutral-500' : 'text-foreground'}`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="Archive"
              aria-current={pathname === '/archive' ? 'page' : undefined}
            >
              archive
            </Link>

            <Link 
              href="/about" 
              className={`relative flex items-center h-full font-['Suisse_BP_INTL'] uppercase text-[11px] transition-colors hover:text-neutral-500 ${pathname === '/about' ? 'text-neutral-500' : 'text-foreground'}`}
              style={{ fontFamily: 'Suisse BP INTL', fontWeight: 500, fontStyle: 'normal' }}
              aria-label="About"
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              about
            </Link>

            {/* Contact link removido: la info de contacto vive en /about */}
          </div>

          {/* Right: Theme toggle */}
          <div className="hidden md:flex items-center justify-self-end" role="group" aria-label="Theme toggle">
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
      </nav>

          {/* About modal ya no se usa como navegación; página dedicada en /about */}
    </>
  );
};

export default Navbar;