'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { PortfolioItem } from '@/lib/contentful';
import { localWorks } from '@/app/data/localWorks';

interface VideoModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

const VideoModal = ({ project, onClose }: VideoModalProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Reset states when project changes
  useEffect(() => {
    if (project) {
      setIsVideoLoaded(false);
      setVideoError(false);
    }
  }, [project]);

  // Function to get Vimeo ID for a project
  const getVimeoId = (project: PortfolioItem): string | undefined => {
    // First, check if project already has vimeoId from Contentful
    if (project.vimeoId) return project.vimeoId;
    
    // Try exact title match first
    const exactMatch = localWorks.find(work => 
      work.title.toLowerCase() === project.title.toLowerCase()
    );
    if (exactMatch?.vimeoId) {
      return exactMatch.vimeoId;
    }
    
    // Try partial matches for more flexible matching
    const partialMatch = localWorks.find(work => {
      const workTitle = work.title.toLowerCase();
      const projectTitle = project.title.toLowerCase();
      
      return workTitle.includes(projectTitle) || 
             projectTitle.includes(workTitle) ||
             // Handle common variations
             (projectTitle.includes('ali oli') && workTitle.includes('ali oli')) ||
             (projectTitle.includes('tres pecados') && workTitle.includes('tres pecados')) ||
             (projectTitle.includes('sola') && workTitle.includes('sola')) ||
             (projectTitle.includes('cirugia') && workTitle.includes('cirugia')) ||
             (projectTitle.includes('corazon vacio') && workTitle.includes('corazon vacio'));
    });
    
    if (partialMatch?.vimeoId) {
      return partialMatch.vimeoId;
    }
    
    return undefined;
  };

  // Helper function to process description
  const processDescription = (description: string | object | undefined): string => {
    if (typeof description === 'string') {
      return description;
    }
    
    if (description && typeof description === 'object' && 'content' in description) {
      const richText = description as { content?: Array<{ content?: Array<{ value?: string }> }> };
      return richText.content?.[0]?.content?.[0]?.value || '';
    }
    
    return '';
  };

  if (!project) return null;

  const vimeoId = getVimeoId(project);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-6xl w-full max-h-[90vh] bg-background rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="relative w-full aspect-video max-h-[80vh] bg-foreground/5">
            {vimeoId ? (
              // Vimeo video
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&controls=0&background=1`}
                className="w-full h-full rounded-t-lg"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={project.title}
                aria-label={project.title}
                onLoad={() => setIsVideoLoaded(true)}
                onError={() => setVideoError(true)}
              />
            ) : (
              // Local video
              <video
                src={project.fullImage || project.thumbnail}
                className="w-full h-full object-contain"
                controls
                playsInline
                autoPlay
                muted
                aria-label={`${project.title} video`}
                onLoadedData={() => setIsVideoLoaded(true)}
                onError={() => setVideoError(true)}
              />
            )}

            {/* Loading indicator */}
            {!isVideoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error state */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-gray-500">Error al cargar el video</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Project information */}
          <div className="p-8 bg-background">
            <h3 
              id="video-modal-title" 
              className="h3 font-medium leading-tight mb-1 text-foreground"
            >{project.title}</h3>
            <p 
              className="text-p mb-4 text-foreground/60"
            >{project.artist}</p>
            <p 
              className="text-p max-w-4xl text-foreground/80"
            >{processDescription(project.description)}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
