'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyAutoplayVideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}

const LazyAutoplayVideo = ({ src, poster, alt, className = '' }: LazyAutoplayVideoProps) => {
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Don't render if no src or poster
  if (!src || src.trim() === '' || !poster || poster.trim() === '') {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">Video no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {hasIntersected && isPlaying ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Only use Image for actual images, not videos */}
          {poster && !poster.includes('.mp4') && !poster.includes('.mov') && !poster.includes('.webm') ? (
            <Image
              src={poster}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <video
              src={poster}
              muted
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'brightness(0.8)' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LazyAutoplayVideo; 