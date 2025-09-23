'use client'

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { HeroSlide } from '@/lib/contentful'
import { useSplash } from '../contexts/SplashContext'
import HydrationSafe from './HydrationSafe'

// Memoized image component
const ImageSlide = ({ slide }: { slide: HeroSlide }) => {
  const imageSource = useMemo(() => {
    if (slide.src) {
      return slide.src;
    }
    
    if (slide.videoUrl && (slide.videoUrl.includes('.jpg') || slide.videoUrl.includes('.jpeg') || slide.videoUrl.includes('.png') || slide.videoUrl.includes('.webp'))) {
      return slide.videoUrl;
    }
    
    return '';
  }, [slide])
  
  const ImageContent = useMemo(() => {
    if (!imageSource) {
      return (
        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Imagen no disponible</p>
        </div>
      )
    }
    
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSource}
        alt={slide.alt || slide.title}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="lazy"
      />
    )
  }, [imageSource, slide.alt, slide.title])
  
  return ImageContent
}

interface FeaturedProjectProps {
  heroSlides?: HeroSlide[]
}

const FeaturedProject = ({ heroSlides = [] }: FeaturedProjectProps) => {
  const router = useRouter()
  const { isSplashVisible } = useSplash()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const isTransitioningRef = useRef(false)
  const lastScrollLeft = useRef(0)

  // Función para manejar click en slide
  const handleSlideClick = useCallback((slide: HeroSlide) => {
    if (slide.projectSlug) {
      const url = `/work/${slide.projectSlug}`;
      router.push(url);
    }
  }, [router])

  // Crear slides infinitos - necesitamos 3 sets para scroll bidireccional suave
  const slides = useMemo((): HeroSlide[] => {
    if (!heroSlides || heroSlides.length === 0) return [];
    
    // Para scroll infinito bidireccional, necesitamos al menos 3 copias
    return [...heroSlides, ...heroSlides, ...heroSlides];
  }, [heroSlides])

  const originalSlidesCount = heroSlides?.length || 0;

  // Función para obtener el índice real (mapeado al set original)
  const getRealIndex = useCallback((index: number): number => {
    if (originalSlidesCount === 0) return 0;
    return index % originalSlidesCount;
  }, [originalSlidesCount]);

  // Función para centrar un slide específico
  const scrollToSlide = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
    const container = scrollContainerRef.current;
    const slide = slideRefs.current[index];
    
    if (!container || !slide) return;

    const containerRect = container.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    const slideCenter = slide.offsetWidth / 2;
    const targetScrollLeft = slide.offsetLeft - containerCenter + slideCenter;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: behavior
    });
  }, []);

  // Función para manejar la transición infinita
  const handleInfiniteLoop = useCallback(() => {
    if (isTransitioningRef.current || originalSlidesCount === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;

    // Encontrar el slide más cercano al centro
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(slideCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);

    // Lógica de salto infinito
    const setIndex = Math.floor(closestIndex / originalSlidesCount);
    const positionInSet = closestIndex % originalSlidesCount;

    // Si estamos en el primer set (índices 0 a originalSlidesCount-1)
    // Saltar al segundo set (índices originalSlidesCount a 2*originalSlidesCount-1)
    if (setIndex === 0) {
      const targetIndex = originalSlidesCount + positionInSet;
      isTransitioningRef.current = true;
      
      setTimeout(() => {
        scrollToSlide(targetIndex, 'auto');
        setCurrentIndex(targetIndex);
        
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 100);
      }, 50);
    }
    // Si estamos en el tercer set (índices 2*originalSlidesCount a 3*originalSlidesCount-1)
    // Saltar al segundo set
    else if (setIndex === 2) {
      const targetIndex = originalSlidesCount + positionInSet;
      isTransitioningRef.current = true;
      
      setTimeout(() => {
        scrollToSlide(targetIndex, 'auto');
        setCurrentIndex(targetIndex);
        
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 100);
      }, 50);
    }
  }, [originalSlidesCount, scrollToSlide]);

  // Inicializar posición en el segundo set (centro)
  useLayoutEffect(() => {
    if (originalSlidesCount === 0 || slides.length === 0) return;

    // Empezar en el segundo set para tener slides en ambos lados
    const startIndex = originalSlidesCount; // Primer slide del segundo set
    setCurrentIndex(startIndex);
    
    // Scroll inicial sin animación
    setTimeout(() => {
      scrollToSlide(startIndex, 'auto');
    }, 100);
  }, [slides.length, originalSlidesCount, scrollToSlide]);

  // Listener de scroll con throttling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Cancelar RAF anterior si existe
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Cancelar timeout anterior si existe
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Programar actualización con RAF
      rafId = requestAnimationFrame(() => {
        // Solo actualizar si no estamos en transición
        if (!isTransitioningRef.current) {
          handleInfiniteLoop();
        }
        rafId = null;
      });

      // Programar verificación de loop infinito después de que termine el scroll
      scrollTimeout = setTimeout(() => {
        if (!isTransitioningRef.current) {
          handleInfiniteLoop();
        }
        scrollTimeout = null;
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [handleInfiniteLoop]);

  // Mapear scroll vertical a horizontal
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      // Solo interceptar scroll vertical
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Si no hay slides, mostrar estado de carga
  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: '100vh', paddingTop: 0 }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando proyectos destacados...</h1>
          <p className="text-sm opacity-70">Conectando con Contentful</p>
        </div>
      </section>
    );
  }

  // No renderizar si splash está visible
  if (isSplashVisible) {
    return null;
  }
  
  return (
    <HydrationSafe>
      <section 
        className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center"
        style={{ 
          height: '100vh',
          paddingTop: 0
        }}
      >
        <div className="w-full flex items-center justify-center">
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto overflow-y-hidden px-0 snap-x snap-mandatory touch-pan-x scroll-padding-inline-[calc((100vw-90vw)/2-16px)] sm:scroll-padding-inline-[calc((100vw-80vw)/2-24px)] md:scroll-padding-inline-[calc((100vw-70vw)/2-32px)] lg:scroll-padding-inline-[calc((100vw-60vw)/2-24px)]"
            aria-label="Featured projects slider"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
              
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
            `}</style>
            
            <div className="flex items-center justify-start gap-0 w-max" style={{ minHeight: '0' }}>
              {/* Espaciador izquierdo */}
              <div className="flex-shrink-0 w-[calc((100vw-90vw)/2-16px)] sm:w-[calc((100vw-80vw)/2-24px)] md:w-[calc((100vw-70vw)/2-32px)] lg:w-[calc((100vw-60vw)/2-24px)]" aria-hidden="true" />
              
              {slides.map((slide, index) => {
                const isClickable = Boolean(slide.projectSlug);
                const realIndex = getRealIndex(index);
                const setNumber = Math.floor(index / originalSlidesCount);
                const uniqueKey = `${slide.id}-set${setNumber}-${realIndex}`;
                
                return (
                  <div
                    key={uniqueKey}
                    ref={(el) => { if (el) slideRefs.current[index] = el }}
                    className={`group flex-shrink-0 snap-center w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] px-4 sm:px-6 md:px-8 lg:px-6 ${isClickable ? 'cursor-pointer' : ''}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${slide.title} by ${slide.client}`}
                    onClick={() => isClickable && handleSlideClick(slide)}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSlideClick(slide);
                      }
                    }}
                    tabIndex={isClickable ? 0 : -1}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ paddingBottom: '56.25%' }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <ImageSlide slide={slide} />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
              
              {/* Espaciador derecho */}
              <div className="flex-shrink-0 w-[calc((100vw-90vw)/2-16px)] sm:w-[calc((100vw-80vw)/2-24px)] md:w-[calc((100vw-70vw)/2-32px)] lg:w-[calc((100vw-60vw)/2-24px)]" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </HydrationSafe>
  );
};

export default FeaturedProject;