import { useEffect, useRef, useState } from 'react';
import { useLoading } from '../components/LoadingContext';

interface UseVideoLoaderOptions {
  videos: Array<{ src: string; id: string }>;
  loaderId: string;
  timeout?: number;
  onProgress?: (loaded: number, total: number) => void;
}

export const useVideoLoader = ({ 
  videos, 
  loaderId, 
  timeout = 10000,
  onProgress 
}: UseVideoLoaderOptions) => {
  const { registerLoader, unregisterLoader, setLoaderReady } = useLoading();
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [loadedCount, setLoadedCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (videos.length === 0) {
      setLoadingState('ready');
      return;
    }

    registerLoader(loaderId);
    setLoadingState('loading');
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const loadVideo = async (videoSrc: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        let resolved = false;
        
        const cleanup = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            video.remove();
          }
        };

        const handleSuccess = () => {
          cleanup();
          resolve(true);
        };

        const handleError = () => {
          cleanup();
          console.warn(`⚠️ Failed to load video: ${videoSrc}`);
          resolve(false);
        };

        const handleTimeout = () => {
          cleanup();
          console.warn(`⏱️ Video load timeout: ${videoSrc}`);
          resolve(false);
        };

        // Timeout individual para cada video
        const timeoutId = setTimeout(handleTimeout, timeout);

        // Configurar eventos
        video.addEventListener('loadeddata', handleSuccess, { once: true });
        video.addEventListener('error', handleError, { once: true });

        // Configurar el video
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = videoSrc;
        
        // Iniciar carga
        video.load();
      });
    };

    const loadAllVideos = async () => {
      try {
        let loaded = 0;
        const results = await Promise.all(
          videos.map(async (video) => {
            if (abortController.signal.aborted) return false;
            
            const result = await loadVideo(video.src);
            if (result) {
              loaded++;
              setLoadedCount(loaded);
              if (onProgress) {
                onProgress(loaded, videos.length);
              }
            }
            return result;
          })
        );

        const allLoaded = results.every(r => r);
        
        if (!abortController.signal.aborted) {
          setLoadingState(allLoaded ? 'ready' : 'error');
          setLoaderReady(loaderId);
        }
      } catch (error) {
        console.error('❌ Error loading videos:', error);
        if (!abortController.signal.aborted) {
          setLoadingState('error');
          setLoaderReady(loaderId);
        }
      }
    };

    loadAllVideos();

    return () => {
      abortController.abort();
      unregisterLoader(loaderId);
    };
  }, [videos, loaderId, timeout, registerLoader, unregisterLoader, setLoaderReady, onProgress]);

  return { loadingState, loadedCount, totalCount: videos.length };
};
