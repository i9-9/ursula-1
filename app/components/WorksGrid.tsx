'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '@/lib/contentful';
import { createPortal } from 'react-dom';

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

  return (
    <section id="selected-works" className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in">
      <div className="mb-4">
        <h2 className="h2 text-hover section-title section-title-delay-1">SELECTED WORK</h2>
      </div>
      
      <div className="w-full grid grid-cols-12 gap-y-6 gap-x-6 md:gap-x-8">
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
              />
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
        >
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <h3 className="h5 font-medium italic">{hoveredProject.title}</h3>
            <p className="text-small opacity-80 -mt-0.5">{hoveredProject.artist}</p>
          </div>
        </div>
      )}
      
      {/* Modal for mobile view */}
      {selectedProject && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="relative w-full aspect-video">
              <video
                src={selectedProject.thumbnail}
                className="w-full h-full object-cover rounded-t-lg"
                controls
                playsInline
                autoPlay
              />
            </div>
            <div className="p-4">
              <h3 className="h5 font-medium italic">{selectedProject.title}</h3>
              <p className="text-small opacity-80 -mt-0.5">{selectedProject.artist}</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-small px-4 py-2 bg-black text-white rounded"
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
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white shadow-lg rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white touchable rounded-lg border border-black/10"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
              
              <div className="relative w-full aspect-video bg-gray-100 modal-content active">
                <video
                  src={selectedProject.fullImage}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  autoPlay
                />
              </div>
              
              <div className="p-6 modal-content active bg-white text-black" style={{ transitionDelay: '0.2s' }}>
                <h3 className="h4 font-medium leading-tight mb-0">{selectedProject.title}</h3>
                <p className="text-small opacity-80 mb-3">{selectedProject.artist}</p>
                <p className="text-p">{selectedProject.description}</p>
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