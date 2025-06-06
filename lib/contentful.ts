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
  order?: number;
}

export interface ArchiveItem {
  project: string;
  year: string;
  company: string;
  thumbnail?: string; // URL de la imagen thumbnail desde Contentful
}

export interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
  order?: number;
}

// Datos de respaldo
const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: 'fallback-1',
    title: 'Tres Pecados Después',
    artist: 'Milo J',
    year: '2024',
    thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
    fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
    contentType: 'video',
    description: 'Videoclip para Milo J - Tres Pecados Después.',
  },
  {
    id: 'fallback-2',
    title: 'Ali Oli',
    artist: 'Milo J',
    year: '2024',
    thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
    fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
    contentType: 'video',
    description: 'Videoclip para Milo J - Ali Oli.',
  },
  {
    id: 'fallback-3',
    title: 'Sola',
    artist: 'Chita',
    year: '2024',
    thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
    fullImage: '/videos_grid/3 - Chita - Sola.mp4',
    contentType: 'video',
    description: 'Videoclip para Chita - Sola.',
  }
];

// Cliente de Contentful
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null;

try {
  if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
    client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
    });
  }
} catch (error) {
  console.warn('Contentful client initialization failed, using fallback data:', error);
}

// Funciones para obtener datos

// Obtener slides del hero
export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!client) {
    console.log('Using fallback data for hero slides');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'heroSlide',
      order: ['fields.order'],
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
      const fields = item.fields;
      return {
        id: item.sys.id,
        title: fields.title || '',
        client: fields.client || '',
        src: fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : '',
        alt: fields.image?.fields?.description || fields.title || '',
        type: fields.videoUrl ? 'video' as const : 'image' as const,
        videoUrl: fields.videoUrl,
        order: fields.order,
      };
    });
  } catch (error) {
    console.error('Error fetching hero slides from Contentful:', error);
    return [];
  }
}

// Obtener items de trabajos seleccionados
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!client) {
    console.log('Using fallback data for portfolio items');
    return fallbackPortfolioItems;
  }

  try {
    const entries = await client.getEntries({
      content_type: 'portfolioItem',
      order: ['fields.order'],
    });
    
    if (entries.items.length === 0) {
      console.log('No portfolio items found in Contentful, using fallback data');
      return fallbackPortfolioItems;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => {
      const fields = item.fields;
      return {
        id: item.sys.id,
        title: fields.title || '',
        artist: fields.artist || '',
        year: fields.year || '',
        thumbnail: fields.thumbnail?.fields?.file?.url 
          ? `https:${fields.thumbnail.fields.file.url}` 
          : '',
        fullImage: fields.fullImage?.fields?.file?.url 
          ? `https:${fields.fullImage.fields.file.url}` 
          : '',
        contentType: fields.videoUrl ? 'video' as const : 'image' as const,
        videoUrl: fields.videoUrl,
        description: fields.description || '',
        vimeoId: fields['Vimeo ID'] ? String(fields['Vimeo ID']) : (fields.vimeoId ? String(fields.vimeoId) : ''),
        order: fields.order,
      };
    });
  } catch (error) {
    console.error('Error fetching portfolio items from Contentful:', error);
    return fallbackPortfolioItems;
  }
}

// Obtener datos de archivo
export async function getArchiveData(): Promise<ArchiveSection[]> {
  if (!client) {
    console.log('Using fallback data for archive');
    return [];
  }

  try {
    const entries = await client.getEntries({
      content_type: 'archiveSection',
      order: ['fields.order'],
      include: 2, // Para obtener referencias anidadas
    });
    
    if (entries.items.length === 0) {
      console.log('No archive sections found in Contentful');
      return [];
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((section: any) => {
      const fields = section.fields;
      const items = fields.items ? 
        fields.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            // Verificar si item tiene fields (referencia cargada correctamente)
            if (!item.fields) {
              console.warn(`Archive item reference not loaded properly, skipping: ${item.sys?.id}`);
              return null; // Marcar para filtrar
            }
            
            return {
              project: item.fields.project || '',
              year: item.fields.year || '',
              company: item.fields.company || '',
              thumbnail: item.fields.thumbnail?.fields?.file?.url 
                ? `https:${item.fields.thumbnail.fields.file.url}` 
                : undefined,
            };
          })
          .filter((item: ArchiveItem | null): item is ArchiveItem => item !== null) // Filtrar referencias rotas
          .sort((a: ArchiveItem, b: ArchiveItem) => {
            // Ordenar por año descendente (más reciente primero)
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
    console.error('Error fetching archive data from Contentful:', error);
    return [];
  }
} 