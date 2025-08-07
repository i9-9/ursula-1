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
        <h2 className="h2 section-title section-title-delay-2 font-suisse-bp-intl uppercase">SELECTED WORK</h2>
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
              <StaticVideoThumbnail
                src={project.thumbnail || project.fullImage || ''}
                poster={project.thumbnail || project.fullImage || ''}
                alt={project.title}
                className="w-full h-full"
                onClick={() => setSelectedProject(project)}
              />
            </div>
            <div className="mt-2">
              <h3 className="text-sm md:text-base font-medium uppercase tracking-wide">{project.title}</h3>
              <p className="text-xs md:text-sm text-foreground/70">{project.artist}</p>
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