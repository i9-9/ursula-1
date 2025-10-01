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
        <div className="absolute bottom-8 right-0 px-4 md:px-[30px]">
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
      <div className="relative w-full h-full flex items-center justify-center p-12">
        {/* Imagen centrada */}
        <div className="flex items-center justify-center">
          {firstSlide.type === 'image' ? (
            <Image
              src={firstSlide.src}
              alt={firstSlide.alt}
              width={600}
              height={400}
              className="object-contain max-w-full max-h-[50vh]"
              priority
              sizes="(max-width: 768px) 90vw, 600px"
            />
          ) : firstSlide.videoUrl ? (
            <video
              src={firstSlide.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="max-w-full max-h-[50vh] object-contain"
              style={{ width: '600px', height: '400px' }}
            />
          ) : (
            <div className="w-[600px] h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Contenido no disponible</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Copyright posicionado en la parte inferior derecha */}
      <div className="absolute bottom-8 right-0 px-4 md:px-[30px]">
        <Copyright absolute={true} />
      </div>
    </section>
  );
}