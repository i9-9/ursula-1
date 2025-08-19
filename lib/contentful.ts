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

export interface ArchiveItem {
  project: string;
  year: string;
  company: string;
  thumbnail?: string; // URL de la imagen thumbnail desde Contentful
  vimeoId?: string; // ID de Vimeo para reproducir el video
  videoUrl?: string; // URL del video (Google Drive u otro)
  order?: number;
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

// Obtener datos de archivo
export async function getArchiveData(): Promise<ArchiveSection[]> {
  const client = initializeContentfulClient();
  
  if (!client) {
    console.log('📱 No Contentful connection');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'archiveSection',
      order: ['fields.order'],
      include: 2, // Para obtener referencias anidadas
      limit: 20, // Limitar para optimizar build
    });
    
    if (entries.items.length === 0) {
      console.log('📱 No archive sections found in Contentful');
      return [];
    }
    
    console.log(`✅ Fetched ${entries.items.length} archive sections from Contentful`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((section: any) => {
      const fields = section.fields;
      const items = fields.items ? 
        fields.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            // Verificar si item tiene fields (referencia cargada correctamente)
            if (!item.fields) {
              // Log warning but don't fail the build
              if (typeof window === 'undefined') {
                console.warn(`⚠️ Archive item reference not loaded properly, skipping: ${item.sys?.id}`);
              }
              return null; // Marcar para filtrar
            }
            
            try {
              const thumbnailUrl = item.fields.thumbnail?.fields?.file?.url 
                ? `https:${item.fields.thumbnail.fields.file.url}` 
                : undefined;
              
              return {
                project: item.fields.project || '',
                year: item.fields.year || '',
                company: item.fields.company || '',
                thumbnail: thumbnailUrl ? optimizeContentfulImage(thumbnailUrl, 800, 600, 'webp', 95) : undefined,
                vimeoId: item.fields['Vimeo ID'] ? String(item.fields['Vimeo ID']) : (fields.vimeoId ? String(fields.vimeoId) : ''),
                videoUrl: item.fields.videoUrl,
                order: item.fields.order || 0, // Add order field support
              };
            } catch {
              return null;
            }
          })
          .filter((item: ArchiveItem | null): item is ArchiveItem => item !== null) // Filtrar referencias rotas
          .sort((a: ArchiveItem, b: ArchiveItem) => {
            // First sort by order field if available, then by year
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            // Fallback to year sorting (descending)
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA;
          }) : [];
        
      return {
        title: fields.title || '',
        items,
        order: parseInt(fields.order) || 0,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching archive data from Contentful:', error);
    // Return empty array instead of throwing to prevent build failure
    return [];
  }
}