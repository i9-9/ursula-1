'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with performance enhancements
 * Implements progressive loading, error handling, and accessibility
 * Fixed version that handles width/height requirements properly
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  style,
  onClick,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const imageStyle = useMemo(() => ({
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    ...style
  }), [isLoaded, style]);

  // Fallback for broken images
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={style}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <p className="text-gray-500 text-sm">Imagen no disponible</p>
      </div>
    );
  }

  // Use fill when specified, otherwise use width/height
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      priority={priority}
      quality={quality}
      sizes={sizes}
      style={imageStyle}
      onLoad={handleLoad}
      onError={handleError}
      onClick={onClick}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
};

export default React.memo(OptimizedImage);
