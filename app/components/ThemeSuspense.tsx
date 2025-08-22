'use client';

import { Suspense, ReactNode } from 'react';

interface ThemeSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ThemeSuspense({ 
  children, 
  fallback = (
    <div className="relative inline-flex h-4 w-7 items-center rounded-full bg-gray-200 animate-pulse">
      <span className="inline-block h-2.5 w-2.5 transform rounded-full bg-gray-400 translate-x-1" />
    </div>
  )
}: ThemeSuspenseProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
