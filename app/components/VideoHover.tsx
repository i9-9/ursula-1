'use client';
import React, { useRef, useEffect } from 'react';

type Props = {
  videoUrl: string;
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

export default function VideoHover({ 
  videoUrl, 
  isVisible, 
  onMouseEnter, 
  onMouseLeave, 
  className = '' 
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reproducir/pausar video basado en visibilidad
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay failed silently
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  // Limpiar al desmontar
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ease-out pointer-events-none z-10 overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden
    >
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full block object-cover"
        style={{ objectPosition: 'center center' }}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          }
        }}
      >
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
      </video>
    </div>
  );
}