import type { Metadata } from 'next';
import "./globals.css";
import { suisseBpIntl } from './fonts';
import PreloadScript from './components/PreloadScript';
import NavbarWithLoader from './components/NavbarWithLoader';
import ClientWrapper from './components/ClientWrapper';
import ScrollbarStyles from './components/ScrollbarStyles';
import ThemeProvider from './components/ThemeProvider';
import ScrollManager from './components/ScrollManager';
import ChunkErrorBoundary from './components/ChunkErrorBoundary';
import { SplashProvider } from './contexts/SplashContext';
import SplashScreen from './components/SplashScreen';
import MainContentWrapper from './components/MainContentWrapper';


export const metadata: Metadata = {
  title: 'URSULA BENAVIDEZ',
  description: 'WEB / PRODUCTION DESIGNER, ART DIRECTOR, SET DESIGNER',
  keywords: ['portfolio', 'art director', 'set designer', 'creative', 'design'],
  authors: [{ name: 'Ursula Benavidez' }],
  creator: 'Ursula Benavidez',
  publisher: 'Ursula Benavidez',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover', // iOS safe area support
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ursulabenavidez.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ursula Benavidez',
    description: 'WEB / PRODUCTION DESIGNER, ART DIRECTOR, SET DESIGNER',
    url: 'https://ursulabenavidez.com',
    siteName: 'Ursula Benavidez Web',
    images: [
      {
        url: '/seo/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ursula Benavidez Wev',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ursula Benavidez',
    description: 'WEB / PRODUCTION DESIGNER, ART DIRECTOR, SET DESIGNER',
    images: ['/seo/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={suisseBpIntl.variable}>
      <head>
        <PreloadScript />
        {/* Resource hints para optimizar carga de assets */}
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <link rel="preconnect" href="https://videos.ctfassets.net" />
        <link rel="dns-prefetch" href="https://images.ctfassets.net" />
        <link rel="dns-prefetch" href="https://videos.ctfassets.net" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon16x16.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" href="/favicon/favicon32x32.ico" sizes="32x32" type="image/x-icon" />
        <link rel="icon" href="/favicon/favicon48x48.ico" sizes="48x48" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/seo/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/seo/browserconfig.xml.png" />
      </head>
      <body>
        <ThemeProvider>
          <SplashProvider>
            <ClientWrapper>
              <ChunkErrorBoundary>
                <div className="bg-background text-foreground">
                  <SplashScreen />
                  <MainContentWrapper>
                    <ScrollManager />
                    <NavbarWithLoader />
                    {children}
                  </MainContentWrapper>
                </div>
              </ChunkErrorBoundary>
            </ClientWrapper>
          </SplashProvider>
          <ScrollbarStyles />
        </ThemeProvider>
      </body>
    </html>
  );
}