import type { Metadata } from 'next';
import "./globals.css";
import { suisseBpIntl } from './fonts';
import PreloadScript from './components/PreloadScript';
import NavbarWithLoader from './components/NavbarWithLoader';
import ClientWrapper from './components/ClientWrapper';
import ScrollbarStyles from './components/ScrollbarStyles';
import ThemeProvider from './components/ThemeProvider';
import ChunkErrorBoundary from './components/ChunkErrorBoundary';
import { SplashProvider } from './contexts/SplashContext';
import Copyright from './components/Copyright';
import SplashScreen from './components/SplashScreen';


export const metadata: Metadata = {
  title: 'Ursula Benavidez - Portfolio',
  description: 'Portfolio profesional de Ursula Benavidez, Art Director y Set Designer.',
  keywords: ['portfolio', 'art director', 'set designer', 'creative', 'design'],
  authors: [{ name: 'Ursula Benavidez' }],
  creator: 'Ursula Benavidez',
  publisher: 'Ursula Benavidez',
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
    title: 'Ursula Benavidez - Portfolio',
    description: 'Portfolio profesional de Ursula Benavidez, Art Director y Set Designer.',
    url: 'https://ursulabenavidez.com',
    siteName: 'Ursula Benavidez Portfolio',
    images: [
      {
        url: '/seo/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ursula Benavidez Portfolio',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ursula Benavidez - Portfolio',
    description: 'Portfolio profesional de Ursula Benavidez, Art Director y Set Designer.',
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
                <div className="min-h-screen bg-background text-foreground">
                  <SplashScreen />
                  <NavbarWithLoader />
                  {children}
                  {/* Copyright - Aparece en todas las páginas excepto durante el loader */}
                  <Copyright />
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