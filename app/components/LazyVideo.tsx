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
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  // Extraer el ID del video de YouTube de la URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {src && isInView ? (
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(src)}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${getYouTubeId(src)}`}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default LazyVideo; 