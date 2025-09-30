// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useHydrationSafe } from "./HydrationSafe";
import UrsulaLogo from "./UrsulaLogo";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const pathname = usePathname();
  const isClient = useHydrationSafe();

  const NavContent = () => (
    <>
      {/* Desktop Grid System - 12 columnas exacto como Archive */}
      <div className="hidden md:block w-full px-8">
        <div className="grid grid-cols-12 gap-2">
          {/* Columnas 1-4: Área del logo */}
          <div className="col-span-4 flex items-baseline justify-start">
            <Link
              href="/"
              className="text-foreground hover:opacity-60 transition-opacity duration-200 flex items-baseline"
              style={{ fontSize: '13px', fontFamily: 'Suisse BP INTL' }}
              aria-label="Home"
            >
              <UrsulaLogo className="h-4 w-auto" title="Ursula" />
            </Link>
          </div>

          {/* Columnas 5-8: Área de navegación - elementos más cercanos */}
          <div className="col-span-4 flex items-baseline justify-center space-x-6">
            <Link
              href="/work"
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/work" ? "opacity-60" : "opacity-100"
              }`}
              style={{ fontFamily: 'Suisse BP INTL' }}
              aria-label="Selected works"
              aria-current={pathname === "/work" ? "page" : undefined}
            >
              WORK
            </Link>

            <Link
              href="/archive"
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/archive" ? "opacity-60" : "opacity-100"
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
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/about" ? "opacity-60" : "opacity-100"
              }`}
              style={{ fontFamily: 'Suisse BP INTL' }}
              aria-label="About"
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              ABOUT
            </Link>
          </div>

          {/* Columnas 9-12: Área del toggle */}
          <div className="col-span-4 flex items-baseline justify-end">
            <div className="flex items-baseline space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Single Column con elementos más cercanos */}
      <div className="block md:hidden px-4">
        <div className="flex items-baseline justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-foreground hover:opacity-60 transition-opacity duration-200 flex items-baseline"
            style={{ fontSize: '12px', fontFamily: 'Suisse BP INTL' }}
            aria-label="Home"
          >
            <UrsulaLogo className="h-3.5 w-auto" title="Ursula" />
          </Link>

          {/* Nav items con menos espacio */}
          <div className="flex items-baseline space-x-2">
            <Link
              href="/work"
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/work" ? "opacity-60" : "opacity-100"
              }`}
              style={{ fontFamily: 'Suisse BP INTL' }}
              aria-label="Selected works"
              aria-current={pathname === "/work" ? "page" : undefined}
            >
              WORK
            </Link>

            <Link
              href="/archive"
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/archive" ? "opacity-60" : "opacity-100"
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
              className={`text-foreground text-[13px] uppercase tracking-wide font-regular hover:opacity-60 transition-opacity duration-200 flex items-baseline ${
                pathname === "/about" ? "opacity-60" : "opacity-100"
              }`}
              style={{ fontFamily: 'Suisse BP INTL' }}
              aria-label="About"
              aria-current={pathname === "/about" ? "page" : undefined}
            >
              ABOUT
            </Link>

            <div className="ml-3 flex items-baseline space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Don't render motion component until client-side hydration is complete
  if (!isClient) {
    return (
      <nav
        data-navbar
        className="w-full py-6 transition-all duration-300 bg-background relative z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <NavContent />
      </nav>
    );
  }

  return (
    <motion.nav
      data-navbar
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 1 }}
      transition={{ duration: 0 }}
      className="w-full py-6 transition-all duration-300 bg-background relative z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <NavContent />
    </motion.nav>
  );
};

export default Navbar;