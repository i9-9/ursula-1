'use client';
import React, { useState, useEffect } from 'react';

type Props = { 
  images: string[];
  hoverImages?: string[];
  isVisible: boolean; 
  projectTitle: string;
  className?: string; 
  fit?: 'contain' | 'cover';
};

export default function ImageHover({ 
  images, 
  hoverImages, 
  isVisible, 
  projectTitle, 
  className = '', 
  fit = 'contain' 
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usar imágenes optimizadas para hover si están disponibles, sino usar las normales
  const imagesToUse = hoverImages && hoverImages.length > 0 ? hoverImages : images;

  useEffect(() => {
    if (!isVisible || imagesToUse.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === imagesToUse.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000); // Cambiar imagen cada segundo

    return () => clearInterval(interval);
  }, [isVisible, imagesToUse.length]);

  if (!imagesToUse.length) return null;

  const currentSrc = imagesToUse[currentImageIndex];
  if (!currentSrc) return null;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ease-out pointer-events-none z-10 overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden
    >
      <img 
        src={currentSrc} 
        alt={`${projectTitle} - Image ${currentImageIndex + 1}`} 
        className="w-full h-full block object-cover"
        style={{ objectPosition: 'center center' }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}