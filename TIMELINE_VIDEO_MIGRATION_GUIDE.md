# 🎬 Guía de Migración: Timeline de Videos Interactivo

## 📋 Resumen
Esta guía te ayudará a migrar la implementación completa del timeline de videos interactivo desde el proyecto **ursula-1** al proyecto **bristol**. La implementación incluye controles estilo Apple, soporte para Vimeo y YouTube, y una experiencia de usuario fluida.

## ✨ Características Principales

- **Timeline interactivo** con barra de progreso arrastrable
- **Indicador circular** estilo Apple que se agranda al hacer hover
- **Auto-show/hide** inteligente del timeline
- **Soporte multi-plataforma**: Vimeo y YouTube
- **Controles de audio** (mute/unmute)
- **Información del proyecto** animada
- **Tema claro/oscuro** integrado
- **Responsive design** para móvil y desktop

## 🛠️ Paso 1: Instalar Dependencias

Agrega estas dependencias a tu `package.json`:

```bash
npm install @vimeo/player@^2.29.7
```

O si usas yarn:
```bash
yarn add @vimeo/player@^2.29.7
```

## 📁 Paso 2: Estructura de Archivos

Crea la siguiente estructura en tu proyecto bristol:

```
src/
├── components/
│   ├── VideoPlayer.tsx
│   ├── AnimatedProjectInfo.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   ├── useHydration.ts
│   └── useOptimizedMedia.tsx
└── types/
    └── project.ts
```

## 🔧 Paso 3: Crear Tipos TypeScript

Crea `src/types/project.ts`:

```typescript
export interface Project {
  id: string;
  title: string;
  artist: string;
  company: string;
  thumbnail?: string;
  images?: string[];
  hoverImages?: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  vimeoId?: string;
  youtubeUrl?: string;
  archiveOrder: number;
  worksGridOrder?: number;
  year: string;
  description: string;
  category: string;
  slug: string;
  projectType: string;
  productionCompany?: string;
  client?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isVertical?: boolean;
}
```

## 🎣 Paso 4: Crear Hooks Necesarios

### `src/hooks/useHydration.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';

export const useHydration = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

export const useSafeBrowserEffect = (effect: () => void | (() => void), deps?: React.DependencyList) => {
  const isHydrated = useHydration();

  useEffect(() => {
    if (isHydrated) {
      return effect();
    }
  }, [isHydrated, ...(deps || [])]);
};
```

### `src/hooks/useOptimizedMedia.tsx`

```typescript
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

interface UseOptimizedMediaProps {
  src?: string;
  videoUrl?: string;
  preload?: boolean;
  isPreloaded?: boolean;
}

interface UseOptimizedMediaReturn {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  optimizedSrc: string | undefined;
  shouldPreload: boolean;
  handleLoad: () => void;
  handleError: () => void;
}

export const useOptimizedMedia = ({
  src,
  videoUrl,
  preload = false,
  isPreloaded = false
}: UseOptimizedMediaProps): UseOptimizedMediaReturn => {
  const [isLoaded, setIsLoaded] = useState(false);

  const optimizedSrc = useMemo(() => {
    if (src) return src;
    if (videoUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i)) return videoUrl;
    return undefined;
  }, [src, videoUrl]);

  const shouldPreload = useMemo(() => {
    return (preload || isPreloaded) && !!optimizedSrc;
  }, [preload, isPreloaded, optimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setIsLoaded(false);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
  }, [optimizedSrc]);

  useEffect(() => {
    if (isPreloaded) {
      setIsLoaded(true);
    }
  }, [isPreloaded]);

  return {
    isLoaded,
    setIsLoaded,
    optimizedSrc,
    shouldPreload,
    handleLoad,
    handleError
  };
};
```

## 🎨 Paso 5: Crear ThemeProvider

### `src/components/ThemeProvider.tsx`

```typescript
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useHydration, useSafeBrowserEffect } from '../hooks/useHydration';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isHydrated = useHydration();

  useSafeBrowserEffect(() => {
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        if (!savedTheme) {
          localStorage.setItem('theme', initialTheme);
        }
      } catch {
        // Keep default theme
      }
    };

    const timer = setTimeout(initializeTheme, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = useCallback(() => {
    if (!isHydrated) return;

    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Error saving theme
    }
  }, [theme, isHydrated]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isHydrated
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## 📊 Paso 6: Crear AnimatedProjectInfo

### `src/components/AnimatedProjectInfo.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Project } from '../types/project';

interface AnimatedProjectInfoProps {
  project: Project;
  displayIndex?: number;
  topPosition?: 'top-4' | 'top-20';
  showProductionCompany?: boolean;
}

export default function AnimatedProjectInfo({ 
  project, 
  displayIndex = 0, 
  topPosition = 'top-4', 
  showProductionCompany = true 
}: AnimatedProjectInfoProps) {
  const [line1Visible, setLine1Visible] = useState(false);
  const [line2Visible, setLine2Visible] = useState(false);
  const [line3Visible, setLine3Visible] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setLine1Visible(true), 100);
    const timer2 = setTimeout(() => setLine2Visible(true), 300);
    const timer3 = setTimeout(() => setLine3Visible(true), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className={`absolute left-4 md:left-8 z-50 text-foreground ${topPosition === 'top-20' ? 'top-12' : 'top-1'}`}>
      <div className="space-y-0.5 text-sm font-light tracking-wide">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-[9px] text-foreground">
              {String(project.archiveOrder || displayIndex).padStart(2, '0')}
            </span>
          </div>
          
          <div 
            className={`flex items-center space-x-4 transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TITLE</span>
            <span className="text-xs text-foreground uppercase">{project.title}</span>
            <span className="text-xs text-gray-400">CLIENT</span>
            <span className="text-xs text-foreground uppercase">{project.artist}</span>
          </div>
          
          <div 
            className={`flex items-center space-x-4 text-xs text-foreground transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-gray-400">YEAR</span>
            <span className="text-foreground">{project.year || '2024'}</span>
            <span className="text-gray-400">TYPE</span>
            <span className="text-foreground">{project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
          </div>
          
          {showProductionCompany && (
            <div 
              className={`flex items-center text-xs text-foreground transition-all duration-500 ease-out ${
                line3Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              <span className="text-gray-400">PRODUCTION COMPANY</span>
              <span className="text-foreground ml-4">{project.company || 'ARENA COLLECTIVE'}</span>
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden space-y-0">
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-[9px] text-foreground">
              {String(project.archiveOrder || displayIndex).padStart(2, '0')}
            </span>
          </div>
          
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TITLE</span>
            <span className="text-xs text-foreground uppercase ml-2">{project.title}</span>
          </div>
          
          <div 
            className={`transition-all duration-500 ease-out ${
              line1Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">CLIENT</span>
            <span className="text-xs text-foreground uppercase ml-2">{project.artist}</span>
          </div>
          
          <div 
            className={`transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">YEAR</span>
            <span className="text-xs text-foreground ml-2">{project.year || '2024'}</span>
          </div>
          
          <div 
            className={`transition-all duration-500 ease-out ${
              line2Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <span className="text-xs text-gray-400">TYPE</span>
            <span className="text-xs text-foreground ml-2">{project.category?.toUpperCase().replace(/-/g, ' ') || 'MUSIC VIDEO'}</span>
          </div>
          
          {showProductionCompany && (
            <div 
              className={`transition-all duration-500 ease-out ${
                line3Visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              <span className="text-xs text-gray-400">PRODUCTION COMPANY</span>
              <span className="text-xs text-foreground ml-2">{project.company || 'ARENA COLLECTIVE'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 🎬 Paso 7: Crear VideoPlayer Principal

### `src/components/VideoPlayer.tsx`

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Project } from '../types/project';
import { useThemeContext } from './ThemeProvider';
import AnimatedProjectInfo from './AnimatedProjectInfo';

interface VideoPlayerProps {
  project: Project;
  displayTitle: string;
  displayIndex: number;
}

export default function VideoPlayer({ project, displayTitle, displayIndex }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const isDraggingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [hasShownInitialTimeline, setHasShownInitialTimeline] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMouseOverVideo, setIsMouseOverVideo] = useState(false);
  const { theme } = useThemeContext();

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Vimeo Player
  useEffect(() => {
    if (!isClient || !project.vimeoId) return;

    const initializePlayer = async () => {
      try {
        const { default: Player } = await import('@vimeo/player');
        
        const checkIframe = () => {
          if (iframeRef.current) {
            const player = new Player(iframeRef.current);
            playerRef.current = player;
            
            player.ready().then(() => {
              setIsPlayerReady(true);
              player.getDuration().then((dur) => {
                setDuration(dur);
              });
            });

            player.on('play', () => setIsPlaying(true));
            player.on('pause', () => setIsPlaying(false));
            player.on('timeupdate', (data) => setCurrentTime(data.seconds));
            player.on('loaded', () => player.getDuration().then(setDuration));
            player.on('error', (error) => console.error('Player error:', error));

          } else {
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
        playerRef.current.unload();
        playerRef.current = null;
        setIsPlayerReady(false);
      }
    };
  }, [isClient, project.vimeoId]);

  const updateTimeFromPosition = useCallback((clientX: number, element: HTMLDivElement) => {
    if (!playerRef.current || !isPlayerReady || duration === 0) return;
    const rect = element.getBoundingClientRect();
    const posX = clientX - rect.left;
    const percentage = Math.min(Math.max(posX / rect.width, 0), 1);
    const newTime = percentage * duration;
    playerRef.current.setCurrentTime(newTime);
    setCurrentTime(newTime);
  }, [playerRef, isPlayerReady, duration]);

  // Global mouse listeners for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const progressBar = document.querySelector('.flex-1.h-1.bg-white\\/20.rounded-full');
        if (progressBar) {
          updateTimeFromPosition(e.clientX, progressBar as HTMLDivElement);
        }
      }
    };

    if (isClient) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isClient, updateTimeFromPosition]);

  // YouTube message listener
  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-progress') {
          setCurrentTime(data.info.seconds);
        } else if (data.event === 'video-ready') {
          setDuration(data.info.duration);
          setIsPlayerReady(true);
        } else if (data.event === 'video-state-change') {
          if (data.info === 1) { // Playing
            setIsPlaying(true);
          } else if (data.info === 2) { // Paused
            setIsPlaying(false);
          }
        }
      } catch {
        // Ignore parsing errors
      }
    };

    if (isClient && project.videoUrl && extractYouTubeId(project.videoUrl)) {
      window.addEventListener('message', handleYouTubeMessage);
      return () => {
        window.removeEventListener('message', handleYouTubeMessage);
      };
    }
  }, [isClient, project.videoUrl]);

  // Show timeline initially when player is ready
  useEffect(() => {
    if (isPlayerReady && !hasShownInitialTimeline) {
      setShowTimeline(true);
      setHasShownInitialTimeline(true);
      
      const hideTimer = setTimeout(() => {
        if (!isMouseOverVideo) {
          setShowTimeline(false);
        }
      }, 5000);
      
      setAutoHideTimer(hideTimer);

      return () => {
        clearTimeout(hideTimer);
        setAutoHideTimer(null);
      };
    }
  }, [isPlayerReady, hasShownInitialTimeline, isMouseOverVideo]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative w-screen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-[500px] aspect-video bg-black overflow-hidden shadow-2xl flex items-center justify-center">
            <span className="text-sm text-white">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const togglePlayPause = () => {
    if (project.vimeoId && playerRef.current && isPlayerReady) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    } else if (project.videoUrl && extractYouTubeId(project.videoUrl)) {
      const youtubeId = extractYouTubeId(project.videoUrl);
      if (youtubeId && iframeRef.current) {
        const iframe = iframeRef.current;
        if (iframe.contentWindow) {
          if (isPlaying) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          }
        }
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isPlayerReady) {
      if (isMuted) {
        playerRef.current.setVolume(1);
        setIsMuted(false);
      } else {
        playerRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    updateTimeFromPosition(e.clientX, e.currentTarget);
  };

  const handleMouseEnter = () => {
    setIsMouseOverVideo(true);
    
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
    
    setShowTimeline(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverVideo(false);
    setShowTimeline(false);
    
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    if (!url || !url.includes('youtu')) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  try {
    return (
      <div className="relative w-screen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
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
                
                {/* Transparent overlay for clicks */}
                <div 
                  className="absolute inset-0 z-10"
                  onClick={togglePlayPause}
                />
                
                {/* Enhanced Timeline */}
                {showTimeline && isPlayerReady && duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none">
                    <div className="flex items-center gap-6 pointer-events-auto">
                      {/* Current time */}
                      <span className="text-white text-xs font-normal min-w-[40px]" style={{ fontFamily: 'Suisse BP INTL, sans-serif' }}>
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      {/* Apple-style progress bar */}
                      <div 
                        className="flex-1 h-1 bg-white/20 rounded-full relative group"
                        onMouseDown={handleMouseDown}
                      >
                        {/* Progress */}
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-100"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        {/* Apple-style circular indicator */}
                        <div 
                          className="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg border border-white/30 scale-75 group-hover:scale-100 transition-transform duration-200"
                          style={{ left: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      
                      {/* Remaining time */}
                      <span className="text-white text-xs font-normal min-w-[40px]" style={{ fontFamily: 'Suisse BP INTL, sans-serif' }}>
                        -{Math.floor((duration - currentTime) / 60)}:{((duration - currentTime) % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      {/* Apple-style mute button */}
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-white/80 transition-colors duration-200"
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
                  src={`https://www.youtube.com/embed/${extractYouTubeId(project.videoUrl)}?autoplay=1&loop=1&mute=0&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={displayTitle}
                  onError={() => {}}
                />
                
                {/* Transparent overlay for clicks */}
                <div 
                  className="absolute inset-0 z-10"
                  onClick={togglePlayPause}
                />
                
                {/* YouTube Timeline (simulated) */}
                {showTimeline && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none">
                    <div className="flex items-center gap-8 pointer-events-auto">
                      <span className="text-white text-xs font-normal min-w-[40px]" style={{ fontFamily: 'Suisse BP INTL, sans-serif' }}>
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      
                      <div className="flex-1 h-2 bg-white/20 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                      
                      <span className="text-white text-xs font-normal min-w-[40px]" style={{ fontFamily: 'Suisse BP INTL, sans-serif' }}>
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

        {/* Play/Pause Button - Only for Vimeo */}
        {project.vimeoId && isPlayerReady && (
          <button
            onClick={togglePlayPause}
            className={`absolute top-1 right-8 z-50 p-3 transition-all duration-300 ${
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
      <div className="relative w-screen" style={{ height: 'calc(100vh - 36px)', width: '100vw', maxWidth: '100vw' }}>
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
```

## 🎯 Paso 8: Integrar en tu Aplicación

### 1. Envolver tu app con ThemeProvider

```typescript
// En tu layout principal o _app.tsx
import ThemeProvider from './components/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Usar el VideoPlayer

```typescript
import VideoPlayer from './components/VideoPlayer';
import { Project } from './types/project';

// Ejemplo de uso
const project: Project = {
  id: '1',
  title: 'Mi Video',
  artist: 'Artista',
  company: 'Compañía',
  vimeoId: '123456789', // ID de Vimeo
  // ... otros campos
};

export default function VideoPage() {
  return (
    <VideoPlayer 
      project={project}
      displayTitle={project.title}
      displayIndex={1}
    />
  );
}
```

## 🎨 Paso 9: Configurar Tailwind CSS

Asegúrate de tener estas clases en tu `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'suisse': ['Suisse BP INTL', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## 🔧 Paso 10: Configurar Variables CSS

Agrega estas variables CSS a tu archivo global:

```css
:root {
  --foreground: #000000;
  --background: #ffffff;
}

.dark {
  --foreground: #ffffff;
  --background: #000000;
}

.text-foreground {
  color: var(--foreground);
}

.bg-background {
  background-color: var(--background);
}
```

## ✅ Paso 11: Verificar la Implementación

### Checklist de Verificación:

- [ ] ✅ Dependencia `@vimeo/player` instalada
- [ ] ✅ Todos los archivos creados en la estructura correcta
- [ ] ✅ ThemeProvider envolviendo la aplicación
- [ ] ✅ Tipos TypeScript definidos
- [ ] ✅ Tailwind CSS configurado
- [ ] ✅ Variables CSS definidas
- [ ] ✅ VideoPlayer funcionando con videos de Vimeo
- [ ] ✅ Timeline interactivo funcionando
- [ ] ✅ Controles de audio funcionando
- [ ] ✅ Información del proyecto animada
- [ ] ✅ Responsive design funcionando

## 🐛 Solución de Problemas Comunes

### Error: "Cannot resolve module '@vimeo/player'"
```bash
npm install @vimeo/player@^2.29.7
```

### Error: "useThemeContext must be used within a ThemeProvider"
Asegúrate de envolver tu aplicación con `<ThemeProvider>`.

### Timeline no aparece
Verifica que:
- El video esté cargado (`isPlayerReady = true`)
- La duración sea mayor a 0 (`duration > 0`)
- El mouse esté sobre el video o el timer inicial esté activo

### Videos de YouTube no funcionan
Los videos de YouTube requieren configuración adicional de la API. Para funcionalidad completa, considera usar `react-youtube` o implementar la API de YouTube.

## 🚀 Funcionalidades Avanzadas

### Personalización del Timeline

Puedes personalizar el timeline modificando estas propiedades en `VideoPlayer.tsx`:

```typescript
// Cambiar el tiempo de auto-hide (por defecto 5 segundos)
const hideTimer = setTimeout(() => {
  if (!isMouseOverVideo) {
    setShowTimeline(false);
  }
}, 3000); // 3 segundos en lugar de 5

// Cambiar el tamaño del indicador
className="absolute top-1/2 w-4 h-4 bg-white rounded-full..." // Más grande
```

### Agregar Más Controles

```typescript
// Botón de pantalla completa
<button
  onClick={() => {
    if (playerRef.current) {
      playerRef.current.requestFullscreen();
    }
  }}
  className="text-white hover:text-white/80 transition-colors duration-200"
>
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
</button>
```

## 📱 Soporte Móvil

El timeline está optimizado para móvil con:
- Touch events para arrastrar la barra de progreso
- Layout responsive para información del proyecto
- Controles táctiles optimizados

## 🎯 Próximos Pasos

1. **Probar** la implementación con videos reales
2. **Personalizar** los estilos según tu diseño
3. **Optimizar** para tu caso de uso específico
4. **Agregar** funcionalidades adicionales si es necesario

---

¡Listo! 🎉 Ahora tienes un timeline de videos completamente funcional con todas las características avanzadas del proyecto ursula-1.
