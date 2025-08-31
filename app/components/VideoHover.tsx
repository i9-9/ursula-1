'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoHoverProps {
  videoUrl: string;
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const VideoHover = ({ 
  videoUrl, 
  isVisible, 
  onMouseEnter, 
  onMouseLeave 
}: VideoHoverProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reproducir video cuando se hace hover
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Fallback silencioso si no se puede reproducir automáticamente
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  // Limpiar video al desmontar
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 z-50 overflow-hidden"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Video Player - Solo video, sin overlays */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
              }
            }}
          >
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoHover;
