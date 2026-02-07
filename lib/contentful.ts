import { createClient } from 'contentful';
import { generateSemanticSlug, generateTitleSlug } from './slug-utils';
import { unstable_cache } from 'next/cache';

// Tipos para los datos de Contentful
export interface HeroSlide {
  id: string;
  title: string;
  client: string;
  src: string;
  alt: string;
  type: 'image' | 'video';
  videoUrl?: string;
  order?: number;
  projectSlug?: string;
  projectId?: string;
}

// Nuevo tipo unificado para projects
export interface Project {
  id: string;
  title: string;
  artist: string;
  company: string;
  thumbnail?: string;
  images?: string[];
  hoverImages?: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  vimeoId?: string;
  youtubeUrl?: string;
  archiveOrder: number;
  worksGridOrder?: number;
  year: string;
  description: string;
  category: string;
  slug: string;
  projectType: string;
  productionCompany?: string;
  client?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isVertical?: boolean; // Campo para determinar si la imagen es vertical (solo para WorksGrid)
}

// Tipo legacy para compatibilidad (se mantiene temporalmente)
export interface ArchiveItem {
  title?: string;
  artist?: string;
  project?: string;
  company?: string;
  year: string;
  thumbnail?: string;
  vimeoId?: string;
  videoUrl?: string;
  order?: number;
  projectType?: string;
  sys?: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
}

export interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
  order?: number;
}

// Cliente de Contentful optimizado para SSG
let client: ReturnType<typeof createClient> | null = null;

function initializeContentfulClient() {
  if (client) return client;
  
  try {
    if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
      client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
      });
    }
  } catch {
    // Contentful client initialization failed
  }
  
  return client;
}


// Función helper para optimizar URLs de imágenes de Contentful
function optimizeContentfulImage(url: string, width?: number, height?: number, format: string = 'webp', quality: number = 95): string {
  if (!url) return url;
  
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('fm', format);
  params.append('q', quality.toString());
  if (width && height) {
    params.append('fit', 'pad'); // Mantiene aspect ratio, rellena con fondo si es necesario
  }
  
  return url.includes('?') 
    ? `${url}&${params.toString()}` 
    : `${url}?${params.toString()}`;
}

// Función específica para optimizar imágenes de hover (tamaño reducido para performance)
export function optimizeHoverImage(url: string): string {
  return optimizeContentfulImage(url, 800, 600, 'webp', 80); // Menor calidad y tamaño para hovers
}

// Función específica para optimizar imágenes de galería completa
export function optimizeGalleryImage(url: string): string {
  return optimizeContentfulImage(url, 1920, 1080, 'webp', 95); // Alta calidad para galerías
}

// Función helper para generar slug desde el título si no existe (DEPRECATED - usar generateTitleSlug)
function generateSlug(title: string): string {
  return generateTitleSlug(title);
}

// Función interna sin caché
async function _getProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return [];
  }

  try {
    // First try to get from the new 'projects' content type
    const entries = await client.getEntries({
      content_type: 'projects',
      order: ['fields.archiveOrder'],
      limit: 1000,
    });
    

    
    // If still no projects, return empty array
    if (entries.items.length === 0) {
      return [];
    }
    
    return entries.items.map((item: { 
      fields: { 
        title?: string;
        artist?: string;
        company?: string;
        thumbnail?: { fields?: { file?: { url?: string } } };
        images?: { fields?: { file?: { url?: string } } }[]; // Array de imágenes
        videoUrl?: string;
        videoThumbnail?: { fields?: { file?: { url?: string } } }; // Video optimizado
        vimeoId?: string;
        youtubeUrl?: string;
        archiveOrder?: number;
        worksGridOrder?: number;
        year?: string;
        description?: string;
        category?: string;
        slug?: string;
        projectType?: string;
        productionCompany?: string;
        client?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
        order?: number; // Legacy field
      }; 
      sys: { id: string } 
    }) => {
      const fields = item.fields;
      const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
        ? `https:${fields.thumbnail.fields.file.url}` 
        : undefined;
      
      // Procesar array de imágenes (alta calidad para galerías)
      const images = fields.images?.map(img => {
        const imageUrl = img.fields?.file?.url;
        return imageUrl ? optimizeGalleryImage(`https:${imageUrl}`) : null;
      }).filter((url): url is string => url !== null) || [];
      
      // Procesar imágenes optimizadas para hover (menor calidad/tamaño)
      const hoverImages = fields.images?.map(img => {
        const imageUrl = img.fields?.file?.url;
        return imageUrl ? optimizeHoverImage(`https:${imageUrl}`) : null;
      }).filter((url): url is string => url !== null) || [];
      
      // Procesar videoThumbnail (video optimizado)
      const videoThumbnailUrl = fields.videoThumbnail?.fields?.file?.url 
        ? `https:${fields.videoThumbnail.fields.file.url}` 
        : undefined;
      
      // Usar únicamente campos de video de Contentful
      const vimeoId = fields.vimeoId || '';
      const youtubeUrl = fields.youtubeUrl || '';

      return {
        id: item.sys.id,
        title: fields.title || '',
        artist: fields.artist || '',
        company: fields.company || '',
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, undefined, undefined, 'webp', 95) : undefined,
        images: images.length > 0 ? images : undefined,
        hoverImages: hoverImages.length > 0 ? hoverImages : undefined,
        videoUrl: fields.videoUrl || '',
        videoThumbnail: videoThumbnailUrl,
        vimeoId: vimeoId,
        youtubeUrl: youtubeUrl,
        archiveOrder: fields.archiveOrder || fields.order || 0,
        worksGridOrder: fields.worksGridOrder || undefined,
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEO',
        slug: fields.slug || generateSemanticSlug(fields.title || '', fields.artist || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
      };
    });
  } catch {
    return [];
  }
}

// Función pública con caché
export const getProjects = unstable_cache(
  _getProjects,
  ['projects'],
  {
    tags: ['projects', 'contentful'],
    revalidate: 60, // Cache for 60 seconds - balance between freshness and performance
  }
);

// Función interna para WorksGrid sin caché
async function _getWorksGridProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.worksGridOrder[exists]': true,
      order: ['fields.worksGridOrder'],
      limit: 100,
    });
    
    return entries.items.map((item: { 
      fields: { 
        title?: string;
        artist?: string;
        company?: string;
        thumbnail?: { fields?: { file?: { url?: string } } };
        images?: { fields?: { file?: { url?: string } } }[]; // Array de imágenes
        videoUrl?: string;
        videoThumbnail?: { fields?: { file?: { url?: string } } }; // Video optimizado
        vimeoId?: string;
        youtubeUrl?: string;
        archiveOrder?: number;
        worksGridOrder?: number;
        year?: string;
        description?: string;
        category?: string;
        slug?: string;
        projectType?: string;
        productionCompany?: string;
        client?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
        isVertical?: boolean; // Campo para imágenes verticales
      }; 
      sys: { id: string } 
    }) => {
      const fields = item.fields;
      const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
        ? `https:${fields.thumbnail.fields.file.url}` 
        : undefined;
      
      // Procesar array de imágenes (alta calidad para galerías) - FIXED
      const images = fields.images?.map(img => {
        const imageUrl = img.fields?.file?.url;
        return imageUrl ? optimizeGalleryImage(`https:${imageUrl}`) : null;
      }).filter((url): url is string => url !== null) || [];
      
      // Procesar imágenes optimizadas para hover (menor calidad/tamaño) - FIXED
      const hoverImages = fields.images?.map(img => {
        const imageUrl = img.fields?.file?.url;
        return imageUrl ? optimizeHoverImage(`https:${imageUrl}`) : null;
      }).filter((url): url is string => url !== null) || [];
      
      // Procesar videoThumbnail (video optimizado) - FIXED
      const videoThumbnailUrl = fields.videoThumbnail?.fields?.file?.url 
        ? `https:${fields.videoThumbnail.fields.file.url}` 
        : undefined;
      
      return {
        id: item.sys.id,
        title: fields.title || '',
        artist: fields.artist || '',
        company: fields.company || '',
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, undefined, undefined, 'webp', 95) : undefined,
        images: images.length > 0 ? images : undefined,
        hoverImages: hoverImages.length > 0 ? hoverImages : undefined,
        videoUrl: fields.videoUrl || '',
        videoThumbnail: videoThumbnailUrl,
        vimeoId: fields.vimeoId || '',
        youtubeUrl: fields.youtubeUrl || '',
        archiveOrder: fields.archiveOrder || 0,
        worksGridOrder: fields.worksGridOrder || 0,
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEO',
        slug: fields.slug || generateSemanticSlug(fields.title || '', fields.artist || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
        isVertical: fields.isVertical === true, // Por defecto false si no está definido
      };
    });
  } catch {
    return [];
  }
}

// NUEVA FUNCIÓN: Obtener solo los 24 proyectos del WorksGrid CON CACHE BUSTING
export const getWorksGridProjects = unstable_cache(
  _getWorksGridProjects,
  ['works-grid-projects'],
  {
    tags: ['projects', 'contentful', 'works-grid'],
    revalidate: 60, // Cache for 60 seconds - balance between freshness and performance
  }
);

// NUEVA FUNCIÓN: Obtener proyectos del archivo (todos los que no están en WorksGrid)
export async function getArchiveProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.worksGridOrder[exists]': false,
      order: ['fields.archiveOrder'],
      limit: 1000,
    });
    
    return entries.items.map((item: { 
      fields: { 
        title?: string;
        artist?: string;
        company?: string;
        thumbnail?: { fields?: { file?: { url?: string } } };
        videoUrl?: string;
        vimeoId?: string;
        youtubeUrl?: string;
        archiveOrder?: number;
        year?: string;
        description?: string;
        category?: string;
        slug?: string;
        projectType?: string;
        productionCompany?: string;
        client?: string;
        isPublished?: boolean;
        isFeatured?: boolean;
      }; 
      sys: { id: string } 
    }) => {
      const fields = item.fields;
      const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
        ? `https:${fields.thumbnail.fields.file.url}` 
        : undefined;
      
      return {
        id: item.sys.id,
        title: fields.title || '',
        artist: fields.artist || '',
        company: fields.company || '',
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, undefined, undefined, 'webp', 95) : undefined,
        videoUrl: fields.videoUrl || '',
        vimeoId: fields.vimeoId || '',
        youtubeUrl: fields.youtubeUrl || '',
        archiveOrder: fields.archiveOrder || 0,
        worksGridOrder: undefined, // No tiene worksGridOrder
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEO',
        slug: fields.slug || generateSemanticSlug(fields.title || '', fields.artist || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
      };
    });
  } catch {
    return [];
  }
}

// Obtener slides del hero
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return [];
  }

  try {
    // First try to get heroSlide content type
    // include: 1 resuelve referencias a Assets (imagen) para que venga fields.file.url
    const entries = await client.getEntries({
      content_type: 'heroSlide',
      order: ['fields.order'],
      limit: 20, // Aumentado para incluir todos los slides actuales y futuros
      include: 1,
    });
    
    if (entries.items.length > 0) {
      
      return entries.items.map((item: { 
        fields: { 
          title?: string;
          client?: string;
          image?: { fields?: { file?: { url?: string }; description?: string } };
          videoUrl?: string;
          order?: number;
          // Nuevos campos para referencia al proyecto (opcional)
          project?: { 
            fields?: { 
              slug?: string;
              title?: string;
              artist?: string;
            };
            sys?: { id: string };
          };
        }; 
        sys: { id: string } 
      }) => {
        const fields = item.fields;
        const imageUrl = fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : '';
        let projectSlug: string | undefined;
        let projectId: string | undefined;
        
        if (fields.project?.fields) {
          projectId = fields.project.sys?.id;
          if (fields.project.fields.title && fields.project.fields.artist) {
            projectSlug = generateSemanticSlug(fields.project.fields.title, fields.project.fields.artist);
          }
        }
        
        return {
          id: item.sys.id,
          title: fields.title || '',
          client: fields.client || '',
          src: imageUrl ? optimizeContentfulImage(imageUrl, 1920, 1080, 'webp', 85) : '',
          alt: fields.image?.fields?.description || fields.title || '',
          type: 'image' as const,
          videoUrl: undefined,
          order: fields.order,
          projectSlug,
          projectId,
        };
      });
    }
    
    return [];
    
  } catch {
    return [];
  }
}

// Obtener datos de archivo - NUEVA VERSIÓN que incluye todos los items
export async function getArchiveData(): Promise<ArchiveSection[]> {
  const projects = await getArchiveProjects();
  
  // Agrupar por categoría
  const categories = projects.reduce((acc, project) => {
    const category = project.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({
      title: project.title,
      artist: project.artist,
      year: project.year,
      thumbnail: project.thumbnail,
      vimeoId: project.vimeoId,
      videoUrl: project.videoUrl,
      order: project.archiveOrder,
      sys: {
        id: project.id,
        contentType: {
          sys: {
            id: 'projects'
          }
        }
      }
    });
    
    return acc;
  }, {} as Record<string, ArchiveItem[]>);
  
  return Object.entries(categories).map(([title, items]) => ({
    title,
    items: items.sort((a, b) => (a.order || 0) - (b.order || 0)),
    order: 1
  }));
}

// NUEVA FUNCIÓN: Obtener un proyecto específico por ID
export async function getProjectById(id: string): Promise<Project | null> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return null;
  }

  try {
    // First try to get from the new 'projects' content type
    let entry;
    try {
      entry = await client.getEntry(id);
    } catch {
      return null;
    }
    
    // Check if it's a valid project content type
    if (entry.sys.contentType.sys.id !== 'projects') {
      return null;
    }
    
    const fields = entry.fields as {
      title?: string;
      artist?: string;
      company?: string;
      thumbnail?: { fields?: { file?: { url?: string } } };
      videoUrl?: string;
      vimeoId?: string;
      youtubeUrl?: string;
      archiveOrder?: number;
      worksGridOrder?: number;
      year?: string;
      description?: string;
      category?: string;
      slug?: string;
      projectType?: string;
      productionCompany?: string;
      client?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
      order?: number; // Legacy field
    };
    
    const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
      ? `https:${fields.thumbnail.fields.file.url}` 
      : undefined;
    
    return {
      id: entry.sys.id,
      title: fields.title || '',
      artist: fields.artist || '',
      company: fields.company || '',
      thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 1920, 1080, 'webp', 95) : undefined,
      videoUrl: fields.videoUrl || '',
      vimeoId: fields.vimeoId || '',
      youtubeUrl: fields.youtubeUrl || '',
      archiveOrder: fields.archiveOrder || fields.order || 0,
      worksGridOrder: fields.worksGridOrder || undefined,
      year: fields.year || '2024',
      description: fields.description || '',
        category: fields.category || 'MUSIC VIDEO',
      slug: fields.slug || generateSlug(fields.title || ''),
      projectType: fields.projectType || 'music-video',
      productionCompany: fields.productionCompany || '',
      client: fields.client || '',
      isPublished: fields.isPublished !== false,
      isFeatured: fields.isFeatured === true,
    };
  } catch {
    return null;
  }
}

// NUEVA FUNCIÓN: Obtener un proyecto por slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = initializeContentfulClient();
  
  if (!client) {
    return null;
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.slug': slug,
      limit: 1,
    });
    
    if (entries.items.length === 0) {
      return null;
    }
    
    const entry = entries.items[0];
    
    const fields = entry.fields as {
      title?: string;
      artist?: string;
      company?: string;
      thumbnail?: { fields?: { file?: { url?: string } } };
      videoUrl?: string;
      vimeoId?: string;
      youtubeUrl?: string;
      archiveOrder?: number;
      worksGridOrder?: number;
      year?: string;
      description?: string;
      category?: string;
      slug?: string;
      projectType?: string;
      productionCompany?: string;
      client?: string;
      isPublished?: boolean;
      isFeatured?: boolean;
    };
    const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
      ? `https:${fields.thumbnail.fields.file.url}` 
      : undefined;
    
    return {
      id: entry.sys.id,
      title: fields.title || '',
      artist: fields.artist || '',
      company: fields.company || '',
      thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 1920, 1080, 'webp', 95) : undefined,
      videoUrl: fields.videoUrl || '',
      vimeoId: fields.vimeoId || '',
      youtubeUrl: fields.youtubeUrl || '',
      archiveOrder: fields.archiveOrder || 0,
      worksGridOrder: fields.worksGridOrder || undefined,
      year: fields.year || '2024',
      description: fields.description || '',
        category: fields.category || 'MUSIC VIDEO',
      slug: fields.slug || generateSlug(fields.title || ''),
      projectType: fields.projectType || 'music-video',
      productionCompany: fields.productionCompany || '',
      client: fields.client || '',
      isPublished: fields.isPublished !== false,
      isFeatured: fields.isFeatured === true,
    };
  } catch {
    return null;
  }
}

// Función legacy para compatibilidad (se mantiene temporalmente)
export async function getArchiveItemById(id: string): Promise<ArchiveItem | null> {
  const project = await getProjectById(id);
  
  if (!project) return null;
  
  return {
    title: project.title,
    artist: project.artist,
    year: project.year,
    thumbnail: project.thumbnail,
    vimeoId: project.vimeoId,
    videoUrl: project.videoUrl,
    order: project.archiveOrder,
    sys: {
      id: project.id,
      contentType: {
        sys: {
          id: 'projects'
        }
      }
    }
  };
}