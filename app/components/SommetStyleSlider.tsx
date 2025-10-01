'use client'

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { HeroSlide } from '@/lib/contentful';
import { useRouter } from 'next/navigation';
import { useSplash } from '../contexts/SplashContext';
import HydrationSafe from './HydrationSafe';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';

interface SommetStyleSliderProps {
  heroSlides: HeroSlide[];
}

// Ancho fijo único como en Sommet Studio original
const SLIDE_WIDTH = 400;  // Reducido de 500px a 400px

const MediaSlide = React.memo(({ slide, onLoad }: { slide: HeroSlide; onLoad?: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const mediaStyle: React.CSSProperties = useMemo(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    userSelect: 'none',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }), [isLoaded]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  if (slide.videoUrl) {
    return (
      <video
        src={slide.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={mediaStyle}
        onLoadedMetadata={handleLoad}
        onError={() => setIsLoaded(true)} // Fallback for video errors
      />
    )
  }

  if (slide.src) {
    return (
      <Image 
        src={slide.src}
        alt={slide.alt || slide.title} 
        width={400}
        height={300}
        style={mediaStyle}
        draggable={false}
        onLoad={handleLoad}
        onError={() => setIsLoaded(true)} // Fallback for image errors
        loading="lazy"
        decoding="async"
        sizes="400px"
        quality={85}
      />
    )
  }

  return null;
});

MediaSlide.displayName = 'MediaSlide';

const SommetStyleSlider = ({ heroSlides }: SommetStyleSliderProps) => {
  const router = useRouter();
  const { isSplashVisible } = useSplash();
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideClick = (slide: HeroSlide) => {
    if (slide.projectSlug) {
      router.push(`/work/${slide.projectSlug}`);
    }
  };

  const handleImageLoad = () => {
    // Recalcular gaps cuando las imágenes cargan
    if (swiperRef.current) {
      swiperRef.current.update();
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
        className="absolute inset-0 flex items-center justify-center bg-background text-foreground overflow-hidden slider-container" 
        style={{ height: '100vh' }}
      >
        <div className="swiper-outer-container">
          <Swiper
            modules={[Mousewheel, Keyboard]}
            slidesPerView={3}
            spaceBetween={180}
            centeredSlides={true}
            speed={300}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: false,
            }}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            grabCursor={false}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 100,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 180,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="sommet-swiper"
          >
            {heroSlides.map((slide, index) => {
              const isClickable = Boolean(slide.projectSlug);
              
              return (
                <SwiperSlide 
                  key={`${slide.id}-${index}`}
                  style={{ width: `${SLIDE_WIDTH}px` }}
                >
                  <div
                    className={`slide-content ${isClickable ? 'clickable' : ''}`}
                    onClick={() => isClickable && handleSlideClick(slide)}
                  >
                    <MediaSlide slide={slide} onLoad={handleImageLoad} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Inline Styles */}
        <style jsx global>{`
          /* Container principal */
          .slider-container {
            cursor: auto;
          }
          
          .swiper-outer-container {
            width: 100%;
            max-width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Swiper base */
          .sommet-swiper {
            width: 100%;
            height: 100%;
            max-height: 968px;
            position: relative;
            overflow: visible !important;
          }

          .sommet-swiper .swiper-wrapper {
            display: flex;
            align-items: center;
          }

          /* CLAVE: Todos los slides tienen el MISMO ancho fijo como Sommet */
          .sommet-swiper .swiper-slide {
            width: 400px !important;
            height: auto;  // Altura automática para acomodar diferentes aspect ratios
            min-height: 300px;  // Altura mínima
            max-height: 600px;  // Altura máxima
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
            transform: scale(1);
            opacity: 0.6;
            transform-origin: center center;
          }

          /* EFECTO PRINCIPAL: Slide activo se escala */
          .sommet-swiper .swiper-slide-active {
            transform: scale(1.4);
            opacity: 1;
            z-index: 10;
          }

          /* Slides adyacentes */
          .sommet-swiper .swiper-slide-next,
          .sommet-swiper .swiper-slide-prev {
            opacity: 0.8;
          }

          /* Contenido del slide */
          .slide-content {
            width: 100%;
            height: auto;  // Altura automática
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: visible;  // No ocultar contenido
            user-select: none;
            -webkit-user-select: none;
          }

          .slide-content.clickable {
            cursor: pointer;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .sommet-swiper {
              max-height: 500px;
            }
            
            .sommet-swiper .swiper-slide {
              width: 250px !important;
              height: auto;
              min-height: 200px;
              max-height: 350px;
            }
            
            .sommet-swiper .swiper-slide-active {
              transform: scale(1.15);
            }
          }

          @media (min-width: 769px) and (max-width: 1023px) {
            .sommet-swiper {
              max-height: 700px;
            }
            
            .sommet-swiper .swiper-slide {
              width: 320px !important;
              height: auto;
              min-height: 250px;
              max-height: 450px;
            }
            
            .sommet-swiper .swiper-slide-active {
              transform: scale(1.25);
            }
          }

          @media (min-width: 1024px) {
            .sommet-swiper .swiper-slide {
              width: 400px !important;
              height: auto;
              min-height: 300px;
              max-height: 600px;
            }
            
            .sommet-swiper .swiper-slide-active {
              transform: scale(1.4);
            }
          }

          /* Ocultar scrollbar */
          .swiper-scrollbar {
            display: none !important;
          }

          /* Animación de entrada */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 0.6;
              transform: translateY(0) scale(1);
            }
          }

          .sommet-swiper .swiper-slide {
            animation: fadeInUp 0.4s ease-out backwards;
          }

          .sommet-swiper .swiper-slide:nth-child(1) {
            animation-delay: 0.1s;
          }

          .sommet-swiper .swiper-slide:nth-child(2) {
            animation-delay: 0.2s;
          }

          .sommet-swiper .swiper-slide:nth-child(3) {
            animation-delay: 0.3s;
          }
        `}</style>
      </section>
    </HydrationSafe>
  );
};

export default SommetStyleSlider;