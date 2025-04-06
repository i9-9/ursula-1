'use client';

import { useState, useRef, useEffect } from 'react';

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
    
    observer.observe(videoRef.current);
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isInView && videoRef.current && src) {
      // Solo cargamos el video cuando está en la vista
      videoRef.current.src = src;
      videoRef.current.load();
      
      // Manejamos eventos de carga
      const handleLoadedData = () => setIsLoaded(true);
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoadedData);
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
        <img
          src={poster}
          alt={alt}
          className="w-full h-full object-cover"
        />
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