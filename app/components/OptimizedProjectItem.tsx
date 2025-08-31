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
    isHovering,
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
      href={`/work/${generateSemanticSlug(project.slug, project.title, project.artist)}`}
      className={`group relative transition-all duration-500 hover:scale-105 ${
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
        {/* Project number */}
        <div className="absolute -top-12 right-0 z-10">
          <span className="text-xs font-normal text-foreground">
            {project.archiveOrder ? project.archiveOrder.toString().padStart(2, '0') : (index + 1).toString().padStart(2, '0')}
          </span>
        </div>
        
        {/* Video container */}
        <div className="relative w-full">
          <StaticVideoThumbnail
            src={getVideoSource(project)}
            poster={project.thumbnail || ''}
            alt={project.title}
            className="w-full"
          />
          
          {/* Solo renderizar hovers en desktop y si el proyecto ya se ha "approached" o está en los primeros 6 */}
          {!isMobile && (hasApproached || index < 6) && (
            <>
              {/* Video Hover para proyectos de video con videoThumbnail */}
              {isVideoProject(project) && project.videoThumbnail && (
                <VideoHover
                  videoUrl={project.videoThumbnail}
                  projectTitle={`${project.title}, ${project.artist}`}
                  isVisible={hoveredProject === project.id}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                />
              )}

              {/* Image Hover para proyectos de imagen con múltiples imágenes */}
              {isImageProject(project) && (
                <ImageHover
                  images={project.images!}
                  hoverImages={project.hoverImages}
                  isVisible={hoveredProject === project.id}
                  projectTitle={`${project.title}, ${project.artist}`}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-sm md:text-base font-normal uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.title}, {project.artist}
        </p>
      </div>
    </Link>
  );
};

export default OptimizedProjectItem;
