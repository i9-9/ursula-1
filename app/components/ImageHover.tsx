'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Props = { 
  images: string[];
  hoverImages?: string[];
  isVisible: boolean; 
  projectTitle: string;
  className?: string;
};

export default function ImageHover({ 
  images, 
  hoverImages, 
  isVisible, 
  projectTitle, 
  className = '' 
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usar imágenes optimizadas para hover si están disponibles, sino usar las normales
  const imagesToUse = hoverImages && hoverImages.length > 0 ? hoverImages : images;

  useEffect(() => {
    if (!isVisible || imagesToUse.length <= 1) return;

    // Usar RAF en lugar de setInterval para mejor performance
    let rafId: number;
    let lastTime = Date.now();
    const interval = 1000; // Cambiar imagen cada segundo

    const animate = () => {
      const now = Date.now();
      if (now - lastTime >= interval) {
        setCurrentImageIndex((prev) => 
          (prev + 1) % imagesToUse.length
        );
        lastTime = now;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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
      <Image 
        src={currentSrc} 
        alt={`${projectTitle} - Image ${currentImageIndex + 1}`} 
        fill
        className="object-cover"
        style={{ objectPosition: 'center center' }}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        quality={85}
      />
    </div>
  );
}