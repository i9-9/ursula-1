'use client'

import React, { useRef } from 'react';
import Image from 'next/image';
import { HeroSlide } from '@/lib/contentful';
import { useRouter } from 'next/navigation';
import { useSplash } from '../contexts/SplashContext';
import HydrationSafe from './HydrationSafe';

interface FlexboxSliderProps {
  heroSlides: HeroSlide[];
}

const MediaSlide = ({ slide }: { slide: HeroSlide }) => {
  const mediaStyle: React.CSSProperties = {
    height: 'auto',
    maxHeight: '60vh',
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
  }

  if (slide.videoUrl) {
    return (
      <video
        src={slide.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        style={mediaStyle}
      />
    )
  }

  if (slide.src) {
    return (
      <Image 
        src={slide.src}
        alt={slide.alt || slide.title} 
        loading="lazy" 
        style={mediaStyle}
        width={800}
        height={600}
        className="object-contain"
      />
    )
  }

  return (
    <div style={{ 
      height: '300px', 
      width: '300px', 
      background: '#eee', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p className="text-gray-500 text-sm">Media no disponible</p>
    </div>
  )
}

const FlexboxSlider = ({ heroSlides }: FlexboxSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSplashVisible } = useSplash();

  const handleSlideClick = (slide: HeroSlide) => {
    if (slide.projectSlug) {
      router.push(`/work/${slide.projectSlug}`);
    }
  };

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando proyectos destacados...</h1>
          <p className="text-sm opacity-70">Conectando con Contentful</p>
        </div>
      </section>
    )
  }

  if (isSplashVisible) return null;

  return (
    <HydrationSafe>
      <section 
        className="absolute inset-0 flex items-center justify-center bg-background text-foreground overflow-hidden" 
        style={{ height: '100vh' }}
      >
        {/* Slider container - estilo Sommet Studio */}
        <div 
          ref={sliderRef}
          className="flex items-center overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '3rem',
            paddingLeft: '50vw',
            paddingRight: '50vw',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          {heroSlides.map((slide, index) => {
            const isClickable = Boolean(slide.projectSlug);
            
            return (
              <div
                key={`${slide.id}-${index}`}
                className={`flex-shrink-0 ${isClickable ? 'cursor-pointer' : ''}`}
                onClick={() => isClickable && handleSlideClick(slide)}
              >
                <MediaSlide slide={slide} />
              </div>
            );
          })}
        </div>
      </section>
    </HydrationSafe>
  );
};

export default FlexboxSlider;