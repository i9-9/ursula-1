'use client';

import { useEffect, useRef } from 'react';
import { Project } from '@/lib/contentful';

interface UseAssetPreloaderProps {
  projects: Project[];
  preloadCount?: number; // Cuántos proyectos precargar inmediatamente
  isMobile?: boolean; // Si es mobile, no precargar assets de hover
}

export const useAssetPreloader = ({ 
  projects, 
  preloadCount = 6,
  isMobile = false
}: UseAssetPreloaderProps) => {
  const preloadedAssets = useRef(new Set<string>());

  // Función para precargar un video
  const preloadVideo = (url: string) => {
    if (preloadedAssets.current.has(url)) return;
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.muted = true;
    
    // Marcar como precargado cuando los metadatos estén listos
    video.addEventListener('loadedmetadata', () => {
      preloadedAssets.current.add(url);
    });
  };

  // Función para precargar imágenes
  const preloadImages = (urls: string[]) => {
    urls.forEach(url => {
      if (preloadedAssets.current.has(url)) return;
      
      const img = new Image();
      img.onload = () => {
        preloadedAssets.current.add(url);
      };
      img.src = url;
    });
  };

  // Función para precargar un proyecto completo
  const preloadProject = (project: Project) => {
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
  };

  // Efecto para precargar los primeros proyectos
  useEffect(() => {
    if (projects.length === 0 || isMobile) return;

    // Precargar inmediatamente los primeros N proyectos
    const projectsToPreload = projects.slice(0, preloadCount);
    
    projectsToPreload.forEach(project => {
      preloadProject(project);
    });

    console.log(`🚀 Preloading assets for first ${projectsToPreload.length} projects (desktop only)`);
  }, [projects, preloadCount, isMobile]);

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
