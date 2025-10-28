'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Project } from '../../../lib/contentful';
import { useTheme } from '../../hooks/useTheme';
import { useSequentialAnimation } from '../../hooks/useSequentialAnimation';

interface VideoPlayerProps {
  project: Project;
  displayTitle: string;
  displayCreator: string;
  displayIndex: number;
}

export default function VideoPlayer({ project, displayTitle, displayCreator, displayIndex }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme} = useTheme();

  // Sequential animation for project info sections
  const { getItemAnimationProps } = useSequentialAnimation({
    itemCount: 3, // Three info sections: title/client, year/type, company
    delayBetweenItems: 150,
    initialDelay: 300
  });

  // Wrap the entire component logic in a try-catch to prevent crashes
  try {

    const togglePlayPause = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeWindow = iframe.contentWindow;
        
        if (iframeWindow) {
          iframeWindow.postMessage(
            isPlaying ? '{"method":"pause"}' : '{"method":"play"}',
            'https://player.vimeo.com'
          );
          setIsPlaying(!isPlaying);
        }
      }
    };

    const extractYouTubeId = (url: string): string | null => {
      if (!url || !url.includes('youtu')) return null;
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    };

    // Determinar qué contenido mostrar
    if (project.vimeoId) {
      // Vimeo content
    } else if (project.videoUrl && extractYouTubeId(project.videoUrl)) {
      // YouTube content
    } else if (project.thumbnail) {
      // Image content
    }

    // Log the iframe src that will be used
    if (project.vimeoId) {
      // const vimeoSrc = `https://player.vimeo.com/video/${project.vimeoId}?autoplay=0&loop=1&title=0&byline=0&portrait=0&controls=0&background=1`;
    }

    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: '100vh', width: '100vw', maxWidth: '100vw' }}>
        {project.vimeoId ? (
          <div>
            <div className="absolute top-4 left-4 z-50 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              Vimeo ID: {project.vimeoId}
            </div>
            <iframe
              ref={iframeRef}
              src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=0&loop=1&title=0&byline=0&portrait=0&controls=0&background=1`}
              className="w-screen h-full object-cover"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={displayTitle}
              onError={() => {}}
            />
          </div>
        ) : project.videoUrl && extractYouTubeId(project.videoUrl) ? (
          <div>
            <div className="absolute top-4 left-4 z-50 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              YouTube: {extractYouTubeId(project.videoUrl)}
            </div>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}?autoplay=0&loop=1&mute=0&controls=0&modestbranding=1&rel=0`}
              className="w-screen h-full object-cover"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={displayTitle}
              onError={() => {}}
            />
          </div>
        ) : project.thumbnail ? (
          <div>
            <div className="absolute top-4 left-4 z-50 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
              Thumbnail only
            </div>
            <Image 
              src={project.thumbnail}
              alt={displayTitle}
              fill
              className="object-cover w-screen h-full"
              priority
              style={{ width: '100vw', height: '100%' }}
            />
          </div>
        ) : (
          <div className="w-screen h-full flex items-center justify-center text-white bg-black">
            <div className="text-center">
              <span className="text-sm block mb-2">No content available</span>
              <span className="text-xs opacity-75">
                Project: {project.title} | Artist: {project.artist}
              </span>
            </div>
          </div>
        )}
        
        <div className="absolute top-8 left-8 z-50 text-white md:text-white text-black">
          <div className="space-y-2 text-sm font-light tracking-wide">
            {/* Elemento 1: Número, Título y Cliente */}
            <div {...getItemAnimationProps(0)} className="flex items-center space-x-4">
              <span className="text-xs text-black md:text-white">{String(displayIndex).padStart(2, '0')}</span>
              <span className="text-xs text-black md:text-white uppercase">{displayTitle}</span>
              <span className="text-xs text-black md:text-white uppercase">{displayCreator}</span>
            </div>
            
            {/* Elemento 2: Año y Tipo */}
            <div {...getItemAnimationProps(1)} className="flex items-center space-x-4 text-xs text-black md:text-white">
              <span>YEAR: {project.year || '2024'}</span>
              <span>TYPE: {project.projectType?.toUpperCase() || 'MUSIC VIDEO'}</span>
            </div>
            
            {/* Elemento 3: Compañía de Producción */}
            <div {...getItemAnimationProps(2)} className="text-xs text-black md:text-white">
              <span>PRODUCTION COMPANY: {project.productionCompany || project.company || displayCreator || 'ARENA COLLECTIVE'}</span>
            </div>
          </div>
        </div>
        
        <div className="absolute top-8 right-8 z-10">
          <button 
            className={`transition-colors ${
              theme === 'dark' 
                ? 'text-white hover:text-white/80' 
                : 'text-black hover:text-black/80'
            }`}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: '100vh', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-screen h-full flex items-center justify-center text-white bg-black">
          <span className="text-sm">Error loading video player.</span>
        </div>
      </div>
    );
  }
}
