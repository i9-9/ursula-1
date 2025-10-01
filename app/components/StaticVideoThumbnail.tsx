'use client';
import React, { memo } from 'react';
import { useOptimizedMedia } from '@/app/hooks/useOptimizedMedia';
import { useIntersectionObserver } from '@/app/hooks/useIntersectionObserver';
import Image from 'next/image';

type Props = {
  src?: string;
  poster?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  preload?: boolean;
  isPreloaded?: boolean; // Nuevo: indica si el asset ya fue precargado masivamente
  isMobile?: boolean; // Nuevo: indica si estamos en móvil para lazy loading más agresivo
};

const StaticVideoThumbnail = memo(({ 
  src, 
  poster, 
  alt = '', 
  className = '', 
  onClick,
  preload = false,
  isPreloaded = false,
  isMobile = false
}: Props) => {
  // Usar intersection observer para lazy loading más agresivo en móvil
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: isMobile ? 0.1 : 0.5,
    rootMargin: isMobile ? '100px' : '50px'
  });
  
  const { optimizedSrc, shouldPreload, handleLoad, handleError } = useOptimizedMedia({
    src: src || poster,
    preload: preload || hasIntersected, // Cargar cuando esté visible o cuando se solicite preload
    isPreloaded
  });

  const isVideo = !!(optimizedSrc && optimizedSrc.match(/\.(mp4|webm|mov|ogg)$/i));

  // En móvil, mostrar placeholder hasta que esté visible
  if (!optimizedSrc || (isMobile && !hasIntersected && !shouldPreload)) {
    return (
      <div ref={elementRef as React.RefObject<HTMLDivElement>} className={`w-full h-48 bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 text-sm">Media no disponible</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        ref={elementRef as React.RefObject<HTMLVideoElement>}
        src={optimizedSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload={shouldPreload ? "metadata" : "none"}
        className={`w-full h-auto block ${className}`}
        onClick={onClick}
        onLoadedData={handleLoad}
        onError={handleError}
        aria-hidden
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        } : undefined}
      />
    );
  }

  return (
    <Image
      ref={elementRef as React.RefObject<HTMLImageElement>}
      src={optimizedSrc}
      alt={alt}
      width={400}
      height={300}
      className={`w-full h-auto block ${className}`}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
      loading={shouldPreload ? "eager" : "lazy"}
      decoding="async"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
    />
  );
});

StaticVideoThumbnail.displayName = 'StaticVideoThumbnail';

export default StaticVideoThumbnail;