'use client';

import Link from 'next/link';
import { PortfolioItem } from '@/lib/contentful';
import StaticVideoThumbnail from './StaticVideoThumbnail';

// Función para generar slug limpio y legible (debe coincidir con la página [slug])
function generateCleanSlug(title: string, artist: string): string {
  // Limpiar y normalizar el título y artista
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[áäâà]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôò]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Eliminar guiones del inicio y final

  const cleanArtist = artist
    .toLowerCase()
    .trim()
    .replace(/[áäâà]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôò]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Crear slug combinando título y artista
  const slug = cleanTitle && cleanArtist ? `${cleanTitle}-${cleanArtist}` : cleanTitle || cleanArtist || 'untitled';
  
  // Limitar longitud y asegurar que sea único
  return slug.substring(0, 60);
}

interface WorksGridProps {
  works: PortfolioItem[];
}

const WorksGrid = ({ works = [] }: WorksGridProps) => {
  // Si no hay proyectos de Contentful, mostrar mensaje o componente vacío
  if (works.length === 0) {
    return (
      <section className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in">
        <div className="text-center py-12">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-2.5 md:px-[15px] fade-in">
      <div className="mb-6 md:mb-8">
      </div>
      
      {/* Mobile Layout - Vertical Stack */}
      <div className="md:hidden space-y-8">
        {works.map((project, index) => (
          <Link
            href={`/work/${generateCleanSlug(project.title || '', project.artist || '')}`}
            key={project.id}
            className="block cursor-pointer group relative"
            aria-label={`Ver ${project.title} by ${project.artist}`}
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
              <div className="relative w-full">
                <StaticVideoThumbnail
                  src={project.thumbnail || project.fullImage || ''}
                  poster={project.thumbnail || project.fullImage || ''}
                  alt={project.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Title - centered below image */}
            <div className="mt-4 text-center">
              <p className="text-base font-normal uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.title}, {project.artist}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Layout - Grid */}
      <div 
        className="hidden md:grid w-full grid-cols-12 gap-y-20 gap-x-24 md:gap-x-32 mx-auto"
        role="grid"
        aria-label="Projects grid"
      >
        {works.map((project, index) => (
          <Link
            href={`/work/${generateCleanSlug(project.title || '', project.artist || '')}`}
            key={project.id}
            className={`block cursor-pointer group relative col-span-6 lg:col-span-3 ${
              index % 4 === 0 ? 'section-title section-title-delay-1' : 
              index % 4 === 1 ? 'section-title section-title-delay-2' : 
              index % 4 === 2 ? 'section-title section-title-delay-3' : 'section-title section-title-delay-4'
            }`}
            aria-label={`Ver ${project.title} by ${project.artist}`}
          >
            {/* Project container */}
            <div className="relative">
              {/* Project number */}
              <div className="absolute -top-12 right-0 z-10">
                <span className="text-xs font-normal text-foreground">
                  {index + 1}
                </span>
              </div>
              
              {/* Video container */}
              <div className="relative w-full">
                <StaticVideoThumbnail
                  src={project.thumbnail || project.fullImage || ''}
                  poster={project.thumbnail || project.fullImage || ''}
                  alt={project.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm md:text-base font-normal uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.title}, {project.artist}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WorksGrid;