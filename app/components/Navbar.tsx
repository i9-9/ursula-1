'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
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
      <div className="w-full flex items-center justify-between px-[30px]">
        <Link href="/" className="text-p tracking-wider">
          URSULA BENAVIDEZ
        </Link>
        
        <div className="flex gap-6 md:gap-8 text-p">
          <Link href="#selected-works" className="hover:opacity-70 transition-opacity tracking-wide">
            WORK
          </Link>
          <Link href="#archive" className="hover:opacity-70 transition-opacity tracking-wide">
            ARCHIVE
          </Link>
          <Link href="#contact" className="hover:opacity-70 transition-opacity tracking-wide">
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 