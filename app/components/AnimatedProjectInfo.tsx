'use client';

import { useState, useEffect } from 'react';
import { Project } from '../../lib/contentful';

interface AnimatedProjectInfoProps {
  project: Project;
  displayIndex?: number;
  topPosition?: string;
}

export default function AnimatedProjectInfo({ project, displayIndex = 0, topPosition = 'top-4' }: AnimatedProjectInfoProps) {
  const [line1Visible, setLine1Visible] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const [line3Visible, setLine3Visible] = useState(false);

  useEffect(() => {
    // Línea 1: Número, Título y Cliente (aparece primero)
    const timer1 = setTimeout(() => {
      setLine1Visible(true);
    }, 500);

    // Línea 2: Año y Tipo (aparece segundo)
    const timer2 = setTimeout(() => {
      setLine2Visible(true);
    }, 700);

    // Línea 3: Compañía (aparece tercero)
    const timer3 = setTimeout(() => {
      setLine3Visible(true);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className={`absolute ${topPosition} left-8 z-50 text-foreground`}>
      <div className="space-y-2 text-sm font-light tracking-wide">
        {/* Línea 1: Número, Título y Cliente */}
        <div 
          className={`flex items-center space-x-4 transition-all duration-500 ease-out ${
            line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <span className="text-xs text-foreground">{String(project.archiveOrder || displayIndex).padStart(2, '0')}</span>
          <span className="text-xs text-foreground uppercase">TITLE: {project.title}</span>
          <span className="text-xs text-foreground uppercase">CLIENT: {project.artist}</span>
        </div>
        
        {/* Línea 2: Año y Tipo */}
        <div 
          className={`flex items-center space-x-4 text-xs text-foreground transition-all duration-500 ease-out ${
            line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <span>YEAR: {project.year || '2024'}</span>
          <span>TYPE: {project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
        </div>
        
        {/* Línea 3: Compañía */}
        <div 
          className={`flex items-center text-xs text-foreground transition-all duration-500 ease-out ${
            line3Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <span>PRODUCTION COMPANY: {project.company || 'ARENA COLLECTIVE'}</span>
        </div>
      </div>
    </div>
  );
}
