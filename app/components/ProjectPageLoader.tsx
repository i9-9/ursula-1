'use client';

import VideoPlayer from './VideoPlayer';
import ProjectGallerySlider from './ProjectGallerySlider';
import Copyright from './Copyright';
import { Project } from '@/lib/contentful';

interface ProjectPageLoaderProps {
  project: Project;
  currentIndex?: number;
}

export default function ProjectPageLoader({ project, currentIndex = 0 }: ProjectPageLoaderProps) {

  // Determinar si el proyecto tiene video o solo imágenes
  const hasVideo = project.vimeoId || project.videoUrl || project.youtubeUrl;
  const hasImages = (project.images && project.images.length > 0) || project.thumbnail;


  return (
    <div className="min-h-screen bg-background">
      {hasVideo ? (
        /* Video a pantalla completa con VideoPlayer avanzado */
        <VideoPlayer
          project={project}
          displayTitle={project.title}
          displayIndex={currentIndex + 1}
        />
      ) : hasImages ? (
        /* Galería de imágenes usando el nuevo slider basado en home */
        <ProjectGallerySlider
          project={project}
        />
      ) : (
        /* Fallback para proyectos sin video ni imágenes */
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg opacity-70">{project.artist}</p>
            <p className="text-sm opacity-50 mt-4">Proyecto sin contenido multimedia</p>
          </div>
        </div>
      )}
      <Copyright />
    </div>
  );
}
