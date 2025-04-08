import type { Metadata } from "next";
import { neueMontrealMono } from "./fonts";
import "./globals.css";
import "./animations.css";
import "./spacing.css";

export const metadata: Metadata = {
  title: "Ursula Benavidez | Art Director",
  description: "Art Direction and Set Design portfolio of Ursula Benavidez",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${neueMontrealMono.variable} font-neue-montreal antialiased`}>
        {children}
      </body>
    </html>
  );
}
