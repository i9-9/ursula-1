'use client';

import { useState, memo } from 'react';
import { Project } from '@/lib/contentful';
import { useAssetPreloader } from '@/app/hooks/useAssetPreloader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import OptimizedProjectItem from './OptimizedProjectItem';

interface WorksGridProps {
  works: Project[];
}

// Componente memoizado para cada proyecto individual
const ProjectItem = memo(({ 
  project, 
  globalIndex, 
  projectNumber, 
  orientation, 
  hoveredProject, 
  setHoveredProject, 
  preloadProjectAsync, 
  getVideoSource, 
  isVideoProject, 
  isImageProject 
}: {
  project: Project;
  globalIndex: number;
  projectNumber: string;
  orientation: 'portrait' | 'landscape' | 'square';
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
  preloadProjectAsync: (project: Project) => void;
  getVideoSource: (project: Project) => string;
  isVideoProject: (project: Project) => boolean;
  isImageProject: (project: Project) => boolean;
}) => {
  // Debug: Log específico para proyecto 28 - clases CSS
  if (project.archiveOrder === 28) {
    console.log('🎨 CLASES CSS PROYECTO 28:');
    console.log('  - Orientación detectada:', orientation);
    console.log('  - Clases de imagen (OptimizedProjectItem):', 
      orientation === 'portrait' ? 'w-1/2 mx-auto' : 
      orientation === 'landscape' ? 'w-full' : 'w-5/6 mx-auto');
    console.log('  - Clases de número:', 
      orientation === 'portrait' ? 'w-full flex justify-end' : 
      orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end');
    console.log('  - Clases de título:', 
      orientation === 'portrait' ? 'w-1/2' : 
      orientation === 'landscape' ? 'w-full' : 'w-5/6');
    console.log('  - Contenedor principal:', 'w-5/6 max-w-[380px]');
    console.log('  - Altura del contenedor de imagen:', 'h-[300px]');
  }

  return (
    <div key={project.id} className="flex justify-center">
      {/* Contenedor principal - ancho completo en mobile, más ancho en desktop */}
      <div className="relative w-full lg:w-3/4 lg:max-w-[500px]">
        
        {/* Número - alineado con el borde derecho de la imagen */}
        <div className="absolute -top-4 left-0 w-full flex justify-center z-30">
          <div className="w-full lg:w-5/6 flex justify-end">
            <span className="font-normal text-foreground text-[9px]">
              {projectNumber}
            </span>
          </div>
        </div>
        
        {/* Contenedor de imagen con altura fija y centrado vertical */}
        <div className="flex items-center justify-center h-[300px]">
          <OptimizedProjectItem
            project={project}
            index={globalIndex}
            hoveredProject={hoveredProject}
            setHoveredProject={setHoveredProject}
            onPreloadProject={preloadProjectAsync}
            getVideoSource={getVideoSource}
            isVideoProject={isVideoProject}
            isImageProject={isImageProject}
            isMobile={false}
            showNumber={false}
            showTitle={false}
            projectNumber=""
            skipContainer={true}
          />
        </div>
        
        {/* Título - alineado con el borde izquierdo de la imagen */}
        <div className="absolute -bottom-4 left-0 w-full flex justify-center">
          <div className="w-full lg:w-5/6">
            <p className={`font-normal uppercase tracking-wide text-foreground text-left leading-tight text-[12px] transition-opacity duration-300 ${
              hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
            }`}>
              {project.title}, {project.artist}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
});

ProjectItem.displayName = 'ProjectItem';

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
    <section className="py-12 md:py- px-4 md:px-[15px] fade-in">
      <div className="mb-6 md:mb-8">
      </div>
      
      {/* Mobile/Tablet Layout - Vertical Stack with more padding */}
      <div className="lg:hidden space-y-16 px-6">
        {works.map((project, index) => {
          return (
            <div key={project.id} className="flex justify-center">
              <OptimizedProjectItem
                project={project}
                index={index}
                hoveredProject={hoveredProject}
                setHoveredProject={setHoveredProject}
                onPreloadProject={preloadProjectAsync}
                getVideoSource={getVideoSource}
                isVideoProject={isVideoProject}
                isImageProject={isImageProject}
                isMobile={true}
                showNumber={true}
                showTitle={true}
                projectNumber={project.archiveOrder ? project.archiveOrder.toString().padStart(2, '0') : (index + 1).toString().padStart(2, '0')}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop Layout - Contenedor unificado por proyecto */}
      <div className="hidden lg:block px-6">
        {Array.from({ length: Math.ceil(works.length / 4) }, (_, rowIndex) => {
          const startIndex = rowIndex * 4;
          const endIndex = Math.min(startIndex + 4, works.length);
          const projectsInRow = works.slice(startIndex, endIndex);
          
          return (
            <div 
              key={rowIndex} 
              className="grid grid-cols-4 mb-16 gap-8"
            >
              {projectsInRow.map((project, index) => {
                const globalIndex = startIndex + index;
                const projectNumber = project.archiveOrder 
                  ? project.archiveOrder.toString().padStart(2, '0') 
                  : (globalIndex + 1).toString().padStart(2, '0');
                
                // Todos los proyectos usan la misma orientación
                const orientation = 'square';
                
                return (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    globalIndex={globalIndex}
                    projectNumber={projectNumber}
                    orientation={orientation}
                    hoveredProject={hoveredProject}
                    setHoveredProject={setHoveredProject}
                    preloadProjectAsync={preloadProjectAsync}
                    getVideoSource={getVideoSource}
                    isVideoProject={isVideoProject}
                    isImageProject={isImageProject}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorksGrid;