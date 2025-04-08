import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        'neue-haas-grotesk-text': ['neue-haas-grotesk-text', 'sans-serif'],
        'neue-haas-grotesk-display': ['neue-haas-grotesk-display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config 