'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

            }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="!text-2xl md:text-2xl uppercase">Ursula Benavidez</h2>
                  <h3 className="text-xl md:text-md uppercase">production designer ~ art director</h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--background)',
                    border: '0.5px solid var(--foreground)',
                    color: 'var(--foreground)',
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm md:text-base" style={{ 
                color: 'var(--foreground)',
                opacity: 0.85
              }}>
                <p>
                  Production designer and art director specializing in crafting visual worlds that resonate with narrative depth and emotional texture. <br/><br/> With a background rooted in both fine arts and cinematic storytelling, her work blends conceptual precision with tactile authenticity.<br/> <br/>Whether designing immersive sets for film, television, or commercial projects, Ursula approaches each frame as a carefully composed canvas, where every detail serves the story. <br/><br/> She thrives on collaboration, pushing the boundaries of visual language while maintaining a grounded, human-centric aesthetic.
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