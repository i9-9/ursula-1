import { createClient } from 'contentful';

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
}

// Nuevo tipo unificado para projects
export interface Project {
  id: string;
  title: string;
  artist: string;
  company: string;
  thumbnail?: string;
  videoUrl?: string;
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
}

// Tipo legacy para compatibilidad (se mantiene temporalmente)
export interface PortfolioItem {
  id: string;
  title: string;
  artist: string;
  year: string;
  thumbnail: string;
  fullImage: string;
  contentType: 'image' | 'video';
  videoUrl?: string;
  description: string;
  vimeoId?: string;
  youtubeUrl?: string;
  order?: number;
  slug?: string;
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
      console.log('✅ Contentful client initialized successfully');
    } else {
      console.warn('⚠️ Contentful environment variables not found');
    }
  } catch (error) {
    console.error('❌ Contentful client initialization failed:', error);
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
  params.append('fit', 'fill');
  
  return url.includes('?') 
    ? `${url}&${params.toString()}` 
    : `${url}?${params.toString()}`;
}

// Función helper para generar slug desde el título si no existe
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// NUEVA FUNCIÓN: Obtener todos los proyectos del content type unificado
export async function getProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      order: ['fields.archiveOrder'],
      limit: 1000,
    });
    
    console.log(`✅ Fetched ${entries.items.length} projects from unified content type`);
    
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
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
        videoUrl: fields.videoUrl || '',
        vimeoId: fields.vimeoId || '',
        youtubeUrl: fields.youtubeUrl || '',
        archiveOrder: fields.archiveOrder || 0,
        worksGridOrder: fields.worksGridOrder || undefined,
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEOS',
        slug: fields.slug || generateSlug(fields.title || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching projects from Contentful:', error);
    return [];
  }
}

// NUEVA FUNCIÓN: Obtener solo los 24 proyectos del WorksGrid
export async function getWorksGridProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.worksGridOrder[exists]': true,
      order: ['fields.worksGridOrder'],
      limit: 100,
    });
    
    console.log(`✅ Fetched ${entries.items.length} WorksGrid projects from unified content type`);
    
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
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
        videoUrl: fields.videoUrl || '',
        vimeoId: fields.vimeoId || '',
        youtubeUrl: fields.youtubeUrl || '',
        archiveOrder: fields.archiveOrder || 0,
        worksGridOrder: fields.worksGridOrder || 0,
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEOS',
        slug: fields.slug || generateSlug(fields.title || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching WorksGrid projects from Contentful:', error);
    return [];
  }
}

// NUEVA FUNCIÓN: Obtener proyectos del archivo (todos los que no están en WorksGrid)
export async function getArchiveProjects(): Promise<Project[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.worksGridOrder[exists]': false,
      order: ['fields.archiveOrder'],
      limit: 1000,
    });
    
    console.log(`✅ Fetched ${entries.items.length} archive projects from unified content type`);
    
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
        thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
        videoUrl: fields.videoUrl || '',
        vimeoId: fields.vimeoId || '',
        youtubeUrl: fields.youtubeUrl || '',
        archiveOrder: fields.archiveOrder || 0,
        worksGridOrder: undefined, // No tiene worksGridOrder
        year: fields.year || '2024',
        description: fields.description || '',
        category: fields.category || 'MUSIC VIDEOS',
        slug: fields.slug || generateSlug(fields.title || ''),
        projectType: fields.projectType || 'music-video',
        productionCompany: fields.productionCompany || '',
        client: fields.client || '',
        isPublished: fields.isPublished !== false,
        isFeatured: fields.isFeatured === true,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching archive projects from Contentful:', error);
    return [];
  }
}

// Obtener slides del hero
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    // First try to get heroSlide content type
    let entries = await client.getEntries({
      content_type: 'heroSlide',
      order: ['fields.order'],
      limit: 10,
    });
    
    if (entries.items.length > 0) {
      console.log(`✅ Fetched ${entries.items.length} hero slides from Contentful`);
      
      return entries.items.map((item: { 
        fields: { 
          title?: string;
          client?: string;
          image?: { fields?: { file?: { url?: string }; description?: string } };
          videoUrl?: string;
          order?: number;
        }; 
        sys: { id: string } 
      }) => {
        const fields = item.fields;
        const imageUrl = fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : '';
        
        return {
          id: item.sys.id,
          title: fields.title || '',
          client: fields.client || '',
          src: imageUrl ? optimizeContentfulImage(imageUrl, 1920, 1080, 'webp', 85) : '',
          alt: fields.image?.fields?.description || fields.title || '',
          type: fields.videoUrl ? 'video' as const : 'image' as const,
          videoUrl: fields.videoUrl,
          order: fields.order,
        };
      });
    }
    
    // Fallback: Get featured projects from portfolioItem content type
    console.log('📱 No hero slides found, falling back to featured portfolio items');
    entries = await client.getEntries({
      content_type: 'portfolioItem',
      'fields.isFeatured': true,
      order: ['fields.order'],
      limit: 3,
    });
    
    if (entries.items.length === 0) {
      // If no featured items, get the first 3 items
      entries = await client.getEntries({
        content_type: 'portfolioItem',
        order: ['fields.order'],
        limit: 3,
      });
    }
    
    if (entries.items.length > 0) {
      console.log(`✅ Fetched ${entries.items.length} portfolio items for hero`);
      
      return entries.items.map((item: { 
        fields: { 
          title?: string;
          artist?: string;
          thumbnail?: { fields?: { file?: { url?: string } } };
          videoUrl?: string;
          order?: number;
        }; 
        sys: { id: string } 
      }) => {
        const fields = item.fields;
        const imageUrl = fields.thumbnail?.fields?.file?.url 
          ? `https:${fields.thumbnail.fields.file.url}` 
          : '';
        
        return {
          id: item.sys.id,
          title: fields.title || '',
          client: fields.artist || '',
          src: imageUrl ? optimizeContentfulImage(imageUrl, 1920, 1080, 'webp', 85) : '',
          alt: fields.title || '',
          type: fields.videoUrl ? 'video' as const : 'image' as const,
          videoUrl: fields.videoUrl,
          order: fields.order,
        };
      });
    }
    
    console.log('📱 No portfolio items found either');
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching hero slides from Contentful:', error);
    return [];
  }
}

// FUNCIONES LEGACY - Se mantienen para compatibilidad temporal
// Obtener SOLO los 37 proyectos del archive en el orden correcto
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  console.log('⚠️ getPortfolioItems() is deprecated. Use getProjects() instead.');
  const projects = await getProjects();
  
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    artist: project.artist,
    year: project.year,
    thumbnail: project.thumbnail || '',
    fullImage: project.thumbnail || '',
    contentType: 'video' as const,
    videoUrl: project.videoUrl || '',
    description: project.description,
    vimeoId: project.vimeoId || '',
    youtubeUrl: project.youtubeUrl || '',
    order: project.archiveOrder,
    slug: project.slug
  }));
}

// Obtener datos de archivo - NUEVA VERSIÓN que incluye todos los items
export async function getArchiveData(): Promise<ArchiveSection[]> {
  console.log('⚠️ getArchiveData() is deprecated. Use getArchiveProjects() instead.');
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
    console.log('📱 No Contentful connection');
    return null;
  }

  try {
    const entry = await client.getEntry(id);
    
    if (entry.sys.contentType.sys.id !== 'projects') {
      console.log(`❌ Entry ${id} is not a project`);
      return null;
    }
    
    console.log(`✅ Found project with ID ${id}`);
    
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
      category: fields.category || 'MUSIC VIDEOS',
      slug: fields.slug || generateSlug(fields.title || ''),
      projectType: fields.projectType || 'music-video',
      productionCompany: fields.productionCompany || '',
      client: fields.client || '',
      isPublished: fields.isPublished !== false,
      isFeatured: fields.isFeatured === true,
    };
  } catch (error) {
    console.error(`❌ Error fetching project ${id} from Contentful:`, error);
    return null;
  }
}

// NUEVA FUNCIÓN: Obtener un proyecto por slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return null;
  }

  try {
    const entries = await client.getEntries({
      content_type: 'projects',
      'fields.slug': slug,
      limit: 1,
    });
    
    if (entries.items.length === 0) {
      console.log(`❌ No project found with slug: ${slug}`);
      return null;
    }
    
    const entry = entries.items[0];
    console.log(`✅ Found project with slug: ${slug}`);
    
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
      category: fields.category || 'MUSIC VIDEOS',
      slug: fields.slug || generateSlug(fields.title || ''),
      projectType: fields.projectType || 'music-video',
      productionCompany: fields.productionCompany || '',
      client: fields.client || '',
      isPublished: fields.isPublished !== false,
      isFeatured: fields.isFeatured === true,
    };
  } catch (error) {
    console.error(`❌ Error fetching project with slug ${slug} from Contentful:`, error);
    return null;
  }
}

// Función legacy para compatibilidad (se mantiene temporalmente)
export async function getArchiveItemById(id: string): Promise<ArchiveItem | null> {
  console.log('⚠️ getArchiveItemById() is deprecated. Use getProjectById() instead.');
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