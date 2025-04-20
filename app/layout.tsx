import type { Metadata } from "next";
import { neueHaasGroteskDisplay, neueHaasGroteskText } from "./fonts";
import "./globals.css";
import "./animations.css";
import "./spacing.css";
import Navbar from './components/Navbar';
import ScrollbarStyles from './components/ScrollbarStyles';

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
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/dfc2nqo.css" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon16x16.ico" sizes="16x16" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon32x32.ico" sizes="32x32" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon48x48.ico" sizes="48x48" />
        <link rel="apple-touch-icon" sizes="180x180" href="/seo/apple-touch-icon.png" />
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
      <body className={`${neueHaasGroteskDisplay.variable} ${neueHaasGroteskText.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          {children}
        </div>
        <ScrollbarStyles />
      </body>
    </html>
  );
}
