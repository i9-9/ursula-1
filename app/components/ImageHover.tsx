'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageHoverProps {
  images: string[];
  hoverImages?: string[]; // Imágenes optimizadas para hover
  isVisible: boolean;
  projectTitle: string;
}

const ImageHover = ({ images, hoverImages, isVisible, projectTitle }: ImageHoverProps) => {
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

  if (!isVisible || imagesToUse.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 w-full h-full"
    >
      <img
        src={imagesToUse[currentImageIndex]}
        alt={`${projectTitle} - Image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover"
        style={{ aspectRatio: 'inherit' }}
      />
    </motion.div>
  );
};

export default ImageHover;
