import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

// 🎯 OPTIMIZED: Only load essential Suisse BP INTL weights
export const suisseBpIntlOptimized = localFont({
  src: [
    // Only Regular (400) and Medium (500) - most used weights
    {
      path: '../public/fonts/Suisse BP Intl Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Suisse BP Intl Regular Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Suisse BP Intl Medium.woff2',
      weight: '500',
      style: 'normal',
    }
  ],
  variable: '--font-suisse',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif']
});

// 🎯 OPTIMIZED: Inter as system fallback
export const interOptimized = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  // Only load commonly used weights
  weight: ['400', '500'],
  fallback: ['system-ui', 'arial', 'sans-serif']
});

// 🎯 OPTIMIZED: Neue Haas Grotesk configuration for Adobe Fonts
export const neueHaasGroteskConfig = {
  // CSS classes for Adobe Fonts
  display: {
    className: 'neue-haas-grotesk-display',
    variable: '--font-display',
    fontFamily: 'neue-haas-grotesk-display',
    fallback: ['system-ui', 'arial', 'sans-serif']
  },
  text: {
    className: 'neue-haas-grotesk-text', 
    variable: '--font-text',
    fontFamily: 'neue-haas-grotesk-text',
    fallback: ['system-ui', 'arial', 'sans-serif']
  }
};

// 🎯 FONT LOADING STRATEGY
export const fontLoadingStrategy = {
  // Critical fonts to preload
  critical: [
    '/fonts/Suisse BP Intl Regular.woff2',
    '/fonts/Suisse BP Intl Medium.woff2'
  ],
  // Non-critical fonts to load asynchronously
  async: [
    '/fonts/Suisse BP Intl Regular Italic.woff2'
  ]
}; 