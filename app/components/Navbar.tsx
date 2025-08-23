// components/Navbar.tsx
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
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 1 }}
          transition={{ duration: 0 }}
          className="w-full py-2 transition-all duration-300 bg-background"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Desktop Grid System - 12 columnas exacto como Archive */}
          <div className="hidden md:block w-full px-8">
            <div className="grid grid-cols-12 gap-2">
              {/* Columnas 1-4: Área del logo */}
              <div className="col-span-4 flex items-center justify-start">
                <Link
                  href="/"
                  className="text-foreground hover:opacity-60 transition-opacity duration-200"
                  style={{ fontSize: '13px', fontFamily: 'Suisse BP INTL' }}
                  aria-label="Home"
                >
                  <UrsulaLogo className="h-4 w-auto" title="Ursula" />
                </Link>
              </div>

              {/* Columnas 5-8: Área de navegación - centrada con enlaces juntos */}
              <div className="col-span-4 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  {/* WORK */}
                  <Link
                    href="/work"
                    className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 ${
                      pathname === "/work" ? "opacity-100" : "opacity-100"
                    }`}
                    style={{ fontFamily: 'Suisse BP INTL' }}
                    aria-label="Selected works"
                    aria-current={pathname === "/work" ? "page" : undefined}
                  >
                    WORK
                  </Link>

                  {/* ARCHIVE */}
                  <Link
                    href="/archive"
                    className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 ${
                      pathname === "/archive" ? "opacity-100" : "opacity-100"
                    }`}
                    style={{ fontFamily: 'Suisse BP INTL' }}
                    aria-label="Archive"
                    aria-current={pathname === "/archive" ? "page" : undefined}
                    data-nav-item="archive"
                  >
                    ARCHIVE
                  </Link>

                  {/* ABOUT */}
                  <Link
                    href="/about"
                    className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 ${
                      pathname === "/about" ? "opacity-100" : "opacity-100"
                    }`}
                    style={{ fontFamily: 'Suisse BP INTL' }}
                    aria-label="About"
                    aria-current={pathname === "/about" ? "page" : undefined}
                  >
                    ABOUT
                  </Link>
                </div>
              </div>

              {/* Columnas 9-12: Área del toggle */}
              <div className="col-span-4 flex items-center justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Single Column */}
          <div className="block md:hidden px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="text-foreground hover:opacity-60 transition-opacity duration-200"
                style={{ fontSize: '12px', fontFamily: 'Suisse BP INTL' }}
                aria-label="Home"
              >
                <UrsulaLogo className="h-3 w-auto" title="Ursula" />
              </Link>

              {/* Nav items */}
              <div className="flex items-center space-x-1">
                <Link
                  href="/work"
                  className={`text-foreground text-[11px] uppercase tracking-wide font-medium hover:opacity-60 transition-opacity duration-200 ${
                    pathname === "/work" ? "opacity-100" : "opacity-100"
                  }`}
                  style={{ fontFamily: 'Suisse BP INTL' }}
                  aria-label="Selected works"
                  aria-current={pathname === "/work" ? "page" : undefined}
                >
                  WORK
                </Link>

                <Link
                  href="/archive"
                  className={`text-foreground text-[11px] uppercase tracking-wide font-medium hover:opacity-60 transition-opacity duration-200 ${
                    pathname === "/archive" ? "opacity-100" : "opacity-100"
                  }`}
                  style={{ fontFamily: 'Suisse BP INTL' }}
                  aria-label="Archive"
                  aria-current={pathname === "/archive" ? "page" : undefined}
                  data-nav-item="archive"
                >
                  ARCHIVE
                </Link>

                <Link
                  href="/about"
                  className={`text-foreground text-[11px] uppercase tracking-wide font-medium hover:opacity-60 transition-opacity duration-200 ${
                    pathname === "/about" ? "opacity-100" : "opacity-100"
                  }`}
                  style={{ fontFamily: 'Suisse BP INTL' }}
                  aria-label="About"
                  aria-current={pathname === "/about" ? "page" : undefined}
                >
                  ABOUT
                </Link>

                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;