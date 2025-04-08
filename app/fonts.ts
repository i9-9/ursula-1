import { Inter, Space_Grotesk } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

// Adobe Fonts (Typekit) configuration
export const neueHaasGroteskDisplay = {
  className: 'neue-haas-grotesk-display',
  variable: '--font-display',
  fontFamily: 'neue-haas-grotesk-display',
  weights: {
    light: 300,
    lightItalic: 300,
    roman: 400,
    medium: 500,
    bold: 700,
    boldItalic: 700
  }
};

export const neueHaasGroteskText = {
  className: 'neue-haas-grotesk-text',
  variable: '--font-text',
  fontFamily: 'neue-haas-grotesk-text',
  weights: {
    light: 300,
    lightItalic: 300,
    roman: 400,
    medium: 500,
    bold: 700,
    boldItalic: 700
  }
}; 