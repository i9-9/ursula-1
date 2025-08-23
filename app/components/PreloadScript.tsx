'use client';

import { useSafeBrowserEffect } from '../hooks/useHydration';
import { initializeChunkErrorHandling } from '../utils/chunkErrorHandler';

const PreloadScript = () => {
  useSafeBrowserEffect(() => {
    // Initialize chunk error handling
    initializeChunkErrorHandling();
    
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preload', href: '/fonts/Suisse BP Intl Regular.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/Suisse BP Intl Medium.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/Suisse BP Intl Bold.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ];

    preloadLinks.forEach(linkProps => {
      const link = document.createElement('link');
      Object.assign(link, linkProps);
      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      preloadLinks.forEach(linkProps => {
        const existingLink = document.querySelector(`link[href="${linkProps.href}"]`);
        if (existingLink) {
          existingLink.remove();
        }
      });
    };
  }, []);

  return null;
};

export default PreloadScript;
