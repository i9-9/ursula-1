'use client';

import { useRef } from 'react';

interface LazyAutoplayVideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}

const LazyAutoplayVideo = ({ src, poster, className = '' }: LazyAutoplayVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
};

export default LazyAutoplayVideo; 