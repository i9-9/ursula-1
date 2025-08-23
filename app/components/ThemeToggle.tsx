'use client';

import { useThemeContext } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme, isHydrated } = useThemeContext();

  // No renderizar hasta que esté hidratado
  if (!isHydrated) {
    return (
      <div className="relative inline-flex h-3 w-6 md:h-4 md:w-7 items-center rounded-full bg-gray-200 animate-pulse">
        <span className="inline-block h-2 w-2 md:h-2.5 md:w-2.5 transform rounded-full bg-gray-400 translate-x-1" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-3 w-6 md:h-4 md:w-7 items-center rounded-full transition-colors cursor-pointer ${
        theme === 'dark' ? 'bg-white/10' : 'bg-black/10'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`inline-block h-2 w-2 md:h-2.5 md:w-2.5 transform rounded-full transition-transform ${
          theme === 'dark' ? 'translate-x-3 md:translate-x-4 bg-white' : 'translate-x-1 bg-black'
        }`}
      />
    </button>
  );
}
