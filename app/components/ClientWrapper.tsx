'use client';

import { ReactNode } from 'react';
import { useScrollReveal, useTouchFeedback /* useSnapScroll */ } from '../hooks/useScrollReveal';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Activar los hooks de animación
  useScrollReveal();
  useTouchFeedback();
  // useSnapScroll(); // Deshabilitado temporalmente para evitar problemas con los enlaces
  
  return <>{children}</>;
} 