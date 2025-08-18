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
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
            className="object-left"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            loading="lazy"
            onLoad={() => {
              // setIsPosterLoaded(true); // This line was removed
            }}
            onError={() => {
              // setIsPosterLoaded(true); // This line was removed
            }}
          />
        ) : (
          <Image
            src={poster}
            alt={alt}
            fill
            className="object-left"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
            onLoad={() => {
              // setIsPosterLoaded(true); // This line was removed
            }}
            onError={() => {
              // setIsPosterLoaded(true); // This line was removed
            }}
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
          preload="metadata"
          className="w-full h-full object-left"
          onLoadedData={() => {
            setIsVideoLoaded(true);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onLoadedMetadata={() => {
            // Additional event to ensure video is ready
            if (videoRef.current && videoRef.current.readyState >= 1) {
              setIsVideoLoaded(true);
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }
          }}
          onError={() => {
            setIsVideoLoaded(false);
          }}
        />
      </div>
    </div>
  );
};

export default StaticVideoThumbnail;
