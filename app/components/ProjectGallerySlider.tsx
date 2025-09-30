'use client';

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/contentful';
import { useHydration } from '../hooks/useHydration';
import AnimatedProjectInfo from './AnimatedProjectInfo';

// Componente de imagen optimizado con manejo inteligente de aspect ratios
const ProjectImage = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
  if (!imageUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Imagen no disponible</p>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-all duration-500 ease-out"
        loading="lazy"
      />
    </div>
  );
};

interface ProjectGallerySliderProps {
  project: Project;
}

const ProjectGallerySlider = ({ project }: ProjectGallerySliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const isHydrated = useHydration();
  


  // Memoized images from project with infinite scroll
  const images = useMemo((): string[] => {
    const baseImages = project.images && project.images.length > 0 
      ? project.images 
      : project.thumbnail 
        ? [project.thumbnail] 
        : [];
    
    // Para scroll infinito bidireccional, necesitamos al menos 3 copias
    return [...baseImages, ...baseImages, ...baseImages];
  }, [project.images, project.thumbnail]);

  const originalImagesCount = project.images?.length || (project.thumbnail ? 1 : 0);

  // Función para obtener el índice real (mapeado al set original)
  const getRealIndex = useCallback((index: number): number => {
    if (originalImagesCount === 0) return 0;
    return index % originalImagesCount;
  }, [originalImagesCount]);

  // Función para manejar la transición infinita
  const handleInfiniteLoop = useCallback(() => {
    if (isScrollingRef.current || isDraggingRef.current || originalImagesCount === 0) return;

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

    // Solo hacer el salto si estamos muy cerca del borde
    if (minDistance > containerRect.width / 3) return;

    // Lógica de salto infinito
    const setIndex = Math.floor(closestIndex / originalImagesCount);
    const positionInSet = closestIndex % originalImagesCount;

    // Si estamos en el primer set (índices 0 a originalImagesCount-1)
    // Saltar al segundo set (índices originalImagesCount a 2*originalImagesCount-1)
    if (setIndex === 0) {
      const targetIndex = originalImagesCount + positionInSet;
      isScrollingRef.current = true;
      
      setTimeout(() => {
        const targetSlide = slideRefs.current[targetIndex];
        if (targetSlide) {
          targetSlide.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        }
        
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 200);
      }, 100);
    }
    // Si estamos en el tercer set (índices 2*originalImagesCount a 3*originalImagesCount-1)
    // Saltar al segundo set
    else if (setIndex === 2) {
      const targetIndex = originalImagesCount + positionInSet;
      isScrollingRef.current = true;
      
      setTimeout(() => {
        const targetSlide = slideRefs.current[targetIndex];
        if (targetSlide) {
          targetSlide.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        }
        
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 200);
      }, 100);
    }
  }, [originalImagesCount]);

  // Optimized scroll update with proper throttling
  const updateCurrentIndexFromScroll = useCallback(() => {
    // Don't update if we're programmatically scrolling or dragging
    if (isScrollingRef.current || isDraggingRef.current) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let closestIndex = 0;
    let smallestDistance = Infinity;
    
    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - containerCenter);
      
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = idx;
      }
    });
    
    // Only update if the change is significant (avoid micro-adjustments)
    if (closestIndex !== currentIndex && smallestDistance < container.clientWidth / 4) {
      setCurrentIndex(getRealIndex(closestIndex));
    }
  }, [currentIndex, getRealIndex]);

  // Inicializar posición en el segundo set (centro) para scroll infinito
  useLayoutEffect(() => {
    if (!isHydrated || originalImagesCount === 0 || images.length === 0) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    // Empezar en el segundo set para tener slides en ambos lados
    const startIndex = originalImagesCount; // Primer slide del segundo set
    const startSlide = slideRefs.current[startIndex];
    
    if (startSlide) {
      const previousBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';
      startSlide.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      container.style.scrollBehavior = previousBehavior;
    }
  }, [images.length, originalImagesCount, isHydrated]);

  // Optimized scroll listener with RAF throttling and infinite loop
  useEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let rafId: number | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastScrollTime = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      
      // Throttle scroll events to max 60fps
      if (now - lastScrollTime < 16) return;
      lastScrollTime = now;
      
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
        // Solo actualizar si no estamos en transición o arrastrando
        if (!isScrollingRef.current && !isDraggingRef.current) {
          updateCurrentIndexFromScroll();
        }
        rafId = null;
      });

      // Programar verificación de loop infinito después de que termine el scroll
      scrollTimeout = setTimeout(() => {
        if (!isScrollingRef.current && !isDraggingRef.current) {
          handleInfiniteLoop();
        }
        scrollTimeout = null;
      }, 300); // Aumentado para mayor estabilidad
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [updateCurrentIndexFromScroll, handleInfiniteLoop, isHydrated]);

  // Enable vertical wheel -> horizontal scroll mapping
  useEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isHydrated]);

  // Handle touch/drag events to prevent conflicts with infinite scroll
  useEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = () => {
      isDraggingRef.current = true;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleMouseDown = () => {
      isDraggingRef.current = true;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Global mouse up listener para detener el arrastre
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('mousedown', handleMouseDown, { passive: true });
    container.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isHydrated]);

  // Navigation functions
  const navigateToSlide = (targetRealIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Navegar al slide en el segundo set (centro)
    const targetIndex = originalImagesCount + targetRealIndex;
    const targetSlide = slideRefs.current[targetIndex];
    
    if (targetSlide) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      // Set scrolling flag and update index immediately
      isScrollingRef.current = true;
      setCurrentIndex(targetRealIndex);
      
      // Scroll to target slide
      targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      
      // Reset scrolling flag after animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  // Función para navegación infinita (sin volver al comienzo)
  const navigateInfinite = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Prevenir conflictos con la lógica automática
    isScrollingRef.current = true;
    
    const currentSlide = slideRefs.current[originalImagesCount + currentIndex];
    if (!currentSlide) {
      isScrollingRef.current = false;
      return;
    }
    
    const slideWidth = currentSlide.offsetWidth;
    const currentScrollLeft = container.scrollLeft;
    
    if (direction === 'next') {
      // Scroll hacia la derecha
      container.scrollTo({
        left: currentScrollLeft + slideWidth,
        behavior: 'smooth'
      });
    } else {
      // Scroll hacia la izquierda
      container.scrollTo({
        left: currentScrollLeft - slideWidth,
        behavior: 'smooth'
      });
    }
    
    // Reset scrolling flag después de la animación
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutId = scrollTimeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (originalImagesCount === 0) {
    return (
      <section className="relative px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 36px)', paddingTop: 0, marginTop: 0 }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg opacity-70">{project.artist}</p>
          {project.company && (
            <p className="text-sm opacity-50 mt-2">{project.company}</p>
          )}
          <p className="text-sm opacity-50 mt-4">Proyecto sin imágenes disponibles</p>
        </div>
      </section>
    );
  }
  
  return (
    <section 
      className="relative px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        height: 'calc(100vh - 36px)',
        paddingTop: 0,
        marginTop: 0
      }}
    >
      {/* Project Info - Mismo layout que videos */}
      <AnimatedProjectInfo project={project} displayIndex={0} topPosition="top-4" showProductionCompany={false} />
      
      {/* Navigation */}
      {originalImagesCount > 1 && (
        <div className="absolute top-4 right-8 z-50 flex items-center space-x-4">
          {/* Navigation arrows */}
          <div className="flex items-center -space-x-2">
            <button 
              className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
              aria-label="Previous image"
              onClick={() => navigateInfinite('prev')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 5v14l-11-7z"/>
              </svg>
            </button>
            
            <button 
              className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
              aria-label="Next image"
              onClick={() => navigateInfinite('next')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full flex items-center justify-center mt-4">
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden px-0 snap-x snap-mandatory touch-pan-x"
          aria-label="Project gallery slider"
          style={{ 
            scrollPaddingInline: 'calc((100vw - 95vw)/2)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="flex items-center justify-start gap-8 w-max" style={{ minHeight: '0' }}>
            {/* Left spacer */}
            <div className="flex-shrink-0 w-[calc((100vw-85vw)/2)] sm:w-[calc((100vw-75vw)/2)]" aria-hidden="true" />
            
            {images.map((imageUrl, index) => {
              const realIndex = getRealIndex(index);
              const setNumber = Math.floor(index / originalImagesCount);
              const uniqueKey = `${project.id}-image-set${setNumber}-${realIndex}`;
              
              return (
                <div
                  key={uniqueKey}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className="group flex-shrink-0 snap-center cursor-pointer w-[calc(85vw-2rem)] sm:w-[calc(75vw-2rem)]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${project.title} - Imagen ${realIndex + 1}`}
                  onClick={() => navigateToSlide(realIndex)}
                >
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative w-full h-[500px] sm:h-[550px]"
                    >
                      <ProjectImage imageUrl={imageUrl} title={project.title} />
                    </motion.div>
                  </div>
                </div>
              );
            })}
            
            {/* Right spacer */}
            <div className="flex-shrink-0 w-[calc((100vw-85vw)/2)] sm:w-[calc((100vw-75vw)/2)]" aria-hidden="true" />
          </div>
        </div>
      </div>
      
      {/* Dots indicator */}
      {originalImagesCount > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex space-x-2">
            {Array.from({ length: originalImagesCount }, (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-foreground scale-125' 
                    : 'bg-foreground/30 hover:bg-foreground/50'
                }`}
                onClick={() => navigateToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectGallerySlider;