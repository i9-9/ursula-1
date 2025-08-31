'use client';
import React from 'react';

type Props = {
  src?: string;
  poster?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
};

export default function StaticVideoThumbnail({ src, poster, alt = '', className = '', onClick }: Props) {
  const isVideo = !!(src && src.match(/\.(mp4|webm|mov|ogg)$/i));

  if (!src && !poster) {
    return (
      <div className={`w-full h-48 bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 text-sm">Media no disponible</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className={`w-full h-auto block ${className}`}
        onClick={onClick}
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
    <img
      src={src || poster}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full h-auto block ${className}`}
      onClick={onClick}
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