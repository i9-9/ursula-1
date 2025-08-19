import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPortfolioItems } from '@/lib/contentful';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Función para generar slug limpio basado solo en el título
function generateCleanSlug(title: string): string {
  // Limpiar y normalizar el título
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
  
  // Limitar longitud
  return cleanTitle.substring(0, 60) || 'untitled';
}

// Generar parámetros estáticos para todas las rutas de proyectos
export async function generateStaticParams() {
  try {
    // Obtener proyectos de Contentful
    const contentfulWorks = await getPortfolioItems();
    
    // Mapear proyectos de Contentful a formato Project
    const allProjects = contentfulWorks.map((item) => {
      const slug = generateCleanSlug(item.title || '');
      
      return {
        id: item.id || `contentful-${Math.random()}`,
        slug: slug,
        title: item.title || 'Sin título',
        artist: item.artist || 'Sin artista',
        year: item.year || '2024',
        thumbnail: item.thumbnail || item.fullImage || '',
        fullImage: item.fullImage || item.thumbnail || '',
        contentType: item.contentType || 'video',
        description: item.description || '',
        vimeoId: item.vimeoId,
        youtubeUrl: item.youtubeUrl
      };
    });

    // Generar parámetros para cada slug
    return allProjects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback: no generar rutas si hay error
    return [];
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  try {
    // Obtener proyectos de Contentful
    const contentfulWorks = await getPortfolioItems();
    
    // Mapear proyectos de Contentful
    const allProjects = contentfulWorks.map((item) => {
      const projectSlug = generateCleanSlug(item.title || '');
      
      return {
        id: item.id || `contentful-${Math.random()}`,
        slug: projectSlug,
        title: item.title || 'Sin título',
        artist: item.artist || 'Sin artista',
        year: item.year || '2024',
        thumbnail: item.thumbnail || item.fullImage || '',
        fullImage: item.fullImage || item.thumbnail || '',
        contentType: item.contentType || 'video',
        description: item.description || '',
        vimeoId: item.vimeoId,
        youtubeUrl: item.youtubeUrl
      };
    });
    
    // Buscar el proyecto por slug
    const project = allProjects.find(work => work.slug === slug);
    
    if (!project) {
      console.error(`Project not found for slug: ${slug}`);
      console.log('Available slugs:', allProjects.map(p => p.slug));
      notFound();
    }

    // Encontrar el índice del proyecto para navegación
    const currentIndex = allProjects.findIndex(p => p.slug === slug);
    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    return (
      <div className="min-h-screen bg-background">
        {/* Header similar al home */}
        <header className="fixed top-0 left-0 w-full z-50 py-8">
          <div className="max-w-7xl mx-auto px-2.5 md:px-[15px]">
            <div className="flex justify-between items-baseline">
              {/* Logo/Nombre */}
              <Link href="/" className="text-[13px] font-['Suisse_BP_INTL'] uppercase text-foreground hover:opacity-70 transition-opacity">
                URSULA BENAVIDEZ
              </Link>
              
              {/* Navegación */}
              <nav className="flex gap-4 md:gap-6 items-baseline">
                <Link href="/" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  work
                </Link>
                <Link href="/archive" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  archive
                </Link>
                <Link href="/about" className="text-[11px] uppercase hover:text-neutral-500 transition-colors">
                  about
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-2.5 md:px-[15px]">
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              
              {/* Panel de información del proyecto (izquierda) */}
              <div className="col-span-12 lg:col-span-3 pt-8">
                <div className="space-y-4">
                  <div className="text-2xl font-medium text-foreground">
                    {currentIndex + 1}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">TITLE:</span>
                      <p className="text-foreground/80">{project.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">ARTIST:</span>
                      <p className="text-foreground/80">{project.artist}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">YEAR:</span>
                      <p className="text-foreground/80">{project.year}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium uppercase tracking-wide">TYPE OF PROJECT:</span>
                      <p className="text-foreground/80">VIDEO</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área central del video */}
              <div className="col-span-12 lg:col-span-6 pt-8">
                <div className="relative group">
                  {/* Video Player */}
                  <div className="relative w-full bg-black rounded-lg overflow-hidden">
                    {project.vimeoId ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${project.vimeoId}?h=1234567890&autoplay=0&title=0&byline=0&portrait=0`}
                        className="w-full aspect-video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={`${project.title} - ${project.artist}`}
                      />
                    ) : project.youtubeUrl ? (
                      <iframe
                        src={project.youtubeUrl.replace('youtu.be', 'youtube.com/embed')}
                        className="w-full aspect-video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${project.title} - ${project.artist}`}
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Video no disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Controles del video (similar al home) */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-sm">
                      <div className="font-medium">URSULA BENAVIDEZ</div>
                      <div className="text-xs opacity-80">{project.title}</div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <button className="text-white hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navegación entre proyectos (derecha) */}
              <div className="col-span-12 lg:col-span-3 pt-8">
                <div className="flex flex-col items-end space-y-4">
                  {/* Indicador de posición */}
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                  
                  {/* Flechas de navegación */}
                  <div className="flex flex-col gap-2">
                    {prevProject && (
                      <Link 
                        href={`/work/${prevProject.slug}`}
                        className="text-foreground hover:text-neutral-500 transition-colors"
                        aria-label={`Previous project: ${prevProject.title}`}
                      >
                        <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    )}
                    
                    {nextProject && (
                      <Link 
                        href={`/work/${nextProject.slug}`}
                        className="text-foreground hover:text-neutral-500 transition-colors"
                        aria-label={`Next project: ${nextProject.title}`}
                      >
                        <svg className="w-6 h-6 -rotate-90" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading project page:', error);
    notFound();
  }
}