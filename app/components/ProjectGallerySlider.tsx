'use client';

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/contentful';
import { useHydration } from '../hooks/useHydration';

// Componente de imagen optimizado con manejo inteligente de aspect ratios
const ProjectImage = ({ imageUrl, title }: { imageUrl: string; title: string }) => {
  if (!imageUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm">Imagen no disponible</p>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
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
  const isHydrated = useHydration();

  // Memoized images from project
  const images = useMemo((): string[] => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    if (project.thumbnail) {
      return [project.thumbnail];
    }
    return [];
  }, [project.images, project.thumbnail]);

  // Optimized scroll update with proper throttling
  const updateCurrentIndexFromScroll = useCallback(() => {
    // Don't update if we're programmatically scrolling
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
    
    // Only update if the change is significant (avoid micro-adjustments)
    if (closestIndex !== currentIndex && smallestDistance < container.clientWidth / 4) {
      setCurrentIndex(closestIndex);
    }
  }, [currentIndex]);

  // Initial position to center first slide
  useLayoutEffect(() => {
    if (!isHydrated) return;
    
    const container = scrollContainerRef.current;
    if (!container || images.length === 0) return;

    const firstSlide = slideRefs.current[0];
    if (firstSlide) {
      const previousBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';
      firstSlide.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      container.style.scrollBehavior = previousBehavior;
    }
  }, [images.length, isHydrated]);

  // Optimized scroll listener with RAF throttling
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

  // Navigation functions
  const navigateToSlide = (targetIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const targetSlide = slideRefs.current[targetIndex];
    if (targetSlide) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      // Set scrolling flag and update index immediately
      isScrollingRef.current = true;
      setCurrentIndex(targetIndex);
      
      // Scroll to target slide
      targetSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      
      // Reset scrolling flag after animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        // Force one final check to ensure we're on the right slide
        setTimeout(() => {
          if (!isScrollingRef.current) {
            const container = scrollContainerRef.current;
            if (container) {
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
            }
          }
        }, 100);
      }, 800); // Back to longer timeout for stability
    }
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
      {/* Project Info */}
      <div className="absolute top-24 left-8 z-50 text-foreground">
        <div className="space-y-2 text-sm font-light tracking-wide">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-foreground opacity-100">{String(project.archiveOrder || 0).padStart(2, '0')}</span>
            <span className="text-xs text-foreground opacity-100 uppercase">TITLE: {project.title}</span>
            <span className="text-xs text-foreground opacity-100 uppercase">CLIENT: {project.artist}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-foreground opacity-100">
            <span>YEAR: {project.year || '2024'}</span>
            <span>TYPE: {project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
          </div>
          <div className="text-xs text-foreground opacity-100">
            <span>PRODUCTION COMPANY: {project.company || 'ARENA COLLECTIVE'}</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      {images.length > 1 && (
        <div className="absolute top-24 right-8 z-50 flex items-center space-x-4">
          {/* Navigation arrows */}
          <div className="flex items-center -space-x-2">
            <button 
              className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
              aria-label="Previous image"
              onClick={() => {
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                navigateToSlide(prevIndex);
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 5v14l-11-7z"/>
              </svg>
            </button>
            
            <button 
              className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
              aria-label="Next image"
              onClick={() => {
                const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                navigateToSlide(nextIndex);
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full flex items-center justify-center mt-16">
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
              return (
                <div
                  key={`${project.id}-image-${index}`}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className="group flex-shrink-0 snap-center cursor-pointer w-[calc(85vw-2rem)] sm:w-[calc(75vw-2rem)]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${project.title} - Imagen ${index + 1}`}
                  onClick={() => navigateToSlide(index)}
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
      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex space-x-2">
            {images.map((_, index) => (
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