'use client';

import { useState, useEffect, useRef } from 'react';
import LazyVideo from './LazyVideo';
import Image from 'next/image';
import { HeroSlide } from '@/lib/contentful';

interface HeroMarqueeProps {
  slides: HeroSlide[];
}

const HeroMarquee = ({ slides = [] }: HeroMarqueeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  const items: HeroSlide[] = slides.length > 0 ? slides : [
    { 
      id: '1', 
      src: '/images/hero/chita - sola.png', 
      alt: 'Chita - Sola', 
      title: 'SOLA',
      client: 'CHITA',
      type: 'image'
    },
    { 
      id: '2', 
      src: '/images/hero/saramalacara - mas feliz.png', 
      alt: 'Sara Malacara - Más Feliz', 
      title: 'MÁS FELIZ',
      client: 'SARA MALACARA',
      type: 'image'
    },
    { 
      id: '3', 
      src: '/images/hero/swaggerboys & dillom - el morocho, el rubio y el colo.png', 
      alt: 'Swagger Boys & Dillom - El Morocho, El Rubio y El Colo', 
      title: 'EL MOROCHO, EL RUBIO Y EL COLO',
      client: 'SWAGGER BOYS & DILLOM',
      type: 'image'
    },
  ];

  // Auto-advance slides every 7 seconds if not paused
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying, items.length]);

  // Manejar el desplazamiento horizontal con rueda del ratón
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Solo interceptar el scroll horizontal o cuando la tecla shift esté presionada
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        
        // Determinar dirección de desplazamiento
        if (e.deltaX > 30 || (e.shiftKey && e.deltaY > 30)) {
          setCurrentIndex(prev => (prev + 1) % items.length);
        } else if (e.deltaX < -30 || (e.shiftKey && e.deltaY < -30)) {
          setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
        }
      }
      // Si es scroll vertical normal (sin shift), no hacemos nada y el navegador maneja el scroll
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (slider) {
        slider.removeEventListener('wheel', handleWheel);
      }
    };
  }, [items.length]);

  // Manejar eventos touch para deslizar en móviles
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      isDraggingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startXRef.current - currentX;
      
      // Prevenir scroll vertical durante swipe horizontal significativo
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const currentX = e.changedTouches[0].clientX;
      const diff = startXRef.current - currentX;
      
      // Cambiar slide si el swipe fue significativo
      if (diff > 50) {
        setCurrentIndex(prev => (prev + 1) % items.length);
      } else if (diff < -50) {
        setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
      }
      
      isDraggingRef.current = false;
    };

    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd);

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, [items.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? items.length - 1 : prevIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items.length]);

  // Función para ir al slide anterior
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  // Función para ir al siguiente slide
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <section 
      id="hero"
      className="pt-[calc(var(--navbar-height)+2.5rem)] pb-6 px-[30px] flex flex-col justify-between h-[calc(100vh-var(--navbar-height)-2rem)]"
    >
      <div className="flex-grow flex items-center justify-center">
        <div 
          className="w-full h-[65vh] relative cursor-grab"
          ref={sliderRef}
        >
          <div 
            className="h-full w-full flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="w-full h-full flex-shrink-0 flex items-center justify-center"
              >
                {item.type === 'video' ? (
                  <LazyVideo
                    src={item.videoUrl}
                    poster={item.src}
                    alt={item.alt}
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority={currentIndex === index}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Flechas de navegación overlay */}
          <button 
            onClick={goToPrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 hidden md:flex"
            aria-label="Slide anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            onClick={goToNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 hidden md:flex"
            aria-label="Siguiente slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project metadata below image/video */}
      <div className="flex justify-between items-center h-auto mt-4">
        {/* Project info - Left side */}
        <div className="max-w-[60%] w-full">
          <p className="text-small tracking-wide opacity-70 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{items[currentIndex].client}</p>
          <h2 className="text-p md:h5 lg:h4 tracking-wider font-medium whitespace-nowrap overflow-hidden text-ellipsis">{items[currentIndex].title}</h2>
        </div>
        
        {/* Contenedor de navegación - Derecha */}
        <div className="flex items-center gap-4 min-w-[40%] justify-end">
          {/* Botón de pausa/play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label={isPlaying ? "Pausar slider" : "Reanudar slider"}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="3" height="8" fill="currentColor"/>
                <rect x="7" y="2" width="3" height="8" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2L10 6L4 10V2Z" fill="currentColor"/>
              </svg>
            )}
          </button>

          {/* Indicadores de navegación */}
          <div className="flex items-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-foreground' 
                    : 'bg-foreground/30'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Indicador de numeración */}
          <div className="text-xs opacity-60">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMarquee; 