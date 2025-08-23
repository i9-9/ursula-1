'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArchiveItem } from '../../../lib/contentful';

interface VideoPlayerProps {
  item: ArchiveItem;
  displayTitle: string;
  displayCreator: string;
}

export default function VideoPlayer({ item, displayTitle, displayCreator }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="relative w-screen h-screen">
      {item.vimeoId ? (
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${item.vimeoId}?autoplay=0&loop=1&title=0&byline=0&portrait=0&controls=0&background=1`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title={displayTitle}
        />
      ) : item.videoUrl && extractYouTubeId(item.videoUrl) ? (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${extractYouTubeId(item.videoUrl)}?autoplay=0&loop=1&mute=0&controls=0&modestbranding=1&rel=0`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title={displayTitle}
        />
      ) : item.thumbnail ? (
        <Image 
          src={item.thumbnail}
          alt={displayTitle}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white bg-black">
          <span className="text-sm">No content available</span>
        </div>
      )}
      
      <div className="absolute top-8 left-8 z-10 text-white">
        <div className="space-y-2 text-sm font-light tracking-wide">
          <div className="flex items-center space-x-4">
            <span className="text-xs opacity-60">01</span>
            <span className="text-xs opacity-60 uppercase">{displayTitle}</span>
            <span className="text-xs opacity-60 uppercase">{displayCreator}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs opacity-60">
            <span>YEAR: {item.year || '2024'}</span>
            <span>TYPE OF PROJECT: MUSIC VIDEO</span>
          </div>
          <div className="text-xs opacity-60">
            <span>PRODUCTION COMPANY: {item.company || displayCreator || 'ARENA COLLECTIVE'}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-8 right-8 z-10">
        <button 
          className="text-white hover:text-white/80 transition-colors"
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
}
