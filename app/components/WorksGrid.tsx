'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '@/lib/contentful';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

interface WorksGridProps {
  works: PortfolioItem[];
}

const WorksGrid = ({ works = [] }: WorksGridProps) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<PortfolioItem | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, project: PortfolioItem) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
    setHoveredProject(project);
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
    setTooltipVisible(false);
  };

  const projects: PortfolioItem[] = works.length > 0 ? works : [
    {
      id: 'grid-1',
      title: 'Tres Pecados Después',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      contentType: 'video',
      description: 'Videoclip para Milo J - Tres Pecados Después.',
    },
    {
      id: 'grid-2',
      title: 'Ali Oli',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
      fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
      contentType: 'video',
      description: 'Videoclip para Milo J - Ali Oli.',
    },
    {
      id: 'grid-3',
      title: 'Sola',
      artist: 'Chita',
      year: '2024',
      thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
      fullImage: '/videos_grid/3 - Chita - Sola.mp4',
      contentType: 'video',
      description: 'Videoclip para Chita - Sola.',
    },
    {
      id: 'grid-4',
      title: 'S.O.S',
      artist: 'Taichu ft Lali',
      year: '2024',
      thumbnail: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      fullImage: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      contentType: 'video',
      description: 'Videoclip para Taichu ft Lali - S.O.S.',
    },
    {
      id: 'grid-5',
      title: 'Cirugía',
      artist: 'Dillom',
      year: '2024',
      thumbnail: '/videos_grid/5 - Dillom - Cirugia.mp4',
      fullImage: '/videos_grid/5 - Dillom - Cirugia.mp4',
      contentType: 'video',
      description: 'Videoclip para Dillom - Cirugía.',
    },
    {
      id: 'grid-6',
      title: 'Bonafont MX',
      artist: 'Dir. Carmen Rivoira - Prod. Mamahungara',
      year: '2024',
      thumbnail: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      fullImage: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      contentType: 'video',
      description: 'Commercial para Bonafont MX. Dirección: Carmen Rivoira. Producción: Mamahungara.',
    }
  ];

  useScrollReveal();

  return (
    <section 
      id="selected-works" 
      className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in pt-20 md:pt-0"
      aria-label="Selected works section"
    >
      <div className="mb-10">
        <h2 className="h2 section-title section-title-delay-1 font-neue-haas-grotesk-display text-xs md:text-sm">SELECTED WORK</h2>
      </div>
      
      <div 
        className="w-full grid grid-cols-12 gap-y-6 gap-x-6 md:gap-x-8"
        role="grid"
        aria-label="Projects grid"
      >
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className={`cursor-pointer group relative col-span-12 md:col-span-6 lg:col-span-4 ${
              index % 3 === 0 ? 'section-title section-title-delay-1' : 
              index % 3 === 1 ? 'section-title section-title-delay-2' : 'section-title section-title-delay-3'
            }`}
            onClick={() => setSelectedProject(project)}
            onMouseMove={(e) => handleMouseMove(e, project)}
            onMouseLeave={handleMouseLeave}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedProject(project);
              }
            }}
            aria-label={`${project.title} by ${project.artist}`}
          >
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100 rounded-lg">
              <video
                src={project.thumbnail}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                muted
                loop
                playsInline
                preload="metadata"
                autoPlay
                onError={(e) => console.error('Error loading video:', e)}
                onLoadStart={() => console.log('Video loading started')}
                onLoadedData={() => console.log('Video loaded')}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-black/5 animate-pulse" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip completamente independiente */}
      {typeof window !== 'undefined' && hoveredProject && tooltipVisible && createPortal(
        <div 
          style={{
            position: 'fixed',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px',
            zIndex: 9999,
            pointerEvents: 'none',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            padding: '8px 12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
          }}
          className="hidden md:block"
          role="tooltip"
          aria-hidden="true"
        >
          <h3 style={{ 
            margin: 0, 
            fontStyle: 'italic', 
            fontWeight: 500, 
            fontSize: 'var(--font-size-h5)',
            color: 'var(--foreground)'
          }}>{hoveredProject.title}</h3>
          <p style={{ 
            margin: 0, 
            marginTop: '-2px', 
            fontSize: 'var(--font-size-small)',
            color: 'var(--foreground)',
            opacity: 0.8
          }}>{hoveredProject.artist}</p>
        </div>,
        document.body
      )}
      
      {/* Modal for mobile view */}
      {selectedProject && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-background text-foreground rounded-lg w-full max-w-md">
            <div className="relative w-full aspect-video">
              {selectedProject.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${selectedProject.vimeoId}?autoplay=1&muted=1`}
                  className="w-full h-full rounded-t-lg"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedProject.title}
                  aria-label={`${selectedProject.title} Vimeo video`}
                />
              ) : (
                <video
                  src={selectedProject.thumbnail}
                  className="w-full h-full object-cover rounded-t-lg"
                  controls
                  playsInline
                  autoPlay
                  muted
                  aria-label={`${selectedProject.title} video`}
                />
              )}
            </div>
            <div className="p-4">
              <h3 id="modal-title" className="h5 font-medium italic text-foreground">{selectedProject.title}</h3>
              <p className="text-small text-foreground/80 -mt-0.5">{selectedProject.artist}</p>
            </div>
            <div className="p-4 border-t border-foreground/10 flex justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-small px-4 py-2 bg-foreground text-background rounded"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {typeof window !== 'undefined' && selectedProject && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999999] flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="desktop-modal-title"
          >
            {/* Fondo semitransparente */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
            
            {/* Contenedor del modal */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 max-w-[90vw] w-full max-h-[95vh] overflow-hidden rounded-lg bg-background text-foreground shadow-2xl"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de cierre */}
              <button 
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-lg border border-foreground/10 bg-background/95 backdrop-blur-sm text-foreground hover:bg-foreground/5 transition-colors"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mx-auto my-auto flex items-center justify-center"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              
              {/* Video container */}
              <div className="relative w-full aspect-video max-h-[80vh] bg-foreground/5">
                {selectedProject.vimeoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedProject.vimeoId}?autoplay=1&muted=1`}
                    className="w-full h-full rounded-t-lg"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedProject.title}
                    aria-label={`${selectedProject.title} Vimeo video`}
                  />
                ) : (
                  <video
                    src={selectedProject.fullImage}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                    autoPlay
                    muted
                    aria-label={`${selectedProject.title} video`}
                  />
                )}
              </div>
              
              {/* Información del proyecto */}
              <div className="p-8 bg-background">
                <h3 
                  id="desktop-modal-title" 
                  className="h3 font-medium leading-tight mb-1 text-foreground"
                >{selectedProject.title}</h3>
                <p 
                  className="text-p mb-4 text-foreground/60"
                >{selectedProject.artist}</p>
                <p 
                  className="text-p max-w-4xl text-foreground/80"
                >{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default WorksGrid; 