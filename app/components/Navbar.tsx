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
          className="w-full py-4 transition-all duration-300 bg-background"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Usar el sistema de layout consistente */}
          <div className="layout-container">
            <div className="navbar-grid">
              {/* Left: Logo */}
              <div className="navbar-section navbar-section--logo">
                <Link
                  href="/"
                  className="navbar-nav-item"
                  style={{ fontSize: '13px' }}
                  aria-label="Home"
                >
                  <UrsulaLogo className="h-4 w-auto" title="Ursula" />
                </Link>
              </div>

              {/* Center: Nav items */}
              <div className="navbar-section navbar-section--nav">
                <div className="navbar-nav-grid">
                  <Link
                    href="/work"
                    className={`navbar-nav-item ${
                      pathname === "/work" ? "navbar-nav-item--active" : ""
                    }`}
                    aria-label="Selected works"
                    aria-current={pathname === "/work" ? "page" : undefined}
                  >
                    work
                  </Link>

                  <Link
                    href="/archive"
                    className={`navbar-nav-item ${
                      pathname === "/archive" ? "navbar-nav-item--active" : ""
                    }`}
                    aria-label="Archive"
                    aria-current={pathname === "/archive" ? "page" : undefined}
                    data-nav-item="archive"
                  >
                    archive
                  </Link>

                  <Link
                    href="/about"
                    className={`navbar-nav-item ${
                      pathname === "/about" ? "navbar-nav-item--active" : ""
                    }`}
                    aria-label="About"
                    aria-current={pathname === "/about" ? "page" : undefined}
                  >
                    about
                  </Link>
                </div>
              </div>

              {/* Right: Theme toggle */}
              <div className="navbar-section navbar-section--actions">
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