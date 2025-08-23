import { notFound } from 'next/navigation';
import { getPortfolioItems } from '@/lib/contentful';
import ProjectPageLoader from '@/app/components/ProjectPageLoader';

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
      <ProjectPageLoader 
        project={project}
        currentIndex={currentIndex}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  } catch (error) {
    console.error('Error loading project page:', error);
    notFound();
  }
}