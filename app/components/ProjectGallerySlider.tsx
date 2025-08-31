'use client';

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/contentful';

// Memoized image component similar to FeaturedProject
const ProjectImage = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
  if (!imageUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Imagen no disponible</p>
      </div>
    );
  }
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover z-0"
      loading="lazy"
    />
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
  const [isHydrated, setIsHydrated] = useState(false);

  // Memoized images from project (similar to FeaturedProject logic)
  const images = useMemo((): string[] => {
    // Si el proyecto tiene imágenes, usarlas
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    
    // Fallback al thumbnail si no hay imágenes
    if (project.thumbnail) {
      return [project.thumbnail];
    }
    
    return [];
  }, [project.images, project.thumbnail]);

  // Simple hydration check - solo después del montaje
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Optimized scroll update with proper throttling (igual que FeaturedProject)
  const updateCurrentIndexFromScroll = useCallback(() => {
    if (isScrollingRef.current) return;
    
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
    
    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  }, [currentIndex]);

  // Initial position to center first slide (similar to FeaturedProject)
  useLayoutEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container || images.length === 0) return;

    // Para galería de proyecto, centrar la primera imagen
    const firstSlide = slideRefs.current[0];
    if (firstSlide) {
      const previousBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';
      firstSlide.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      container.style.scrollBehavior = previousBehavior;
    }
  }, [images.length, isHydrated]);

  // Optimized scroll listener with RAF throttling (igual que FeaturedProject)
  useEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        updateCurrentIndexFromScroll();
        rafId = null;
      });
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateCurrentIndexFromScroll, isHydrated]);

  // Enable vertical wheel -> horizontal scroll mapping (igual que FeaturedProject)
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

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutId = scrollTimeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // If no images, show a message
  if (images.length === 0) {
    return (
      <section className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: '100vh', paddingTop: 0 }}>
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
      className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        height: '100vh',
        paddingTop: 0
      }}
    >
      {/* Project Info - Arriba a la izquierda sin pisar navbar */}
      <div className="absolute top-24 left-8 z-50 text-foreground">
        <div className="space-y-2 text-sm font-light tracking-wide">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-foreground opacity-100">{String(project.archiveOrder || 0).padStart(2, '0')}</span>
            <span className="text-xs text-foreground opacity-100 uppercase">{project.title}</span>
            <span className="text-xs text-foreground opacity-100 uppercase">{project.artist}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-foreground opacity-100">
            <span>YEAR: {project.year || '2024'}</span>
            <span>TYPE OF PROJECT: {project.projectType?.toUpperCase() || 'MUSIC VIDEO'}</span>
          </div>
          <div className="text-xs text-foreground opacity-100">
            <span>PRODUCTION COMPANY: {project.productionCompany || project.company || project.artist || 'ARENA COLLECTIVE'}</span>
          </div>
        </div>
      </div>
      
      {/* Navegación con flechas - Alineado con información del proyecto */}
      {images.length > 1 && (
        <div className="absolute top-24 right-8 z-10 flex items-center">
          {/* Flecha izquierda */}
          <button 
            className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
            aria-label="Previous image"
            onClick={() => {
              const container = scrollContainerRef.current;
              if (!container) return;
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
              const targetSlide = slideRefs.current[prevIndex];
              if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 5v14l-11-7z"/>
            </svg>
          </button>
          
          {/* Flecha derecha */}
          <button 
            className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
            aria-label="Next image"
            onClick={() => {
              const container = scrollContainerRef.current;
              if (!container) return;
              const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
              const targetSlide = slideRefs.current[nextIndex];
              if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}
      
      <div className="w-full flex items-center justify-center">
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden px-0 snap-x snap-mandatory touch-pan-x"
          aria-label="Project gallery slider"
          style={{ 
            scrollPaddingInline: 'calc((100vw - 72vw)/2)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
            
            /* Estilo para las imágenes del proyecto */
            img {
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          <div className="flex items-center justify-start gap-0 w-max" style={{ minHeight: '0' }}>
            {/* Left spacer to allow first slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72vw)/2)' }} aria-hidden="true" />
            
            {images.map((imageUrl, index) => {
              // Solo aplicar efectos visuales después de la hidratación para evitar diferencias SSR
              const isActive = isHydrated && index === currentIndex;
              
              return (
                <div
                  key={`${project.id}-image-${index}`}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className="group flex-shrink-0 snap-center"
                  style={{ width: '72vw' }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${project.title} - Imagen ${index + 1}`}
                >
                  <div
                    className={`transition-all duration-300 ease-out will-change-transform ${
                      isHydrated 
                        ? (isActive ? 'filter-none' : 'filter blur-[1px]') 
                        : 'filter-none'
                    }`}
                    style={{ 
                      transform: isHydrated 
                        ? `scale(${isActive ? 1 : 0.68})` 
                        : 'scale(1)',
                      opacity: isHydrated 
                        ? (isActive ? 1 : 0.2) 
                        : 1
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative w-full"
                      style={{ paddingBottom: '56.25%' }}
                    >
                      <ProjectImage imageUrl={imageUrl} title={project.title} />
                    </motion.div>
                  </div>
                </div>
              );
            })}
            
            {/* Right spacer to allow last slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72vw)/2)' }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallerySlider;
