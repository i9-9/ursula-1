'use client';

import { useState } from 'react';
import Link from 'next/link';
import HomeLoader from './HomeLoader';

interface ProjectPageLoaderProps {
  project: any;
  currentIndex: number;
  prevProject: any;
  nextProject: any;
}

export default function ProjectPageLoader({ project, currentIndex, prevProject, nextProject }: ProjectPageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <HomeLoader onLoadingComplete={handleLoadingComplete} />}
      <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header similar al home */}
        <header className="fixed top-0 left-0 w-full z-50 py-8">
          <div className="max-w-7xl mx-auto px-2.5 md:px-[15px]">
            <div className="flex justify-between items-baseline">
              {/* Logo/Nombre */}
              <Link href="/" className="text-[13px] font-['Suisse_BP_INTL'] uppercase text-foreground hover:opacity-70 transition-opacity">
                URSULA BENAVIDEZ
              </Link>
              
              {/* Navegación */}
              <nav className="flex gap-4 md:gap-6 items-baseline">
                <Link href="/" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  work
                </Link>
                <Link href="/archive" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  archive
                </Link>
                <Link href="/about" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  about
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="pt-24 min-h-screen">
          {/* Video a pantalla completa */}
          <div className="relative w-full h-screen">
            {/* Video Player - Full width */}
            <div className="absolute inset-0 w-full h-full">
              {project.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${project.vimeoId}?h=1234567890&autoplay=0&title=0&byline=0&portrait=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} - ${project.artist}`}
                />
              ) : project.youtubeUrl ? (
                <iframe
                  src={project.youtubeUrl.replace('youtu.be', 'youtube.com/embed')}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} - ${project.artist}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Video no disponible</p>
                </div>
              )}
            </div>

            {/* Información del proyecto superpuesta - Izquierda */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-10 text-white">
              <div className="space-y-6">
                <div className="text-4xl font-medium">
                  {currentIndex + 1}
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium uppercase tracking-wide block">TITLE:</span>
                    <p className="text-lg">{project.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium uppercase tracking-wide block">YEAR:</span>
                    <p className="text-lg">{project.year}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium uppercase tracking-wide block">CLIENT:</span>
                    <p className="text-lg">{project.artist}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium uppercase tracking-wide block">TYPE OF PROJECT:</span>
                    <p className="text-lg">MUSIC VIDEO</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium uppercase tracking-wide block">PRODUCTION COMPANY:</span>
                    <p className="text-lg">ARENA COLLECTIVE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles del video - Header */}
            <div className="absolute top-8 left-8 z-10">
              <div className="text-white text-sm">
                <div className="font-medium">URSULA BENAVIDEZ</div>
                <div className="text-xs opacity-80">{project.title}</div>
              </div>
            </div>

            {/* Controles del video - Derecha */}
            <div className="absolute top-8 right-8 z-10">
              <div className="flex items-center gap-2">
                <button className="text-white hover:opacity-80 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navegación entre proyectos - Derecha */}
            <div className="absolute bottom-8 right-8 z-10">
              <div className="flex flex-col items-end space-y-4">
                {/* Indicador de posición */}
                <div className="w-2 h-2 bg-white rounded-full"></div>
                
                {/* Flechas de navegación */}
                <div className="flex flex-col gap-2">
                  {prevProject && (
                    <Link 
                      href={`/work/${prevProject.slug}`}
                      className="text-white hover:opacity-80 transition-opacity"
                      aria-label={`Previous project: ${prevProject.title}`}
                    >
                      <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                  
                  {nextProject && (
                    <Link 
                      href={`/work/${nextProject.slug}`}
                      className="text-white hover:opacity-80 transition-opacity"
                      aria-label={`Next project: ${nextProject.title}`}
                    >
                      <svg className="w-6 h-6 -rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
