'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useScrollReveal, useTouchFeedback } from '../hooks/useScrollReveal';
import Loader from './Loader';
import { usePathname } from 'next/navigation';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  useScrollReveal();
  useTouchFeedback();

  const [isBlocking, setIsBlocking] = useState(true);
  const hasBootedRef = useRef(false);
  const pathname = usePathname();

  const waitForWorksGridComplete = async () => {
    console.log('🎬 Starting complete WorksGrid wait process...');
    
    // Función para verificar si un video está REALMENTE listo y visible
    const isVideoFullyReady = (video: HTMLVideoElement): boolean => {
      // 1. Verificar que el video tiene datos cargados
      if (video.readyState < 3) return false; // HAVE_FUTURE_DATA
      
      // 2. Verificar que tiene dimensiones reales
      if (video.videoWidth === 0 || video.videoHeight === 0) return false;
      
      // 3. Verificar que está en el viewport o cerca
      const rect = video.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      
      // 4. Verificar que es visible (no está oculto)
      const style = window.getComputedStyle(video);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity) === 0) return false;
      
      // 5. Verificar que el elemento padre también es visible
      let parent = video.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.display === 'none' || 
            parentStyle.visibility === 'hidden' || 
            parseFloat(parentStyle.opacity) === 0) {
          return false;
        }
        parent = parent.parentElement;
      }
      
      // 6. Verificar que tiene un src válido
      if (!video.src && !video.querySelector('source')?.src) return false;
      
      return true;
    };

    // Función mejorada para esperar un video individual
    const waitForSingleVideo = (video: HTMLVideoElement, index: number): Promise<void> => {
      return new Promise((resolve) => {
        const startTime = Date.now();
        const timeout = 15000; // 15 segundos máximo por video
        
        console.log(`📹 [${index}] Waiting for video: ${video.src || 'inline source'}`);
        
        // Si el video ya está completamente listo, resolver inmediatamente
        if (isVideoFullyReady(video)) {
          console.log(`✅ [${index}] Video already ready!`);
          resolve();
          return;
        }

        const checkInterval: NodeJS.Timeout = setInterval(() => {
          if (isVideoFullyReady(video)) {
            complete('✅');
          }
        }, 100);
        const timeoutId: NodeJS.Timeout = setTimeout(() => {
          console.warn(`⏱️ [${index}] Video timeout after ${timeout}ms`);
          complete('⚠️');
        }, timeout);
        
        const cleanup = () => {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          video.removeEventListener('loadeddata', handleLoad);
          video.removeEventListener('loadedmetadata', handleLoad);
          video.removeEventListener('canplay', handleLoad);
          video.removeEventListener('canplaythrough', handleLoad);
          video.removeEventListener('error', handleError);
        };

        const complete = (status: string) => {
          const elapsed = Date.now() - startTime;
          console.log(`${status} [${index}] Video ${status} after ${elapsed}ms`);
          cleanup();
          resolve();
        };

        const handleLoad = () => {
          // No resolver inmediatamente, verificar que esté visible
          console.log(`🔄 [${index}] Video loaded, checking visibility...`);
        };

        const handleError = () => {
          complete('❌');
        };

        // Verificación periódica y timeout ya están configurados arriba

        // Escuchar eventos
        video.addEventListener('loadeddata', handleLoad);
        video.addEventListener('loadedmetadata', handleLoad);
        video.addEventListener('canplay', handleLoad);
        video.addEventListener('canplaythrough', handleLoad);
        video.addEventListener('error', handleError);

        // Forzar la carga si no ha empezado
        if (video.preload === 'none') {
          video.preload = 'metadata';
        }
        
        // Intentar reproducir para forzar carga (muted para evitar errores)
        video.muted = true;
        video.play().catch(() => {
          // Ignorar errores de autoplay, solo queremos forzar la carga
        }).finally(() => {
          video.pause();
        });
      });
    };

    // Función para encontrar todos los videos de WorksGrid
    const findWorksGridVideos = (): HTMLVideoElement[] => {
      // Buscar múltiples selectores posibles
      const selectors = [
        // Selectores específicos de WorksGrid
        'section video',
        '[data-works-grid] video',
        '.works-grid video',
        
        // Selectores de grid
        '.grid video',
        '.md\\:grid video',
        '[class*="grid"] video',
        
        // Selectores de componentes de video
        '[data-video-thumbnail] video',
        '.video-thumbnail video',
        
        // Selectores más genéricos pero dentro de section
        'main section video',
        'section [class*="col"] video'
      ];
      
      const videos = new Set<HTMLVideoElement>();
      
      selectors.forEach(selector => {
        document.querySelectorAll<HTMLVideoElement>(selector).forEach(video => {
          videos.add(video);
        });
      });
      
      return Array.from(videos);
    };

    // Proceso principal de espera
    let attempts = 0;
    const maxAttempts = 100;
    const delayBetweenAttempts = 150; // Aumentado para dar más tiempo a React
    
    while (attempts < maxAttempts) {
      // Esperar que React haga su renderizado
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 50); // Dar tiempo extra para que React pinte
          });
        });
      });
      
      const videos = findWorksGridVideos();
      
      if (videos.length > 0) {
        console.log(`🎯 Found ${videos.length} WorksGrid videos to wait for`);
        
        // Esperar por TODOS los videos en paralelo
        try {
          await Promise.all(
            videos.map((video, index) => waitForSingleVideo(video, index))
          );
          
          // Verificación final: asegurarse de que TODOS están visibles
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const allReady = videos.every(isVideoFullyReady);
          if (allReady) {
            console.log('🎉 All WorksGrid videos are fully loaded and visible!');
            return;
          } else {
            console.log('⚠️ Some videos loaded but not visible yet, continuing...');
          }
        } catch (error) {
          console.error('❌ Error waiting for videos:', error);
        }
      }
      
      // En rutas de works, dar más oportunidades
      const isWorksRoute = pathname === '/' || pathname === '/works' || pathname.includes('work');
      if (isWorksRoute && attempts === 30) {
        console.log('🔍 Still looking for WorksGrid videos... They might be lazy loaded');
      }
      
      await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
      attempts++;
    }
    
    console.warn('⏰ Timeout waiting for WorksGrid videos, proceeding anyway');
  };

  useEffect(() => {
    let cancelled = false;
    
    const boot = async () => {
      setIsBlocking(true);
      console.log('🚀 Starting boot sequence for route:', pathname);
      
      // Esperar carga inicial del documento
      if (!hasBootedRef.current) {
        if (document.readyState !== 'complete') {
          console.log('📄 Waiting for document complete...');
          await new Promise<void>((resolve) => {
            const onLoad = () => resolve();
            window.addEventListener('load', onLoad, { once: true });
          });
        }
        hasBootedRef.current = true;
      }

      // Dar tiempo a React para el renderizado inicial
      console.log('⚛️ Waiting for React to render...');
      await new Promise(resolve => {
        // Múltiples frames para asegurar renderizado completo
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(resolve, 100); // Tiempo extra para renderizado
            });
          });
        });
      });
      
      // Esperar a que los videos estén completamente listos Y visibles
      console.log('🎬 Waiting for videos to be fully ready and visible...');
      await waitForWorksGridComplete();
      
      if (!cancelled) {
        // Delay final para transición suave
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('✨ Everything ready! Showing content...');
        setIsBlocking(false);
      }
    };

    void boot();
    
    return () => { 
      cancelled = true; 
    };
  }, [pathname]);

  return (
    <>
      {isBlocking ? <Loader /> : children}
    </>
  );
} 