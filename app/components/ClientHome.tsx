'use client';

import { HeroSlide } from '@/lib/contentful';
import { useSplash } from '@/app/contexts/SplashContext';
import Copyright from './Copyright';
import FadeSlider from '../test-slider2/FadeSlider';

interface ClientHomeProps {
  heroSlides: HeroSlide[];
}

export default function ClientHome({ heroSlides }: ClientHomeProps) {
  const { isSplashVisible } = useSplash();

  if (isSplashVisible) return null;

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: 'calc(100vh - 36px)' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">No hay contenido disponible</h1>
          <p className="text-sm opacity-70">No se encontraron proyectos para mostrar</p>
        </div>
        {/* Copyright posicionado en la parte inferior derecha */}
        <div className="absolute bottom-4 right-0 px-4 md:px-[30px]">
          <Copyright absolute={true} />
        </div>
      </section>
    );
  }

  return (
    <section 
      className="absolute inset-0 flex items-center justify-center bg-background text-foreground overflow-hidden" 
      style={{ height: 'calc(100vh - 36px)' }}
    >
      {/* FadeSlider con transiciones suaves */}
      <FadeSlider slides={heroSlides} />
      
      {/* Copyright posicionado en la parte inferior derecha */}
      <div className="absolute bottom-4 right-0 px-4 md:px-[30px] z-10">
        <Copyright absolute={true} />
      </div>
    </section>
  );
}