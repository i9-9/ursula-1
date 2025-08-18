'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Loader from './Loader';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  const checkMediaReady = useCallback(async (): Promise<boolean> => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[src], video source'));
    const videoPromises = videos.map((video) => {
      return new Promise<void>((resolve) => {
        if (video.readyState >= 3) {
          resolve();
          return;
        }
        const timeout = setTimeout(() => {
          resolve();
        }, 8000);
        const handleReady = () => {
          clearTimeout(timeout);
          resolve();
        };
        video.addEventListener('canplay', handleReady, { once: true });
        video.addEventListener('error', handleReady, { once: true });
        if (video.preload === 'none') {
          video.preload = 'metadata';
        }
      });
    });

    const criticalImages = Array.from(
      document.querySelectorAll<HTMLImageElement>('img[loading="eager"], img:not([loading])')
    ).filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.top < window.innerHeight * 1.5;
    });

    const imagePromises = criticalImages.map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
          return;
        }
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
        setTimeout(() => resolve(), 3000);
      });
    });

    const fontPromise = document.fonts.ready.catch(() => {});

    try {
      await Promise.race([
        Promise.all([...videoPromises, ...imagePromises, fontPromise]),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
      return true;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeClient = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await checkMediaReady();
      if (mounted) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setIsReady(true);
      }
    };

    setIsReady(false);
    initializeClient();
    return () => {
      mounted = false;
    };
  }, [pathname, checkMediaReady]);

  return (
    <>
      <div className={`loader-wrapper ${isReady ? 'loader-hidden' : ''}`} aria-hidden={isReady}>
        <Loader />
      </div>
      <div className={`content-wrapper ${isReady ? 'content-visible' : ''}`} style={{ visibility: isReady ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  );
} 