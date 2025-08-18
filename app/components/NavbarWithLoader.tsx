'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';

export default function NavbarWithLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simular tiempo de carga mínimo para el navbar
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Navbar isLoaded={isLoaded} />
  );
}
