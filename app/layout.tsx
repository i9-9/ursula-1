import type { Metadata } from "next";
import { neueHaasGroteskDisplay, neueHaasGroteskText } from "./fonts";
import "./globals.css";
import "./animations.css";
import "./spacing.css";
import Navbar from './components/Navbar';
import ScrollbarStyles from './components/ScrollbarStyles';

export const metadata: Metadata = {
  title: "Ursula Benavidez - Art Direction",
  description: "Ursula Benavidez - Art Direction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/dfc2nqo.css" />
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
