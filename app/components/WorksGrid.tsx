'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Project } from '@/lib/contentful';
import { generateSemanticSlug } from '@/lib/slug-utils';
import StaticVideoThumbnail from './StaticVideoThumbnail';
import { useAssetPreloader } from '@/app/hooks/useAssetPreloader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import OptimizedProjectItem from './OptimizedProjectItem';

interface WorksGridProps {
  works: Project[];
}

const WorksGrid = ({ works = [] }: WorksGridProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  // Detectar si estamos en mobile
  const isMobile = useIsMobile(1024); // lg breakpoint
  
  // Hook para precargar assets críticos (solo en desktop)
  const { preloadProjectAsync } = useAssetPreloader({ 
    projects: works, 
    preloadCount: 6, // Precargar los primeros 6 proyectos
    isMobile: isMobile || false // No precargar en mobile
  });

  // Helper function to get video source
  const getVideoSource = (project: Project) => {
    // Solo usar videoUrl si es una URL de video directa (archivo)
    if (project.videoUrl && isVideoFile(project.videoUrl)) {
      return project.videoUrl;
    }
    
    // No usar vimeoId o youtubeUrl como src para el elemento video
    // Estos necesitan ser manejados de manera diferente
    
    // Default to thumbnail
    return project.thumbnail || '';
  };

  // Helper function to check if URL is a direct video file
  const isVideoFile = (url: string) => {
    return url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('.avi');
  };

  // Helper function to determine if project is a video project
  const isVideoProject = (project: Project) => {
    return !!(project.videoUrl || project.vimeoId || project.youtubeUrl || project.videoThumbnail);
  };

  // Helper function to determine if project is an image project
  const isImageProject = (project: Project) => {
    return !!(project.images && project.images.length > 0);
  };

  // Si no hay proyectos de Contentful, mostrar mensaje o componente vacío
  if (works.length === 0) {
    return (
      <section className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in">
        <div className="text-center py-12">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-[15px] fade-in">
      <div className="mb-6 md:mb-8">
      </div>
      
      {/* Mobile/Tablet Layout - Vertical Stack with more padding */}
      <div className="lg:hidden space-y-16 px-6">
        {works.map((project, index) => {
          return (
            <Link
              href={`/work/${generateSemanticSlug(project.title || '', project.artist || '')}`}
              key={project.id}
              className="block cursor-pointer group relative"
              aria-label={`Ver ${project.title} by ${project.artist}`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project container for mobile/tablet - same structure as desktop */}
              <div className="flex flex-col justify-between min-h-0">
                {/* Project number - positioned consistently with desktop */}
                <div className="flex justify-end mb-3 flex-shrink-0">
                  <span className="text-xs font-normal text-foreground">
                    {project.archiveOrder ? project.archiveOrder.toString().padStart(2, '0') : (index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                
                {/* Thumbnail container - centered like desktop */}
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <div className="relative w-full max-w-sm mx-auto">
                    <StaticVideoThumbnail
                      src={getVideoSource(project)}
                      poster={project.thumbnail || ''}
                      alt={project.title}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                {/* Title - same positioning as desktop */}
                <div className="mt-3 flex-shrink-0">
                  <p className="text-sm md:text-base font-normal uppercase tracking-wide text-foreground">
                    {project.title}, {project.artist}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop Layout - Grid (only on large screens) */}
      <div 
        className="hidden lg:grid w-full grid-cols-4 gap-x-12 gap-y-20 mx-auto"
        style={{ gridAutoRows: '1fr' }}
        role="grid"
        aria-label="Projects grid"
      >
        {works.map((project, index) => (
          <div key={project.id} className="flex flex-col justify-between min-h-0">
            {/* Número arriba */}
            <div className="flex justify-end mb-3 flex-shrink-0">
              <span className="text-xs font-normal text-foreground">
                {project.archiveOrder ? project.archiveOrder.toString().padStart(2, '0') : (index + 1).toString().padStart(2, '0')}
              </span>
            </div>
            
            {/* Thumbnail - área flexible */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <OptimizedProjectItem
                project={project}
                index={index}
                hoveredProject={hoveredProject}
                setHoveredProject={setHoveredProject}
                onPreloadProject={preloadProjectAsync}
                getVideoSource={getVideoSource}
                isVideoProject={isVideoProject}
                isImageProject={isImageProject}
                isMobile={isMobile || false}
              />
            </div>
            
                    {/* Título abajo de la imagen - solo visible en hover */}
        <div className="mt-3 flex-shrink-0">
          <p className={`text-sm md:text-base font-normal uppercase tracking-wide transition-opacity duration-300 text-foreground ${
            hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
          }`}>
            {project.title}, {project.artist}
          </p>
        </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorksGrid;