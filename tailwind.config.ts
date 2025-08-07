import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        base: '11px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        'neue-montreal': ['var(--font-neue-montreal)'],
        'suisse-bp-intl': ['var(--font-suisse)', 'system-ui', 'sans-serif'],
      },
    },
    screens: {
      sm: '480px',
      md: '1024px',
      lg: '1280px',
      xl: '1536px',
    },
  },
  plugins: [],
}

export default config 