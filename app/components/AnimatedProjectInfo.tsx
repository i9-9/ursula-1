'use client';

import { useState, useEffect } from 'react';
import { Project } from '../../lib/contentful';

interface AnimatedProjectInfoProps {
  project: Project;
  displayIndex?: number;
  topPosition?: 'top-4' | 'top-20';
  showProductionCompany?: boolean;
}

export default function AnimatedProjectInfo({ project, displayIndex = 0, topPosition = 'top-4', showProductionCompany = true }: AnimatedProjectInfoProps) {
  const [line1Visible, setLine1Visible] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const [line3Visible, setLine3Visible] = useState(false);

  useEffect(() => {
    // Línea 1: Número, Título y Cliente (aparece primero)
    const timer1 = setTimeout(() => {
      setLine1Visible(true);
    }, 100); // Muy rápido para que se vea casi inmediatamente

    // Línea 2: Año y Tipo (aparece segundo)
    const timer2 = setTimeout(() => {
      setLine2Visible(true);
    }, 300);

    // Línea 3: Compañía (aparece tercero)
    const timer3 = setTimeout(() => {
      setLine3Visible(true);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className={`absolute left-4 md:left-8 z-50 text-foreground ${topPosition === 'top-20' ? 'top-12' : 'top-1'}`}>
      <div className="space-y-0.5 text-sm font-light tracking-wide">
        {/* Desktop Layout: Múltiples datos por línea */}
        <div className="hidden md:block">
          {/* Línea 1: Solo el número */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-[9px] text-foreground">{String(project.archiveOrder || displayIndex).padStart(2, '0')}</span>
          </div>
          
          {/* Línea 2: Título y Cliente */}
          <div 
            className={`flex items-center space-x-4 transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TITLE</span>
            <span className="text-xs text-foreground uppercase">{project.title}</span>
            <span className="text-xs text-gray-400">CLIENT</span>
            <span className="text-xs text-foreground uppercase">{project.artist}</span>
          </div>
          
          {/* Línea 3: Año y Tipo */}
          <div 
            className={`flex items-center space-x-4 text-xs text-foreground transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-gray-400">YEAR</span>
            <span className="text-foreground">{project.year || '2024'}</span>
            <span className="text-gray-400">TYPE</span>
            <span className="text-foreground">{project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
          </div>
          
          {/* Línea 4: Compañía (solo si showProductionCompany es true) */}
          {showProductionCompany && (
            <div 
              className={`flex items-center text-xs text-foreground transition-all duration-500 ease-out ${
                line3Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              <span className="text-gray-400">PRODUCTION COMPANY</span>
              <span className="text-foreground ml-4">{project.company || 'ARENA COLLECTIVE'}</span>
            </div>
          )}
        </div>

        {/* Mobile Layout: Un dato por línea */}
        <div className="block md:hidden space-y-0">
          {/* Número */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-[9px] text-foreground">{String(project.archiveOrder || displayIndex).padStart(2, '0')}</span>
          </div>
          
          {/* Título */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TITLE</span>
            <span className="text-xs text-foreground uppercase ml-2">{project.title}</span>
          </div>
          
          {/* Cliente */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">CLIENT</span>
            <span className="text-xs text-foreground uppercase ml-2">{project.artist}</span>
          </div>
          
          {/* Año */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">YEAR</span>
            <span className="text-xs text-foreground ml-2">{project.year || '2024'}</span>
          </div>
          
          {/* Tipo */}
          <div 
            className={`transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TYPE</span>
            <span className="text-xs text-foreground ml-2">{project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
          </div>
          
          {/* Compañía (solo si showProductionCompany es true) */}
          {showProductionCompany && (
            <div 
              className={`transition-all duration-500 ease-out ${
                line3Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              <span className="text-xs text-gray-400">PRODUCTION COMPANY</span>
              <span className="text-xs text-foreground ml-2">{project.company || 'ARENA COLLECTIVE'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
