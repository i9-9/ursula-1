'use client';

import { useSplash } from '../contexts/SplashContext';
import { ReactNode } from 'react';

interface MainContentWrapperProps {
  children: ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isSplashVisible } = useSplash();

  // Hide main content when splash is visible to prevent flash
  if (isSplashVisible) {
    return null;
  }

  return <>{children}</>;
}
