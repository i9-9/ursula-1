'use client';

import { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Temporalmente deshabilitado para testing
  // useScrollReveal();
  // useTouchFeedback();
  
  return <>{children}</>;
}