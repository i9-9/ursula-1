"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UrsulaLogo from "./UrsulaLogo";
import ThemeToggle from "./ThemeToggle";


interface NavbarProps {
  isLoaded?: boolean;
}

const Navbar = ({ isLoaded = true }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.nav
          // Desactivamos todas las animaciones estableciendo valores idénticos
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 1 }}
          transition={{ duration: 0 }} // Sin duración = sin animación
          className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 flex items-center justify-center bg-background/90`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="w-full flex md:grid md:grid-cols-3 items-baseline justify-between md:justify-start px-2.5 md:px-[15px] min-h-full">
            {/* Left: Logo */}
            <div className="flex items-baseline justify-center md:justify-self-start">
              <Link
                href="/"
                className="text-[13px] flex items-center font-['Suisse_BP_INTL'] uppercase text-foreground hover:text-neutral-500 transition-colors"
                style={{
                  fontFamily: "Suisse BP INTL",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: 1,
                }}
                aria-label="Home"
              >
                <UrsulaLogo className="h-4 w-auto" title="Ursula" />
              </Link>
            </div>

            {/* Center: Nav items */}
            <div className="flex gap-4 md:gap-6 items-baseline justify-center md:justify-self-center">
              <Link
                href="/work"
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[12px] transition-colors hover:text-neutral-500 ${
                  pathname === "/work" ? "text-neutral-500" : "text-foreground"
                }`}
                style={{
                  fontFamily: "Suisse BP INTL",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: 1,
                }}
                aria-label="Selected works"
                aria-current={pathname === "/work" ? "page" : undefined}
              >
                work
              </Link>

              <Link
                href="/archive"
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[12px] transition-colors hover:text-neutral-500 ${
                  pathname === "/archive"
                    ? "text-neutral-500"
                    : "text-foreground"
                }`}
                style={{
                  fontFamily: "Suisse BP INTL",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: 1,
                }}
                aria-label="Archive"
                aria-current={pathname === "/archive" ? "page" : undefined}
              >
                archive
              </Link>

              <Link
                href="/about"
                className={`relative flex items-center font-['Suisse_BP_INTL'] uppercase text-[12px] transition-colors hover:text-neutral-500 ${
                  pathname === "/about" ? "text-neutral-500" : "text-foreground"
                }`}
                style={{
                  fontFamily: "Suisse BP INTL",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: 1,
                }}
                aria-label="About"
                aria-current={pathname === "/about" ? "page" : undefined}
              >
                about
              </Link>
            </div>

            {/* Right: Theme toggle */}
            <div
              className="flex items-baseline justify-center md:justify-self-end"
              role="group"
              aria-label="Theme toggle"
            >
              <ThemeToggle />
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;