'use client';

import Image from 'next/image';
import { HeroSlide } from '@/lib/contentful';
import { useSplash } from '@/app/contexts/SplashContext';
import Copyright from './Copyright';

interface ClientHomeProps {
  heroSlides: HeroSlide[];
}

export default function ClientHome({ heroSlides }: ClientHomeProps) {
  const { isSplashVisible } = useSplash();
  // Removemos el loading state ya que con SSG los datos ya están disponibles

  if (isSplashVisible) return null;

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: 'calc(100vh - 36px)' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">No hay contenido disponible</h1>
          <p className="text-sm opacity-70">No se encontraron proyectos para mostrar</p>
        </div>
        {/* Copyright posicionado en la parte inferior derecha */}
        <div className="absolute bottom-1 right-0 px-4 md:px-[30px]">
          <Copyright absolute={true} />
        </div>
      </section>
    );
  }

  // Obtener la primera imagen del slider
  const firstSlide = heroSlides[0];

  return (
    <section 
      className="absolute inset-0 flex items-center justify-center bg-background text-foreground overflow-hidden" 
      style={{ height: 'calc(100vh - 36px)' }}
    >
      {/* Contenedor principal centrado */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        {/* Imagen centrada con aspect-ratio fijo para evitar CLS */}
        <div className="flex items-center justify-center w-full px-4 md:px-0">
          {firstSlide.type === 'image' ? (
            <div 
              className="relative w-full max-w-[320px] md:max-w-[600px]"
              style={{ 
                aspectRatio: '3/2',
                maxHeight: '50vh'
              }}
            >
              <Image
                src={firstSlide.src}
                alt={firstSlide.alt}
                fill
                className="object-contain"
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 360px, 600px"
                quality={85}
              />
            </div>
          ) : firstSlide.videoUrl ? (
            <div 
              className="relative w-full max-w-[320px] md:max-w-[600px]"
              style={{ 
                aspectRatio: '3/2',
                maxHeight: '50vh'
              }}
            >
              <video
                src={firstSlide.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
                preload="metadata"
              />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-[320px] md:max-w-[600px]"
              style={{ 
                aspectRatio: '3/2',
                maxHeight: '50vh'
              }}
            >
              <p className="text-gray-500 dark:text-gray-400">Contenido no disponible</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Copyright posicionado en la parte inferior derecha */}
      <div className="absolute bottom-1 right-0 px-4 md:px-[30px]">
        <Copyright absolute={true} />
      </div>
    </section>
  );
}