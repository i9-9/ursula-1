import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/contentful';
import { findProjectBySlug, generateAllSlugs } from '@/lib/slug-utils';
import ProjectPageLoader from '@/app/components/ProjectPageLoader';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generar parámetros estáticos para todas las rutas de proyectos
export async function generateStaticParams() {
  try {
    // Obtener proyectos de Contentful
    const projects = await getProjects();
    
    // Generar parámetros para cada slug usando slug-utils
    const slugsWithProjects = generateAllSlugs(projects);
    
    return slugsWithProjects.map(({ slug }) => ({
      slug,
    }));
  } catch {
    // Fallback: no generar rutas si hay error
    return [];
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  try {
    // Obtener proyectos de Contentful
    const projects = await getProjects();
    
    // Buscar el proyecto por slug usando slug-utils
    const project = findProjectBySlug(projects, slug);
    
    if (!project) {
      notFound();
    }

    // Debug: Log the found project data

    return (
      <ProjectPageLoader 
        project={project}
      />
    );
  } catch {
    notFound();
  }
}