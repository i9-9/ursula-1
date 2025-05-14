'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar el tema actual
  useEffect(() => {
    // Verificar inicialmente
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Escuchar cambios en el tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl z-50 rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: isDarkMode ? 'black' : 'white',
              color: isDarkMode ? 'white' : 'black',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl md:text-2xl font-neue-haas-grotesk-display">About Ursula</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border"
                  style={{ 
                    backgroundColor: isDarkMode ? 'black' : 'white',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: isDarkMode ? 'white' : 'black',
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  <span className="text-2xl leading-none flex items-center justify-center w-full h-full">✕</span>
                </button>
              </div>

              <div className="space-y-4 text-sm md:text-base" style={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
              }}>
                <p>
                  Ursula is a creative studio specializing in music videos, commercials, and live performances. 
                  We blend artistic vision with technical expertise to create compelling visual narratives.
                </p>
                <p>
                  Our work spans across various mediums, from intimate music videos to large-scale commercial productions, 
                  always maintaining a distinctive aesthetic that resonates with contemporary audiences.
                </p>
                <p>
                  Based in [Location], we collaborate with artists and brands worldwide to bring their creative visions to life.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AboutModal; 