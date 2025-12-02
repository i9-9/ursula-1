'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HydrationSafe from './HydrationSafe';
import Navbar from './Navbar';
import { useSplash } from '../contexts/SplashContext';

export default function NavbarWithLoader() {
  const { isSplashVisible, isInitialized } = useSplash();
  const [shouldShowNavbar, setShouldShowNavbar] = useState(false);

  // Mostrar navbar después de la inicialización
  useEffect(() => {
    // Wait for splash context to initialize
    if (!isInitialized) {
      return;
    }

    if (!isSplashVisible) {
      // Si splash no está visible, mostrar navbar inmediatamente
      setShouldShowNavbar(true);
    } else {
      // Si splash está visible, mostrar navbar después de 1.5 segundos
      const timer = setTimeout(() => {
        setShouldShowNavbar(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSplashVisible, isInitialized]);
  
  return (
    <AnimatePresence>
      {shouldShowNavbar && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: 'easeOut',
            delay: 0.1 // Pequeño delay para suavizar la entrada
          }}
        >
          <HydrationSafe fallback={null}>
            <Navbar />
          </HydrationSafe>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
