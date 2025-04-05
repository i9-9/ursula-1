'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  artist: string;
  year: string;
  thumbnail: string;
  fullImage: string;
  contentType: 'image' | 'video';
  videoUrl?: string;
  description: string;
}

// This would come from CMS in production
const dummyProjects: Project[] = [
  {
    id: 'grid-1',
    title: 'Te lo voy a decir',
    artist: 'Conociendo Rusia',
    year: '2024',
    thumbnail: '/images/grid/conociendo rusia - te lo voy a decir.png',
    fullImage: '/images/grid/conociendo rusia - te lo voy a decir.png',
    contentType: 'image',
    description: 'Videoclip para Conociendo Rusia - Te lo voy a decir.',
  },
  {
    id: 'grid-2',
    title: 'Cinco Horas',
    artist: 'Conociendo Rusia & Natalia Lafourcade',
    year: '2024',
    thumbnail: '/images/grid/conociendo rusia & natalia lafourcade - cinco horas.png',
    fullImage: '/images/grid/conociendo rusia & natalia lafourcade - cinco horas.png',
    contentType: 'image',
    description: 'Videoclip para Conociendo Rusia & Natalia Lafourcade - Cinco Horas.',
  },
  {
    id: 'grid-3',
    title: 'S.O.S',
    artist: 'Taichu ft. Lali',
    year: '2024',
    thumbnail: '/images/grid/taichu ft. lali - s.o.s.png',
    fullImage: '/images/grid/taichu ft. lali - s.o.s.png',
    contentType: 'image',
    description: 'Videoclip para Taichu ft. Lali - S.O.S.',
  },
  {
    id: 'grid-4',
    title: 'Buenos tiempos',
    artist: 'Dillom',
    year: '2024',
    thumbnail: '/images/grid/dillom - buenos tiempos.png',
    fullImage: '/images/grid/dillom - buenos tiempos.png',
    contentType: 'image',
    description: 'Videoclip para Dillom - Buenos tiempos.',
  },
  {
    id: 'grid-5',
    title: 'Cirugía',
    artist: 'Dillom',
    year: '2024',
    thumbnail: '/images/grid/dillom - cirugia.png',
    fullImage: '/images/grid/dillom - cirugia.png',
    contentType: 'image',
    description: 'Videoclip para Dillom - Cirugía.',
  },
  {
    id: 'grid-6',
    title: 'Ali Oli',
    artist: 'Milo J',
    year: '2024',
    thumbnail: '/images/grid/milo j - ali oli.png',
    fullImage: '/images/grid/milo j - ali oli.png',
    contentType: 'image',
    description: 'Videoclip para Milo J - Ali Oli.',
  },
];

const WorksGrid = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="selected-works" className="mt-0 pt-16 pb-20 px-[30px]">
      <h2 className="h2 mb-10 tracking-wide">SELECTED WORK</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {dummyProjects.map((project, index) => (
          <div 
            key={project.id}
            className="cursor-pointer group relative"
            onClick={() => setSelectedProject(project)}
          >
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 6}
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {project.contentType === 'video' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <h3 className="h5 font-medium">{project.title}</h3>
              <p className="text-small opacity-80">{project.artist}</p>
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden bg-background shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
              
              <div className="relative w-full aspect-video bg-gray-100">
                {selectedProject.contentType === 'image' ? (
                  <Image
                    src={selectedProject.fullImage}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* Implementar video player cuando estén disponibles los videos */}
                    {selectedProject.videoUrl ? (
                      <video 
                        src={selectedProject.videoUrl} 
                        controls 
                        className="w-full h-full object-cover"
                        autoPlay
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p>Video próximamente</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="h4 font-medium mb-1">{selectedProject.title}</h3>
                <p className="text-small opacity-80 mb-4">{selectedProject.artist}</p>
                <p className="text-p">{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorksGrid; 