'use client';

import { memo, useMemo } from 'react';
import { Project } from '@/lib/contentful';
import { generateSemanticSlug } from '@/lib/slug-utils';
import StaticVideoThumbnail from './StaticVideoThumbnail';

interface MobileProjectItemProps {
  project: Project;
  projectNumber: string;
}

// Componente optimizado específicamente para móvil
const MobileProjectItem = memo(({ 
  project, 
  projectNumber 
}: MobileProjectItemProps) => {
  // Memoizar la fuente del video/imagen
  const mediaSource = useMemo(() => {
    if (project.videoUrl && isVideoFile(project.videoUrl)) {
      return project.videoUrl;
    }
    return project.thumbnail || "";
  }, [project.videoUrl, project.thumbnail]);

  return (
    <div className="flex justify-center pb-20">
      <div className="relative w-11/12 max-w-[320px]">
        <a
          href={`/work/${generateSemanticSlug(project.title, project.artist)}`}
          className="group relative section-title"
          aria-label={`Ver ${project.title} by ${project.artist}`}
          role="button"
          tabIndex={0}
        >
          {/* Imagen optimizada para móvil */}
          <StaticVideoThumbnail
            src={mediaSource}
            poster={project.thumbnail || ''}
            alt={project.title}
            isMobile={true}
            className="w-full h-auto block"
          />
          
          {/* Número - solo en mobile */}
          <div className="absolute z-20 -top-6 right-0">
            <span className="font-normal text-foreground text-[11px]">
              {projectNumber}
            </span>
          </div>

          {/* Título - solo en mobile */}
          <div className="absolute left-0 z-20 w-full top-full mt-4">
            <p className="font-normal uppercase tracking-wide text-foreground text-left leading-tight text-[14px]">
              {project.title}, {project.artist}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
});

MobileProjectItem.displayName = 'MobileProjectItem';

// Helper function para detectar archivos de video
const isVideoFile = (url: string) => {
  return url.includes(".mp4") || url.includes(".mov") || url.includes(".webm") || url.includes(".avi");
};

export default MobileProjectItem;
