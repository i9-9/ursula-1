'use client';

import { useRef } from 'react';

interface VideoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  vimeoId?: string;
  youtubeUrl?: string;
}

const VideoThumbnail = ({ src, alt, className = '', vimeoId, youtubeUrl }: VideoThumbnailProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Debug logging
  console.log('VideoThumbnail props:', { src, alt, vimeoId, youtubeUrl });

  // Si tenemos Vimeo ID, mostrar thumbnail de Vimeo
  if (vimeoId) {
    console.log(`Loading Vimeo thumbnail for ID: ${vimeoId}`);
    return (
      <div className={`${className} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://vumbnail.com/${vimeoId}_large.jpg`}
          alt={alt}
          className="w-full h-auto"
          onError={(e) => {
            console.log(`Vimeo thumbnail failed for ID: ${vimeoId}, trying alternative...`);
            const target = e.target as HTMLImageElement;
            // Intentar con tamaño diferente
            target.src = `https://vumbnail.com/${vimeoId}.jpg`;
            target.onerror = () => {
              // Si también falla, usar imagen de fallback
              console.log(`Vimeo thumbnail completely failed for ID: ${vimeoId}, using fallback`);
              target.src = '/images/hero/chita-sola.jpg';
            };
          }}
        />
      </div>
    );
  }

  // Si tenemos YouTube URL, mostrar thumbnail de YouTube
  if (youtubeUrl) {
    const videoId = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    if (videoId) {
      return (
        <div className={`${className} relative`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={alt}
            className="w-full h-auto"
            onError={(e) => {
              console.log(`YouTube thumbnail failed for ID: ${videoId}, trying alternative...`);
              const target = e.target as HTMLImageElement;
              // Intentar con tamaño diferente
              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              target.onerror = () => {
                // Si también falla, usar imagen de fallback
                target.src = '/images/hero/chita-sola.jpg';
              };
            }}
          />
        </div>
      );
    }
  }

  // Si es un archivo de video local
  if (src && (src.includes('.mp4') || src.includes('.mov') || src.includes('.avi'))) {
    if (!src || src.trim() === '') {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center p-8`}>
          <p className="text-gray-500 text-sm">Video no disponible</p>
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

    return (
      <div 
        className={`${className} group cursor-pointer`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`Play ${alt}`}
      >
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  // Si es una imagen
  if (src && (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp'))) {
    return (
      <div className={`${className} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
        />
      </div>
    );
  }

  // Si tenemos src pero no es video ni imagen, intentar mostrarlo de todas formas
  if (src && src.trim() !== '') {
    return (
      <div className={`${className} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
          onError={(e) => {
            console.log(`Image failed to load: ${src}, using fallback`);
            const target = e.target as HTMLImageElement;
            target.src = '/images/hero/chita-sola.jpg';
          }}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className={`${className} bg-gray-200 flex items-center justify-center p-8`}>
      <p className="text-gray-500 text-sm">Contenido no disponible</p>
    </div>
  );
};

export default VideoThumbnail;
