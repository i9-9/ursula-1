'use client';

import { useSplash } from '../contexts/SplashContext';
import { ReactNode } from 'react';

interface MainContentWrapperProps {
  children: ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isSplashVisible, isInitialized } = useSplash();

  // Wait for initialization to prevent flash of content
  if (!isInitialized) {
    return null;
  }

  // Hide main content only when splash is visible and initialized
  // This ensures content shows immediately on non-home pages
  if (isSplashVisible) {
    return null;
  }

  return <>{children}</>;
}
