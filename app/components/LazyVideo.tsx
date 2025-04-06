'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface LazyVideoProps {
  src?: string;
  poster: string;
  alt: string;
  className?: string;
}

const LazyVideo = ({ src, poster, alt, className = '' }: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    // Guardar una referencia al elemento actual para la limpieza
    const currentVideoElement = videoRef.current;
    
    observer.observe(currentVideoElement);
    
    return () => {
      // Usar la referencia almacenada en lugar de videoRef.current
      if (currentVideoElement) {
        observer.unobserve(currentVideoElement);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isInView && videoRef.current && src) {
      // Solo cargamos el video cuando está en la vista
      videoRef.current.src = src;
      videoRef.current.load();
      
      // Guardar una referencia al elemento actual para la limpieza
      const currentVideoElement = videoRef.current;
      
      // Manejamos eventos de carga
      const handleLoadedData = () => setIsLoaded(true);
      currentVideoElement.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        // Usar la referencia almacenada en lugar de videoRef.current
        if (currentVideoElement) {
          currentVideoElement.removeEventListener('loadeddata', handleLoadedData);
        }
      };
    }
  }, [isInView, src]);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {src ? (
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          aria-label={alt}
          preload="metadata"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={poster}
            alt={alt}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      
      {/* Overlay de carga */}
      {!isLoaded && src && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyVideo; 