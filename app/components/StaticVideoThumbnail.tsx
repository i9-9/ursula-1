'use client';
import React from 'react';
import { useOptimizedMedia } from '@/app/hooks/useOptimizedMedia';
import Image from 'next/image';

type Props = {
  src?: string;
  poster?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  preload?: boolean;
  isPreloaded?: boolean; // Nuevo: indica si el asset ya fue precargado masivamente
};

export default function StaticVideoThumbnail({ 
  src, 
  poster, 
  alt = '', 
  className = '', 
  onClick,
  preload = false,
  isPreloaded = false
}: Props) {
  const { optimizedSrc, shouldPreload, handleLoad, handleError } = useOptimizedMedia({
    src: src || poster,
    preload,
    isPreloaded
  });

  const isVideo = !!(optimizedSrc && optimizedSrc.match(/\.(mp4|webm|mov|ogg)$/i));

  if (!optimizedSrc) {
    return (
      <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 text-sm">Media no disponible</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
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
}