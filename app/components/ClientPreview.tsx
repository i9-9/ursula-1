'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeroSlide } from '@/lib/contentful';
import { useSplash } from '@/app/contexts/SplashContext';

interface ClientPreviewProps {
  heroSlides: HeroSlide[];
}

export default function ClientPreview({ heroSlides }: ClientPreviewProps) {
  const { isSplashVisible } = useSplash();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) return null;

  if (isLoading) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando vista previa...</h1>
          <p className="text-sm opacity-70">Preparando contenido para cliente</p>
        </div>
      </section>
    );
  }

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">No hay contenido disponible</h1>
          <p className="text-sm opacity-70">No se encontraron proyectos para mostrar</p>
        </div>
      </section>
    );
  }

  // Obtener la primera imagen del slider
  const firstSlide = heroSlides[0];

  return (
    <section 
      className="absolute inset-0 flex items-center justify-center bg-background text-foreground overflow-hidden" 
      style={{ height: '100vh' }}
    >
      {/* Contenedor principal centrado */}
      <div className="relative w-full h-full flex items-center justify-center p-12">
        {/* Imagen centrada */}
        <div className="relative max-w-2xl max-h-[60vh] w-full h-full flex items-center justify-center">
          {firstSlide.type === 'image' ? (
            <Image
              src={firstSlide.src}
              alt={firstSlide.alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          ) : firstSlide.videoUrl ? (
            <video
              src={firstSlide.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Contenido no disponible</p>
            </div>
          )}
        </div>

        {/* Información del proyecto (opcional, en esquina superior izquierda) */}
        <div className="absolute top-8 left-8 z-10 text-foreground">
          <div className="space-y-1 text-sm font-light tracking-wide">
            <div className="text-xs opacity-70">VISTA PREVIA PARA CLIENTE</div>
            <div className="text-xs font-normal">{firstSlide.title}</div>
            <div className="text-xs opacity-70">{firstSlide.client}</div>
          </div>
        </div>

        {/* Indicador de que es vista previa (opcional, en esquina inferior derecha) */}
        <div className="absolute bottom-8 right-8 z-10 text-foreground">
          <div className="text-xs opacity-50">
            Vista previa • {heroSlides.length} proyectos disponibles
          </div>
        </div>
      </div>
    </section>
  );
}
