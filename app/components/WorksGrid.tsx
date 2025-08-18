'use client';

import { useState } from 'react';
import { PortfolioItem } from '@/lib/contentful';
import StaticVideoThumbnail from './StaticVideoThumbnail';
import VideoModal from './VideoModal';

interface WorksGridProps {
  works: PortfolioItem[];
}

const WorksGrid = ({ works = [] }: WorksGridProps) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  
  const projects: PortfolioItem[] = works.length > 0 ? works : [
    {
      id: 'grid-1',
      title: 'Tres Pecados Después',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      contentType: 'video' as const,
      description: 'Videoclip para Milo J - Tres Pecados Después.',
    },
    {
      id: 'grid-2',
      title: 'Ali Oli',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
      fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
      contentType: 'video' as const,
      description: 'Videoclip para Milo J - Ali Oli.',
    },
    {
      id: 'grid-3',
      title: 'Sola',
      artist: 'Chita',
      year: '2024',
      thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
      fullImage: '/videos_grid/3 - Chita - Sola.mp4',
      contentType: 'video' as const,
      description: 'Videoclip para Chita - Sola.',
    },
    {
      id: 'grid-4',
      title: 'S.O.S',
      artist: 'Taichu ft Lali',
      year: '2024',
      thumbnail: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      fullImage: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      contentType: 'video' as const,
      description: 'Videoclip para Taichu ft Lali - S.O.S.',
    },
    {
      id: 'grid-5',
      title: 'Cirugía',
      artist: 'Dillom',
      year: '2024',
      thumbnail: '/videos_grid/5 - Dillom - Cirugia.mp4',
      fullImage: '/videos_grid/5 - Dillom - Cirugia.mp4',
      contentType: 'video' as const,
      description: 'Videoclip para Dillom - Cirugía.',
    },
    {
      id: 'grid-6',
      title: 'Bonafont MX',
      artist: 'Dir. Carmen Rivoira - Prod. Mamahungara',
      year: '2024',
      thumbnail: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      fullImage: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      contentType: 'video' as const,
      description: 'Comercial para Bonafont MX.',
    },
  ];

  return (
    <section className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in">
      <div className="mb-6 md:mb-8">
      </div>
      
      {/* Mobile Layout - Vertical Stack */}
      <div className="md:hidden space-y-8">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="cursor-pointer group relative"
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedProject(project);
              }
            }}
            onClick={() => setSelectedProject(project)}
            aria-label={`Open ${project.title} by ${project.artist}`}
          >
            {/* Project container for mobile */}
            <div className="relative">
              {/* Project number - positioned according to design specs */}
              <div className="absolute top-0 right-0 z-10 px-2 py-1">
                <span className="text-sm font-medium text-foreground">
                  {index + 1}
                </span>
              </div>
              
              {/* Video container - full width on mobile */}
              <div className="relative w-full h-64 overflow-hidden">
                <StaticVideoThumbnail
                  src={project.thumbnail || project.fullImage || ''}
                  poster={project.thumbnail || project.fullImage || ''}
                  alt={project.title}
                  className="w-full h-full"
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            </div>
            
            {/* Title - centered below image */}
            <div className="mt-4 text-center">
              <p className="text-base font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.title}, {project.artist}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout - Grid */}
      <div 
        className="hidden md:grid w-full grid-cols-12 gap-y-20 gap-x-24 md:gap-x-32 mx-auto"
        role="grid"
        aria-label="Projects grid"
      >
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className={`cursor-pointer group relative col-span-6 lg:col-span-3 ${
              index % 4 === 0 ? 'section-title section-title-delay-1' : 
              index % 4 === 1 ? 'section-title section-title-delay-2' : 
              index % 4 === 2 ? 'section-title section-title-delay-3' : 'section-title section-title-delay-4'
            }`}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedProject(project);
              }
            }}
            onClick={() => setSelectedProject(project)}
            aria-label={`Open ${project.title} by ${project.artist}`}
          >
            {/* Project container */}
            <div className="relative">
              {/* Project number */}
              <div className="absolute -top-6 right-0 z-10 px-2 py-1 rounded-sm">
                <span className="text-xs font-medium text-foreground">
                  {index + 1}
                </span>
              </div>
              
              {/* Video container */}
              <div className="relative w-full h-48 overflow-hidden">
                <StaticVideoThumbnail
                  src={project.thumbnail || project.fullImage || ''}
                  poster={project.thumbnail || project.fullImage || ''}
                  alt={project.title}
                  className="w-full h-full"
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm md:text-base font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.title}, {project.artist}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      <VideoModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};

export default WorksGrid; 