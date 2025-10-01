'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Project } from '@/lib/contentful';

interface UseAssetPreloaderProps {
  projects: Project[];
  preloadCount?: number; // Cuántos proyectos precargar inmediatamente
  isMobile?: boolean; // Si es mobile, no precargar assets de hover
}

export const useAssetPreloader = ({ 
  projects, 
  preloadCount = 3, // Reducido de 6 a 3 para mejor performance
  isMobile = false
}: UseAssetPreloaderProps) => {
  const preloadedAssets = useRef(new Set<string>());

  // Función para precargar un video con optimizaciones
  const preloadVideo = (url: string) => {
    if (preloadedAssets.current.has(url)) return;
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    
    // Marcar como precargado cuando los metadatos estén listos
    video.addEventListener('loadedmetadata', () => {
      preloadedAssets.current.add(url);
    });
    
    // Manejar errores
    video.addEventListener('error', () => {
      preloadedAssets.current.add(url); // Marcar como precargado para evitar reintentos
    });
  };

  // Función para precargar imágenes con Next.js Image
  const preloadImages = (urls: string[]) => {
    urls.forEach(url => {
      if (preloadedAssets.current.has(url)) return;
      
      // Usar Next.js Image para precarga optimizada
      const img = new Image();
      img.onload = () => {
        preloadedAssets.current.add(url);
      };
      img.onerror = () => {
        // Marcar como precargado incluso si hay error para evitar reintentos
        preloadedAssets.current.add(url);
      };
      img.src = url;
      
      // Agregar atributos de optimización
      img.loading = 'eager';
      img.decoding = 'async';
    });
  };

  // Función para precargar un proyecto completo
  const preloadProject = useCallback((project: Project) => {
    // En mobile, no precargar assets de hover para optimizar performance
    if (isMobile) return;
    
    // Precargar video si existe
    if (project.videoThumbnail) {
      preloadVideo(project.videoThumbnail);
    }
    
    // Precargar imágenes si existen (usar hoverImages si están disponibles)
    if (project.hoverImages && project.hoverImages.length > 0) {
      preloadImages(project.hoverImages);
    } else if (project.images && project.images.length > 0) {
      preloadImages(project.images);
    }
  }, [isMobile]);

  // Efecto para precargar los primeros proyectos
  useEffect(() => {
    if (projects.length === 0 || isMobile) return;

    // Precargar inmediatamente los primeros N proyectos
    const projectsToPreload = projects.slice(0, preloadCount);
    
    // Solo mostrar logs en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Preloading ${projectsToPreload.length} projects for instant hover...`);
      
      projectsToPreload.forEach((project, index) => {
        console.log(`📦 Preloading project ${index + 1}: ${project.title}`);
      });
    }
    
    projectsToPreload.forEach(project => {
      preloadProject(project);
    });

  }, [projects, preloadCount, isMobile, preloadProject]);

  // Función para precargar un proyecto específico (para lazy loading)
  const preloadProjectAsync = (project: Project) => {
    requestIdleCallback(() => {
      preloadProject(project);
    });
  };

  return {
    preloadProjectAsync,
    isPreloaded: (url: string) => preloadedAssets.current.has(url)
  };
};
