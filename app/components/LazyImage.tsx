'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  containerClassName?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  aspectRatio?: string;
  fill?: boolean;
  onClick?: () => void;
}

const LazyImage = ({
  src,
  alt,
  priority = false,
  containerClassName = '',
  imageClassName = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 50vw',
  aspectRatio = '16/9',
  fill = false,
  onClick
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Si tiene prioridad o ya está visible, no necesitamos observer
    if (priority) {
      setIsInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // Comenzar a cargar cuando esté a 200px de la ventana
    );
    
    const currentElement = document.getElementById(`lazy-image-${src.replace(/\W/g, '')}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [src, priority]);

  return (
    <div 
      id={`lazy-image-${src.replace(/\W/g, '')}`}
      className={`relative overflow-hidden ${containerClassName}`}
      style={!fill ? { aspectRatio } : undefined}
      onClick={onClick}
    >
      {/* Placeholder de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
      )}
      
      {/* Imagen */}
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          className={`transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${imageClassName}`}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

export default LazyImage; 