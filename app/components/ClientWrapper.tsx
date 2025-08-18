'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useScrollReveal, useTouchFeedback } from '../hooks/useScrollReveal';
import Loader from './Loader';
import { usePathname } from 'next/navigation';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Activar los hooks de animación
  useScrollReveal();
  useTouchFeedback();

  const [isBlocking, setIsBlocking] = useState(true);
  const hasBootedRef = useRef(false);
  const pathname = usePathname();

  const waitForMediaReady = async (timeoutMs = 8000) => {
    // Poll for media presence briefly to allow dynamic mounts
    let elements: Array<HTMLVideoElement | HTMLIFrameElement | HTMLImageElement> = [];
    const pollStart = performance.now();
    while (performance.now() - pollStart < 1200) {
      elements = Array.from(
        document.querySelectorAll<HTMLVideoElement | HTMLIFrameElement | HTMLImageElement>(
          'video, iframe, img'
        )
      );
      if (elements.length > 0) break;
      // wait a frame
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    }

    if (elements.length === 0) {
      return;
    }

    const isInViewport = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    const visible = elements.filter(isInViewport);
    const candidates = (visible.length > 0 ? visible : elements).slice(0, 4);

    const makeElementPromise = (el: HTMLVideoElement | HTMLIFrameElement | HTMLImageElement) => {
      return new Promise<void>((resolve) => {
        // Videos
        if (el instanceof HTMLVideoElement) {
          if (el.readyState >= 3) {
            resolve();
            return;
          }
          const onLoaded = () => {
            cleanup();
            resolve();
          };
          const cleanup = () => {
            el.removeEventListener('loadeddata', onLoaded);
            el.removeEventListener('canplay', onLoaded);
            el.removeEventListener('canplaythrough', onLoaded);
          };
          el.addEventListener('loadeddata', onLoaded, { once: true });
          el.addEventListener('canplay', onLoaded, { once: true });
          el.addEventListener('canplaythrough', onLoaded, { once: true });
          return;
        }
        // Images
        if (el instanceof HTMLImageElement) {
          if ((el as HTMLImageElement).complete) {
            resolve();
            return;
          }
          const onImgLoad = () => {
            el.removeEventListener('load', onImgLoad as EventListener);
            resolve();
          };
          el.addEventListener('load', onImgLoad as EventListener, { once: true });
          return;
        }
        // Iframes
        const onLoad = () => {
          el.removeEventListener('load', onLoad as EventListener);
          // small delay to allow first paint inside iframe
          setTimeout(() => resolve(), 350);
        };
        el.addEventListener('load', onLoad as EventListener, { once: true });
        // If already loaded or cross-origin loaded, rely on readyState if available
        try {
          // Check if iframe is already loaded
          const iframe = el as HTMLIFrameElement;
          if (iframe.contentDocument?.readyState === 'complete') {
            el.removeEventListener('load', onLoad as EventListener);
            setTimeout(() => resolve(), 350);
          }
        } catch {
          // Ignore cross-origin access errors; the 'load' event will still fire
        }
      });
    };

    await Promise.race([
      Promise.allSettled(candidates.map(makeElementPromise)).then(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  };

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      setIsBlocking(true);
      // Wait for initial document load on first boot
      if (!hasBootedRef.current) {
        if (document.readyState !== 'complete') {
          await new Promise<void>((resolve) => {
            const onLoad = () => resolve();
            window.addEventListener('load', onLoad, { once: true });
          });
        }
        hasBootedRef.current = true;
      }

      // Allow next frame so new route DOM is in place
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      await waitForMediaReady();
      if (!cancelled) setIsBlocking(false);
    };
    void boot();
    return () => { cancelled = true; };
  }, [pathname]);

  return (
    <>
      {isBlocking ? <Loader /> : children}
    </>
  );
} 