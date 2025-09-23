'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Project } from '../../lib/contentful';
import { useThemeContext } from './ThemeProvider';
import AnimatedProjectInfo from './AnimatedProjectInfo';

interface VideoPlayerProps {
  project: Project;
  displayTitle: string;
  displayIndex: number;
}

export default function VideoPlayer({ project, displayTitle, displayIndex }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const isDraggingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { theme } = useThemeContext();

  // Ensure component only renders on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Vimeo Player with dynamic import
  useEffect(() => {
    if (!isClient || !project.vimeoId) return;

    const initializePlayer = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { default: Player } = await import('@vimeo/player');
        
        // Wait for DOM to be ready
        const checkIframe = () => {
          if (iframeRef.current) {
            const player = new Player(iframeRef.current);
            playerRef.current = player;
            
            console.log('Vimeo Player initialized');

            player.ready().then(() => {
              console.log('Player ready');
              setIsPlayerReady(true);
              player.getDuration().then((dur) => {
                console.log('Duration:', dur);
                setDuration(dur);
              });
            });

            player.on('play', () => {
              console.log('Playing');
              setIsPlaying(true);
            });
            
            player.on('pause', () => {
              console.log('Paused');
              setIsPlaying(false);
            });
            
            player.on('timeupdate', (data) => {
              console.log('Time update:', data.seconds);
              setCurrentTime(data.seconds);
            });
            
            player.on('loaded', () => {
              console.log('Video loaded');
              player.getDuration().then(setDuration);
            });

            player.on('error', (error) => {
              console.error('Player error:', error);
            });

          } else {
            // Retry if iframe not ready
            setTimeout(checkIframe, 100);
          }
        };

        checkIframe();

      } catch (error) {
        console.error('Error loading Vimeo Player:', error);
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        console.log('Unloading player');
        playerRef.current.unload();
        playerRef.current = null;
        setIsPlayerReady(false);
      }
    };
  }, [isClient, project.vimeoId]);

  // Global mouse up listener para detener el arrastre
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    if (isClient) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isClient]);

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

  const togglePlayPause = () => {
    if (playerRef.current && isPlayerReady) {
      if (isPlaying) {
        console.log('Pausing video');
        playerRef.current.pause();
      } else {
        console.log('Playing video');
        playerRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isPlayerReady) {
      if (isMuted) {
        console.log('Unmuting video');
        playerRef.current.setVolume(1);
        setIsMuted(false);
      } else {
        console.log('Muting video');
        playerRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const updateTimeFromPosition = (clientX: number, element: HTMLDivElement) => {
    if (!playerRef.current || !isPlayerReady || duration === 0) return;
    const rect = element.getBoundingClientRect();
    const posX = clientX - rect.left;
    const percentage = Math.min(Math.max(posX / rect.width, 0), 1);
    const newTime = percentage * duration;
    playerRef.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateTimeFromPosition(e.clientX, e.currentTarget);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      updateTimeFromPosition(e.clientX, e.currentTarget);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseEnter = () => {
    setShowTimeline(true);
  };

  const handleMouseLeave = () => {
    setShowTimeline(false);
  };

  const extractYouTubeId = (url: string): string | null => {
    if (!url || !url.includes('youtu')) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Wrap the entire component logic in a try-catch to prevent crashes
  try {
    return (
      <div className="relative w-screen archive-page-fullscreen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-[1000px] aspect-video bg-black overflow-hidden shadow-2xl">
            {project.vimeoId ? (
              <div 
                className="w-full h-full relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <iframe
                  ref={iframeRef}
                  src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={displayTitle}
                  onError={() => console.error('Error loading Vimeo iframe')}
                />
                
                {/* Timeline mejorado */}
                {showTimeline && isPlayerReady && duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center gap-6">
                      {/* Tiempo actual */}
                      <span className="text-white text-xs font-mono min-w-[40px]">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      {/* Barra de progreso estilo Apple */}
                      <div 
                        className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {/* Progreso transcurrido */}
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-100"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        {/* Indicador circular estilo Apple */}
                        <div 
                          className="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg border border-white/30 scale-75 group-hover:scale-100 transition-transform duration-200"
                          style={{ left: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      
                      {/* Tiempo restante */}
                      <span className="text-white text-xs font-mono min-w-[40px]">
                        -{Math.floor((duration - currentTime) / 60)}:{((duration - currentTime) % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      {/* Botón de mute estilo Apple */}
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-white/80 transition-colors duration-200 cursor-pointer"
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      >
                        {isMuted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : project.videoUrl && extractYouTubeId(project.videoUrl) ? (
              <div 
                className="w-full h-full relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}?autoplay=1&loop=1&mute=0&controls=0&modestbranding=1&rel=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={displayTitle}
                  onError={() => {}}
                />
                
                {/* Timeline para YouTube (simulado) */}
                {showTimeline && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center gap-8">
                      <span className="text-white text-xs font-mono min-w-[40px]">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      <div className="flex-1 h-2 bg-white/20 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                      
                      <span className="text-white text-xs font-mono min-w-[40px]">
                        {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )}
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
        
        <AnimatedProjectInfo project={project} displayIndex={displayIndex} />

        {/* Play/Pause Button - Solo para Vimeo */}
        {project.vimeoId && isPlayerReady && (
          <button
            onClick={togglePlayPause}
            className={`absolute top-4 right-8 z-50 p-3 cursor-pointer transition-all duration-300 ${
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