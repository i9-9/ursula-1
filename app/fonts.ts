import localFont from 'next/font/local';

// Suisse BP INTL - Local fonts only
export const suisseBpIntl = localFont({
  src: [
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
    },
    {
      path: '../public/fonts/Suisse BP Intl Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-suisse',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif']
});

// For compatibility with existing code
export const neueHaasGroteskDisplay = {
  className: suisseBpIntl.className,
  variable: suisseBpIntl.variable,
  fontFamily: 'var(--font-suisse)',
};

export const neueHaasGroteskText = {
  className: suisseBpIntl.className,
  variable: suisseBpIntl.variable,
  fontFamily: 'var(--font-suisse)',
}; 