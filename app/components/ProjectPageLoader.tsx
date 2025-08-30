'use client';

import { useState } from 'react';
import HomeLoader from './HomeLoader';
import VideoPlayer from './VideoPlayer';
import { Project } from '@/lib/contentful';

interface ProjectPageLoaderProps {
  project: Project;
  currentIndex?: number;
}

export default function ProjectPageLoader({ project, currentIndex = 0 }: ProjectPageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <HomeLoader onLoadingComplete={handleLoadingComplete} />}
      <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Video a pantalla completa con VideoPlayer avanzado */}
        <VideoPlayer
          project={project}
          displayTitle={project.title}
          displayCreator={project.artist}
          displayIndex={currentIndex + 1}
        />
      </div>
    </>
  );
}
