import type { Metadata } from "next";
import { suisseBpIntlOptimized, interOptimized, neueHaasGroteskConfig } from "./fonts-optimized";
import "./globals.css";
import "./animations.css";
import "./spacing.css";
import Navbar from './components/Navbar';
import ScrollbarStyles from './components/ScrollbarStyles';
import PasswordProtection from './components/PasswordProtection';

export const metadata: Metadata = {
  metadataBase: new URL('https://ursulabenavidez.com'),
  title: "Ursula Benavidez - Art Direction",
  description: "Ursula Benavidez - Art Direction",
  icons: {
    icon: [
      { url: '/favicon/favicon16x16.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon/favicon32x32.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon/favicon48x48.ico', sizes: '48x48', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/seo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: "Ursula Benavidez - Art Direction",
    description: "Ursula Benavidez - Art Direction",
    images: [
      {
        url: '/seo/og-image.jpg',
        width: 1200,
        height: 1200,
        alt: 'Ursula Benavidez - Art Direction'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ursula Benavidez - Art Direction",
    description: "Ursula Benavidez - Art Direction",
    images: [
      {
        url: '/seo/twitter-image.jpg',
        width: 1200,
        height: 1200,
        alt: 'Ursula Benavidez - Art Direction'
      }
    ]
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`scroll-smooth ${suisseBpIntlOptimized.variable} ${interOptimized.variable}`}>
      <head>
        {/* 🎯 OPTIMIZED: Font preloading for critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/Suisse BP Intl Regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin=""
        />
        <link 
          rel="preload" 
          href="/fonts/Suisse BP Intl Medium.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin=""
        />
        
        {/* 🎯 OPTIMIZED: Adobe Fonts with better loading strategy */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        
        {/* 🎯 PERFORMANCE: Load Adobe Fonts asynchronously */}
        <link 
          rel="stylesheet" 
          href="https://use.typekit.net/dfc2nqo.css"
          media="print"
          onLoad="this.media='all'; this.onload=null;"
        />
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/dfc2nqo.css" />
        </noscript>
        
        {/* Standard meta tags */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon16x16.ico" sizes="16x16" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon32x32.ico" sizes="32x32" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon48x48.ico" sizes="48x48" />
        <link rel="apple-touch-icon" sizes="180x180" href="/seo/apple-touch-icon.png" />
        
        {/* 🎯 CRITICAL CSS: Inline critical typography */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical font fallback */
            body {
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            /* Prevent FOIT (Flash of Invisible Text) */
            .neue-haas-grotesk-display,
            .neue-haas-grotesk-text {
              font-display: swap;
            }
            
            /* Loading state for fonts */
            .fonts-loading * {
              font-family: system-ui, -apple-system, sans-serif !important;
            }
            
            /* Critical font classes */
            .font-critical {
              font-family: var(--font-suisse), system-ui, sans-serif;
              font-display: optional;
            }
          `
        }} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ursula Benavidez",
              "jobTitle": "Art Director & Set Designer",
              "url": "https://ursulabenavidez.com",
              "sameAs": [
                "https://instagram.com/ursulabenavidez"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              }
            })
          }}
        />
      </head>
      <body className={`
        ${neueHaasGroteskConfig.display.className} 
        ${neueHaasGroteskConfig.text.className}
        font-sans antialiased
        font-loading
      `}>
        <PasswordProtection>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            {children}
          </div>
        </PasswordProtection>
        <ScrollbarStyles />
        
        {/* 🎯 PERFORMANCE: Load remaining fonts after critical path */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Load non-critical fonts after page load
            window.addEventListener('load', function() {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = '/fonts/Suisse BP Intl Regular Italic.woff2';
              link.as = 'font';
              link.type = 'font/woff2';
              link.crossOrigin = '';
              document.head.appendChild(link);
            });
            
            // Remove loading class when fonts are ready
            if ('fonts' in document) {
              document.fonts.ready.then(function() {
                document.body.classList.remove('fonts-loading');
              });
            }
          `
        }} />
      </body>
    </html>
  );
} 