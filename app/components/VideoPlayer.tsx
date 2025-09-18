'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Project } from '../../lib/contentful';
import { useThemeContext } from './ThemeProvider';

interface VideoPlayerProps {
  project: Project;
  displayTitle: string;
  displayIndex: number;
}

export default function VideoPlayer({ project, displayTitle, displayIndex }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { theme } = useThemeContext();

  // Ensure component only renders on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-[500px] aspect-video bg-black overflow-hidden shadow-2xl flex items-center justify-center">
            <span className="text-sm text-white">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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

    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-[1000px] aspect-video bg-black overflow-hidden shadow-2xl">
            {project.vimeoId ? (
              <div className="w-full h-full">
                <iframe
                  ref={iframeRef}
                  src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=0&loop=1&title=0&byline=0&portrait=0&controls=0&background=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={displayTitle}
                  onError={() => {}}
                />
              </div>
            ) : project.videoUrl && extractYouTubeId(project.videoUrl) ? (
              <div className="w-full h-full">
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}?autoplay=0&loop=1&mute=0&controls=0&modestbranding=1&rel=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={displayTitle}
                  onError={() => {}}
                />
              </div>
            ) : project.thumbnail ? (
              <div className="w-full h-full">
                <Image 
                  src={project.thumbnail}
                  alt={displayTitle}
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-black">
                <div className="text-center">
                  <span className="text-sm block mb-2">No content available</span>
                  <span className="text-xs opacity-75">
                    Project: {project.title} | Artist: {project.artist}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-4 left-8 z-50 text-foreground">
          <div className="space-y-2 text-sm font-light tracking-wide">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-foreground opacity-100">{String(project.archiveOrder || displayIndex).padStart(2, '0')}</span>
              <span className="text-xs text-foreground opacity-100 uppercase">TITLE: {project.title}</span>
              <span className="text-xs text-foreground opacity-100 uppercase">CLIENT: {project.artist}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-foreground opacity-100">
              <span>YEAR: {project.year || '2024'}</span>
              <span>TYPE: {project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
            </div>
            <div className="text-xs text-foreground opacity-100">
              <span>PRODUCTION COMPANY: {project.company || 'ARENA COLLECTIVE'}</span>
            </div>
          </div>
        </div>

        {/* Play/Pause Button - Solo para Vimeo */}
        {project.vimeoId && (
          <button
            onClick={togglePlayPause}
            className={`absolute top-4 right-8 z-50 p-3 transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'text-white hover:text-white/80' 
                : 'text-black hover:text-black/80'
            }`}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        )}
      </div>
    );
  } catch {
    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-[1000px] aspect-video bg-black overflow-hidden shadow-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <span className="text-sm block mb-2">Error loading video</span>
              <span className="text-xs opacity-75">
                Project: {project.title} | Artist: {project.artist}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}