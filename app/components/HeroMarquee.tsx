'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import LazyVideo from './LazyVideo';
import Image from 'next/image';
import { PortfolioItem } from '@/lib/contentful';

interface HeroSlide {
  id: string;
  title: string;
  client: string;
  type: 'image' | 'video';
  src: string;
  videoUrl?: string;
  alt?: string;
}

interface HeroMarqueeProps {
  slides: HeroSlide[];
  portfolioItems: PortfolioItem[];
}

const HeroMarquee = ({ slides = [], portfolioItems = [] }: HeroMarqueeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [leftArrowColor, setLeftArrowColor] = useState('#FFFFFF');
  const [rightArrowColor, setRightArrowColor] = useState('#FFFFFF');
  const sliderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftAreaRef = useRef<HTMLDivElement>(null);
  const rightAreaRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  // Convert portfolio items to hero slides format (take first 6)
  const portfolioSlides: HeroSlide[] = portfolioItems
    .filter(item => item.thumbnail && item.thumbnail.trim() !== '') // Only include projects with valid thumbnails
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      client: item.artist,
      type: 'video' as const,
      src: item.thumbnail, // Use thumbnail as poster for video
      videoUrl: item.thumbnail, // Use the same video URL for autoplay
      alt: `${item.title} by ${item.artist}`
    }));
  
  const defaultSlides: HeroSlide[] = [
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

  // Use portfolio slides if available, otherwise use Contentful slides, finally fallback to default
  const items = portfolioSlides.length >= 3 ? portfolioSlides : (slides.length > 0 ? slides : defaultSlides);

  // Función para obtener el color complementario (inverso)
  const getComplementaryColor = useCallback((hex: string): string => {
    // Convertir hex a RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Invertir los colores para obtener el complementario
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    
    // Convertir de nuevo a formato hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, []);

  // Función para detectar el color en una posición específica
  const getColorAtPosition = useCallback((
    x: number, 
    y: number, 
    element: HTMLImageElement | HTMLVideoElement,
    width: number,
    height: number
  ): string => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '#FFFFFF'; // Color por defecto si no se puede obtener contexto
    
    // Configurar el tamaño del canvas
    canvas.width = width;
    canvas.height = height;
    
    try {
      // Dibujar la imagen/video en el canvas
      ctx.drawImage(element, 0, 0, width, height);
      
      // Obtener datos de píxel en la posición dada
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      
      // Convertir a formato hex
      const hex = `#${pixelData[0].toString(16).padStart(2, '0')}${pixelData[1].toString(16).padStart(2, '0')}${pixelData[2].toString(16).padStart(2, '0')}`;
      
      return hex;
    } catch (error) {
      console.error('Error al obtener color en posición:', error);
      return '#FFFFFF'; // Color por defecto en caso de error
    }
  }, []);

  // Función para analizar el color de fondo en la posición de cada flecha
  const analyzeArrowBackgrounds = useCallback(() => {
    const currentSlideElement = document.querySelector(`.slide-${currentIndex}`);
    if (!currentSlideElement) return;
    
    // Encontrar la imagen o video actual
    let mediaElement: HTMLImageElement | HTMLVideoElement | null = null;
    
    if (items[currentIndex].type === 'image') {
      mediaElement = currentSlideElement.querySelector('img');
    } else if (items[currentIndex].type === 'video') {
      mediaElement = currentSlideElement.querySelector('video');
    }
    
    if (!mediaElement || !leftAreaRef.current || !rightAreaRef.current) return;
    
    // Obtener dimensiones
    const width = mediaElement.clientWidth || mediaElement.width as number;
    const height = mediaElement.clientHeight || mediaElement.height as number;
    
    // Para imagen/video de tamaño completo, calcular posiciones aproximadas de las flechas
    // Flecha izquierda (25% del ancho)
    const leftArrowX = Math.floor(width * 0.25);
    const leftArrowY = Math.floor(height * 0.5);
    
    // Flecha derecha (75% del ancho)
    const rightArrowX = Math.floor(width * 0.75);
    const rightArrowY = Math.floor(height * 0.5);
    
    // Obtener colores en esas posiciones
    const leftColor = getColorAtPosition(leftArrowX, leftArrowY, mediaElement, width, height);
    const rightColor = getColorAtPosition(rightArrowX, rightArrowY, mediaElement, width, height);
    
    // Establecer colores complementarios para las flechas
    setLeftArrowColor(getComplementaryColor(leftColor));
    setRightArrowColor(getComplementaryColor(rightColor));
  }, [currentIndex, items, getColorAtPosition, getComplementaryColor]);

  // Ejecutar análisis cuando cambia el slide
  useEffect(() => {
    // Esperar a que el DOM se actualice y las imágenes/videos estén cargados
    const timer = setTimeout(() => {
      analyzeArrowBackgrounds();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [analyzeArrowBackgrounds]);

  // Event listener para actualizar colores al redimensionar la ventana
  useEffect(() => {
    const handleResize = () => {
      analyzeArrowBackgrounds();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [analyzeArrowBackgrounds]);

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

  // Touch Events for mobile
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const onTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      isDraggingRef.current = true;
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startXRef.current - currentX;
      
      // Prevent scroll vertical during swipe horizontal
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    };
    
    const onTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const currentX = e.changedTouches[0].clientX;
      const diff = startXRef.current - currentX;
      
      // Change slide if swipe was significant
      if (diff > 50) {
        setCurrentIndex(prev => (prev + 1) % items.length);
      } else if (diff < -50) {
        setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
      }
      
      isDraggingRef.current = false;
    };
    
    slider.addEventListener('touchstart', onTouchStart);
    slider.addEventListener('touchmove', onTouchMove, { passive: false });
    slider.addEventListener('touchend', onTouchEnd);
    
    return () => {
      slider.removeEventListener('touchstart', onTouchStart);
      slider.removeEventListener('touchmove', onTouchMove);
      slider.removeEventListener('touchend', onTouchEnd);
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

  return (
    <section 
      id="hero"
      style={{
        paddingTop: 'var(--navbar-height)',
        paddingBottom: '0.75rem',
        paddingLeft: '0.625rem',
        paddingRight: '0.625rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'auto',
        overflow: 'hidden',
        borderRadius: '0.5rem'
      }}
    >
      {/* Main slider container */}
      <div 
        ref={sliderRef}
        style={{ 
          position: 'relative',
          width: '60px',
          height: '33.75px',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: '0.5rem',
          transform: 'none !important',
          maxWidth: '60px !important',
          maxHeight: '33.75px !important',
          minWidth: '60px !important',
          minHeight: '33.75px !important'
        }}
      >
        {/* Left navigation area */}
        <div 
          ref={leftAreaRef}
          style={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '25%',
            zIndex: 20,
            cursor: 'pointer'
          }}
          onClick={() => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)}
        />

        {/* Right navigation area */}
        <div 
          ref={rightAreaRef}
          style={{ 
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '25%',
            zIndex: 20,
            cursor: 'pointer'
          }}
          onClick={() => setCurrentIndex(prev => (prev + 1) % items.length)}
        />

        {/* Slides container */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${(index - currentIndex) * 60}px)`,
                opacity: index === currentIndex ? 1 : 0,
                pointerEvents: index === currentIndex ? 'auto' : 'none',
                transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease-in-out',
                willChange: 'transform, opacity'
              }}
            >
              {item.type === 'video' ? (
                <div style={{ width: '100%', height: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  {item.videoUrl && item.videoUrl.includes('.mp4') ? (
                    // Native video for MP4 files from Contentful
                    <video
                      src={item.videoUrl}
                      poster={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ borderRadius: '0.5rem' }}
                    />
                  ) : (
                    // LazyVideo for YouTube URLs
                    <LazyVideo 
                      src={item.videoUrl} 
                      poster={item.src}
                      alt={item.alt || ''}
                      className="w-full h-full"
                    />
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative' }}>
                  <Image
                    src={item.src}
                    alt={item.alt || item.title}
                    style={{ objectFit: 'cover' }}
                    fill
                    sizes="60px"
                    priority={index === currentIndex}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onLoad={() => {
                      if (index === currentIndex) {
                        setTimeout(analyzeArrowBackgrounds, 100);
                      }
                    }}
                    onError={(e) => {
                      console.error(`Failed to load hero image: ${item.src}`, e);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation arrows overlay */}
        <button 
          onClick={() => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/30 rounded-full flex items-center justify-center z-10 md:flex"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={leftArrowColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <button 
          onClick={() => setCurrentIndex(prev => (prev + 1) % items.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/30 rounded-full flex items-center justify-center z-10 md:flex"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={rightArrowColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Project metadata below image/video */}
      <div className="flex justify-between items-center h-auto mt-4">
        {/* Project info - Left side */}
        <div className="max-w-[60%] w-full">
          <p className="text-small opacity-70 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{items[currentIndex].client}</p>
          <h2 className="text-p md:h5 lg:h4 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{items[currentIndex].title}</h2>
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
                    ? 'bg-black' 
                    : 'bg-black/30'
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