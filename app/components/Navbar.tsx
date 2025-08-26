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
          className="w-full py-6 transition-all duration-300 bg-background relative z-50"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Desktop Grid System - 12 columnas exacto como Archive */}
          <div className="hidden md:block w-full px-8">
            <div className="grid grid-cols-12 gap-2">
              {/* Columnas 1-4: Área del logo */}
              <div className="col-span-4 flex items-baseline justify-start">
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
              <div className="col-span-4 flex items-baseline justify-center">
                <div className="flex items-baseline space-x-3">
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
              <div className="col-span-4 flex items-baseline justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Single Column */}
          <div className="block md:hidden px-4">
            <div className="flex items-baseline justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="text-foreground hover:opacity-60 transition-opacity duration-200"
                style={{ fontSize: '12px', fontFamily: 'Suisse BP INTL' }}
                aria-label="Home"
              >
                <UrsulaLogo className="h-4 w-auto" title="Ursula" />
              </Link>

              {/* Nav items */}
              <div className="flex items-baseline space-x-3">
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

                <div className="ml-4">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;