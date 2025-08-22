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
  slug?: string; // Agregado para la navegación
}

// Tipo actualizado para manejar tanto portfolioItem como archiveItem
export interface ArchiveItem {
  // Para portfolioItem (tiene title + artist)
  title?: string;
  artist?: string;
  
  // Para archiveItem (tiene project + company)  
  project?: string;
  company?: string;
  
  // Campos comunes
  year: string;
  thumbnail?: string;
  vimeoId?: string;
  videoUrl?: string;
  order?: number;
  
  // Para identificación del sistema
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
  params.append('fm', format); // webp para mejor compresión
  params.append('q', quality.toString()); // calidad configurable
  params.append('fit', 'fill'); // mantener aspecto
  
  return url.includes('?') 
    ? `${url}&${params.toString()}` 
    : `${url}?${params.toString()}`;
}

// Función helper para generar slug desde el título si no existe
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim();
}

// Funciones para obtener datos optimizadas para SSG

// Obtener slides del hero
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'heroSlide',
      order: ['fields.order'],
      limit: 10, // Limitar para optimizar build
    });
    
    if (entries.items.length === 0) {
      console.log('📱 No hero slides found in Contentful');
      return [];
    }
    
    console.log(`✅ Fetched ${entries.items.length} hero slides from Contentful`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
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
  } catch (error) {
    console.error('❌ Error fetching hero slides from Contentful:', error);
    return [];
  }
}

// Obtener items de trabajos seleccionados
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'portfolioItem',
      order: ['fields.order'],
      limit: 50, // Limitar para optimizar build
    });
    
    if (entries.items.length === 0) {
      console.log('📱 No portfolio items found in Contentful');
      return [];
    }
    
    console.log(`✅ Fetched ${entries.items.length} portfolio items from Contentful`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
      const fields = item.fields;
      const thumbnailUrl = fields.thumbnail?.fields?.file?.url 
        ? `https:${fields.thumbnail.fields.file.url}` 
        : '';
      const fullImageUrl = fields.fullImage?.fields?.file?.url 
        ? `https:${fields.fullImage.fields.file.url}` 
        : '';
      
      // Don't optimize videos - only optimize actual images
      const isVideoThumbnail = thumbnailUrl.includes('.mp4') || thumbnailUrl.includes('.mov') || thumbnailUrl.includes('.webm');
      const isVideoFullImage = fullImageUrl.includes('.mp4') || fullImageUrl.includes('.mov') || fullImageUrl.includes('.webm');
      
      // Determine content type based on actual content, not just videoUrl
      const hasVideoContent = fields.videoUrl || fields['Vimeo ID'] || fields.vimeoId || isVideoThumbnail || isVideoFullImage;
      
      return {
        id: item.sys.id,
        title: fields.title || '',
        artist: fields.artist || '',
        year: fields.year || '',
        slug: fields.slug || generateSlug(fields.title || ''), // Usar slug de Contentful o generar uno
        thumbnail: thumbnailUrl ? (isVideoThumbnail ? thumbnailUrl : optimizeContentfulImage(thumbnailUrl, 800, 450, 'webp', 85)) : '',
        fullImage: fullImageUrl ? (isVideoFullImage ? fullImageUrl : optimizeContentfulImage(fullImageUrl, 1920, 1080, 'webp', 85)) : '',
        contentType: hasVideoContent ? 'video' as const : 'image' as const,
        videoUrl: fields.videoUrl,
        description: fields.description || '',
        vimeoId: fields['Vimeo ID'] ? String(fields['Vimeo ID']) : (fields.vimeoId ? String(fields.vimeoId) : ''),
        order: fields.order,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio items from Contentful:', error);
    return [];
  }
}

// Obtener datos de archivo - NUEVA VERSIÓN que incluye todos los items
export async function getArchiveData(): Promise<ArchiveSection[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    // Obtener AMBOS tipos de contenido
    const [portfolioItems, archiveItems] = await Promise.all([
      client.getEntries({
        content_type: 'portfolioItem',
        order: ['fields.order'],
        limit: 200,
      }),
      client.getEntries({
        content_type: 'archiveItem', 
        order: ['fields.order'],
        limit: 200,
      })
    ]);

    console.log(`✅ Fetched ${portfolioItems.items.length} portfolio items and ${archiveItems.items.length} archive items`);

    // Crear una lista unificada con todos los items
    const allItems: ArchiveItem[] = [
      // PortfolioItems
      ...portfolioItems.items.map((item: { fields: Record<string, any>; sys: { id: string; contentType: { sys: { id: string } } } }) => {
        const thumbnailUrl = item.fields.thumbnail?.fields?.file?.url 
          ? `https:${item.fields.thumbnail.fields.file.url}` 
          : undefined;
        
        return {
          title: item.fields.title || '',
          artist: item.fields.artist || '',
          year: item.fields.year || '',
          thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
          vimeoId: item.fields.vimeoId ? String(item.fields.vimeoId) : undefined,
          videoUrl: item.fields.videoUrl,
          order: item.fields.order || 0,
          sys: {
            id: item.sys.id,
            contentType: {
              sys: {
                id: item.sys.contentType.sys.id
              }
            }
          }
        };
      }),
      // ArchiveItems  
      ...archiveItems.items.map((item: { fields: Record<string, any>; sys: { id: string; contentType: { sys: { id: string } } } }) => {
        const thumbnailUrl = item.fields.thumbnail?.fields?.file?.url 
          ? `https:${item.fields.thumbnail.fields.file.url}` 
          : undefined;
        
        return {
          project: item.fields.project || '',
          company: item.fields.company || '',
          year: item.fields.year || '',
          thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
          vimeoId: item.fields.vimeoId ? String(item.fields.vimeoId) : undefined,
          videoUrl: item.fields.videoUrl,
          order: item.fields.order || 0,
          sys: {
            id: item.sys.id,
            contentType: {
              sys: {
                id: item.sys.contentType.sys.id
              }
            }
          }
        };
      })
    ];

    // Retornar una sección única con todos los items
    return [{
      title: 'ALL',
      items: allItems,
      order: 1
    }];

  } catch (error) {
    console.error('❌ Error fetching archive data from Contentful:', error);
    return [];
  }
}