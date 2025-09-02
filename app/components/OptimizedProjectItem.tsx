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
  isMobile = false
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
      onMouseEnter={handleMouseEnterProject}
      onMouseLeave={handleMouseLeaveProject}
    >
      {/* Project container */}
      <div className="relative">

        
        {/* Media box (define la altura de la celda) */}
        <div className="relative w-full flex justify-center">
          <div className="relative w-3/4 max-w-xs">
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OptimizedProjectItem;
