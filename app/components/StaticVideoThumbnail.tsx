'use client';

import { useState, useRef } from 'react';

interface StaticVideoThumbnailProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const StaticVideoThumbnail = ({ src, poster, alt, className = '', onClick }: StaticVideoThumbnailProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src || src.trim() === '') {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Video no disponible</p>
        </div>
      </div>
    );
  }

  const handleMouseEnter = () => {
    if (videoRef.current && isVideoLoaded) {
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

  // Si tanto src como poster son videos, usar solo el video
  const isVideoFile = (url: string) => {
    return url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('.avi');
  };

  const useVideoAsPoster = isVideoFile(poster) || isVideoFile(src);

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
      {/* Si es un video, mostrar solo el elemento video */}
      {useVideoAsPoster ? (
        <video
          ref={videoRef}
          src={src || poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-auto object-cover"
          data-video-thumbnail="true"
          data-video-ready={isVideoLoaded ? 'true' : 'false'}
          onLoadedData={() => {
            setIsVideoLoaded(true);
            setShowVideo(true);
            if (videoRef.current) {
              videoRef.current.setAttribute('data-video-ready', 'true');
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current && videoRef.current.readyState >= 1) {
              setIsVideoLoaded(true);
              setShowVideo(true);
              videoRef.current.setAttribute('data-video-ready', 'true');
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onError={() => {
            console.error('Error loading video:', src || poster);
            setIsVideoLoaded(false);
            if (videoRef.current) {
              videoRef.current.setAttribute('data-video-ready', 'error');
            }
          }}
        />
      ) : (
        // Si hay una imagen real como poster, usar img normal
        <>
          {!showVideo && poster && !isVideoFile(poster) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={alt}
              className="w-full h-auto object-cover"
              loading="lazy"
              onLoad={() => console.log('Image loaded:', poster)}
              onError={() => console.error('Error loading image:', poster)}
            />
          )}
          
          <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            preload="metadata"
            className={`w-full h-auto object-cover ${showVideo ? 'block' : 'hidden'}`}
            data-video-thumbnail="true"
            data-video-ready={isVideoLoaded ? 'true' : 'false'}
            onLoadedData={() => {
              setIsVideoLoaded(true);
              setShowVideo(true);
              if (videoRef.current) {
                videoRef.current.setAttribute('data-video-ready', 'true');
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
            onError={() => {
              setIsVideoLoaded(false);
              if (videoRef.current) {
                videoRef.current.setAttribute('data-video-ready', 'error');
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default StaticVideoThumbnail;