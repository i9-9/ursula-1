'use client';

import Link from 'next/link';
import { Project } from '@/lib/contentful';
import { generateSemanticSlug } from '@/lib/slug-utils';
import StaticVideoThumbnail from './StaticVideoThumbnail';
import VideoHover from './VideoHover';
import ImageHover from './ImageHover';
import { useLazyHover } from '@/app/hooks/useLazyHover';

interface OptimizedProjectItemProps {
  project: Project;
  index: number;
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
  onPreloadProject: (project: Project) => void;
  getVideoSource: (project: Project) => string;
  isVideoProject: (project: Project) => boolean;
  isImageProject: (project: Project) => boolean;
  isMobile?: boolean;
  showNumber?: boolean;
  showTitle?: boolean;
  projectNumber: string;
  skipContainer?: boolean; // Nueva prop para saltar el contenedor w-3/4
  imageOrientation?: 'portrait' | 'landscape' | 'square'; // Nueva prop para orientación
}

const OptimizedProjectItem = ({
  project,
  index,
  hoveredProject,
  setHoveredProject,
  onPreloadProject,
  getVideoSource,
  isVideoProject,
  isImageProject,
  isMobile = false,
  showNumber = false,
  showTitle = false,
  projectNumber,
  skipContainer = false,
  imageOrientation = 'square'
}: OptimizedProjectItemProps) => {
  
  // Hook para lazy loading con preload al acercarse (solo desktop)
  const {
    elementRef,
    hasApproached,
    handleMouseEnter,
    handleMouseLeave
  } = useLazyHover({
    threshold: isMobile ? 0 : 100, // No lazy loading en mobile
    onApproach: () => {
      // Solo precargar si el proyecto no está en los primeros 6 y no es mobile
      if (index >= 6 && !isMobile) {
        onPreloadProject(project);
      }
    }
  });

  const handleMouseEnterProject = () => {
    setHoveredProject(project.id);
    handleMouseEnter();
  };

  const handleMouseLeaveProject = () => {
    setHoveredProject(null);
    handleMouseLeave();
  };

  // Determinar clases basadas en orientación
  const getImageClasses = () => {
    if (!skipContainer) return 'w-full'; // Mobile mantiene ancho completo
    
    switch(imageOrientation) {
      case 'portrait':
        return 'w-2/3 h-auto'; // 67% del ancho para imágenes verticales (un poco más anchas)
      case 'landscape':
        return 'w-full h-auto'; // 100% del contenedor, altura automática
      default:
        return 'w-5/6 h-auto'; // 83% del contenedor, alineado a la izquierda (sin mx-auto)
    }
  };

  // Si skipContainer es true, renderizar solo el contenido sin contenedores adicionales
  if (skipContainer) {
    return (
      <div className={`relative ${getImageClasses()}`}>
        <Link
          ref={elementRef}
          href={`/work/${generateSemanticSlug(project.title, project.artist)}`}
          className={`group relative ${
            index % 4 === 0 ? 'section-title section-title-delay-1' : 
            index % 4 === 1 ? 'section-title section-title-delay-2' : 
            index % 4 === 2 ? 'section-title section-title-delay-3' : 'section-title section-title-delay-4'
          }`}
          aria-label={`Ver ${project.title} by ${project.artist}`}
          role="button"
          tabIndex={0}
          onMouseEnter={handleMouseEnterProject}
          onMouseLeave={handleMouseLeaveProject}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Navegar al proyecto
              window.location.href = `/work/${generateSemanticSlug(project.title, project.artist)}`;
            }
          }}
        >
          <StaticVideoThumbnail
            src={getVideoSource(project)}
            poster={project.thumbnail || ''}
            alt={project.title}
            className="w-full h-auto block"
          />
          
          {/* Overlays: positioned relative to the image container */}
          {!isMobile && (hasApproached || index < 6) && (
            <>
              {/* Video Hover para proyectos de video con videoThumbnail */}
              {isVideoProject(project) && project.videoThumbnail && (
                <VideoHover
                  videoUrl={project.videoThumbnail}
                  isVisible={hoveredProject === project.id}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="absolute inset-0 z-10"
                />
              )}

              {/* Image Hover para proyectos de imagen con múltiples imágenes */}
              {isImageProject(project) && project.images && project.images.length > 0 && (
                <ImageHover
                  images={project.images}
                  hoverImages={project.hoverImages}
                  isVisible={hoveredProject === project.id}
                  projectTitle={`${project.title}, ${project.artist}`}
                  className="absolute inset-0 z-10"
                />
              )}
            </>
          )}
        </Link>
      </div>
    );
  }

  // Renderizado normal con contenedores (para mobile)
  return (
    <Link
      ref={elementRef}
      href={`/work/${generateSemanticSlug(project.title, project.artist)}`}
      className={`group relative ${
        index % 4 === 0 ? 'section-title section-title-delay-1' : 
        index % 4 === 1 ? 'section-title section-title-delay-2' : 
        index % 4 === 2 ? 'section-title section-title-delay-3' : 'section-title section-title-delay-4'
      }`}
      aria-label={`Ver ${project.title} by ${project.artist}`}
      role="button"
      tabIndex={0}
      onMouseEnter={handleMouseEnterProject}
      onMouseLeave={handleMouseLeaveProject}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Navegar al proyecto
          window.location.href = `/work/${generateSemanticSlug(project.title, project.artist)}`;
        }
      }}
    >
      {/* Project container */}
      <div className="relative">
        
        {/* Media box (define la altura de la celda) */}
        <div className="relative w-full flex justify-center">
          <div className={`relative ${isMobile ? 'w-11/12 max-w-[320px]' : 'w-3/4 max-w-[240px]'}`}>
            <StaticVideoThumbnail
              src={getVideoSource(project)}
              poster={project.thumbnail || ''}
              alt={project.title}
              className="w-full h-auto block"
            />
            
            {/* Número y título manejados en el componente padre para desktop */}
            {isMobile && (
              <>
                {/* Número - solo en mobile */}
                {showNumber && (
                  <div className="absolute z-20 -top-6 right-0">
                    <span className="font-normal text-foreground text-[11px]">
                      {projectNumber}
                    </span>
                  </div>
                )}

                {/* Título - solo en mobile */}
                {showTitle && (
                  <div className="absolute left-0 z-20 w-full top-full mt-4">
                    <p className="font-normal uppercase tracking-wide text-foreground text-left leading-tight text-[14px]">
                      {project.title}, {project.artist}
                    </p>
                  </div>
                )}
              </>
            )}
            
            {/* Overlays: positioned relative to the image container */}
            {!isMobile && (hasApproached || index < 6) && (
              <>
                {/* Video Hover para proyectos de video con videoThumbnail */}
                {isVideoProject(project) && project.videoThumbnail && (
                  <VideoHover
                    videoUrl={project.videoThumbnail}
                    isVisible={hoveredProject === project.id}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    className="absolute inset-0 z-10"
                  />
                )}

                {/* Image Hover para proyectos de imagen con múltiples imágenes */}
                {isImageProject(project) && project.images && project.images.length > 0 && (
                  <ImageHover
                    images={project.images}
                    hoverImages={project.hoverImages}
                    isVisible={hoveredProject === project.id}
                    projectTitle={`${project.title}, ${project.artist}`}
                    className="absolute inset-0 z-10"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OptimizedProjectItem;