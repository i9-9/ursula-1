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
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, project: PortfolioItem) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
    setHoveredProject(project);
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
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
        <h2 className="h2 section-title section-title-delay-1 font-neue-haas-grotesk-display">SELECTED WORK</h2>
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

      {/* Floating overlay that follows the mouse (desktop only) */}
      {hoveredProject && (
        <div 
          className="hidden md:block fixed pointer-events-none z-50 fade-in"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
          role="tooltip"
          aria-hidden="true"
        >
          <div className="fixed z-[999999] bg-white dark:bg-black border border-black/10 dark:border-white/10 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <h3 className="h5 font-medium italic text-black dark:text-white">{hoveredProject.title}</h3>
            <p className="text-small text-black/80 dark:text-white/80 -mt-0.5">{hoveredProject.artist}</p>
          </div>
        </div>
      )}
      
      {/* Modal for mobile view */}
      {selectedProject && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-black rounded-lg w-full max-w-md">
            <div className="relative w-full aspect-video">
              <video
                src={selectedProject.thumbnail}
                className="w-full h-full object-cover rounded-t-lg"
                controls
                playsInline
                autoPlay
                muted
                aria-label={`${selectedProject.title} video`}
              />
            </div>
            <div className="p-4">
              <h3 id="modal-title" className="h5 font-medium italic text-gray-900 dark:text-white">{selectedProject.title}</h3>
              <p className="text-small text-gray-600 dark:text-gray-400 -mt-0.5">{selectedProject.artist}</p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-small px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded"
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
            className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="desktop-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-black shadow-lg rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 touchable rounded-lg border border-gray-200 dark:border-gray-800"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <span className="text-gray-900 dark:text-white">✕</span>
              </button>
              
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 modal-content active">
                <video
                  src={selectedProject.fullImage}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  autoPlay
                  muted
                  aria-label={`${selectedProject.title} video`}
                />
              </div>
              
              <div className="p-6 modal-content active bg-white dark:bg-black">
                <h3 id="desktop-modal-title" className="h4 font-medium leading-tight mb-0 text-gray-900 dark:text-white">{selectedProject.title}</h3>
                <p className="text-small text-gray-600 dark:text-gray-400 mb-3">{selectedProject.artist}</p>
                <p className="text-p text-gray-700 dark:text-gray-300">{selectedProject.description}</p>
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