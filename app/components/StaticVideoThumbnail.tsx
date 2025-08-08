'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface StaticVideoThumbnailProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const StaticVideoThumbnail = ({ src, poster, alt, className = '', onClick }: StaticVideoThumbnailProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src || src.trim() === '' || !poster || poster.trim() === '') {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">Video no disponible</p>
        </div>
      </div>
    );
  }

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed silently
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const isContentfulVideo = poster.includes('videos.ctfassets.net');

  return (
    <div 
      className={`relative ${className} group cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      aria-label={`Play ${alt}`}
    >
      {/* Poster image until first frame is ready */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isVideoLoaded ? 'opacity-0' : 'opacity-100'
      }`}>
        {isContentfulVideo ? (
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        )}
      </div>

      {/* Paused video showing first frame; plays on hover */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isVideoLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-lg"
          onLoadedData={() => {
            setIsVideoLoaded(true);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onError={() => {
            setIsVideoLoaded(false);
          }}
        />
      </div>

      {/* Hover overlay for better UX */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
    </div>
  );
};

export default StaticVideoThumbnail;
