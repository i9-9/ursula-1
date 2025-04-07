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
}

export interface ArchiveItem {
  project: string;
  year: string;
  company: string;
}

export interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
}

// Cliente de Contentful
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
});

// Tipos para los campos de Contentful
interface ContentfulFields {
  [key: string]: unknown;
  title?: string;
  client?: string;
  artist?: string;
  year?: string;
  company?: string;
  project?: string;
  videoUrl?: string;
  description?: string;
  image?: {
    fields: {
      file: {
        url: string;
      };
      description?: string;
    };
  };
  thumbnail?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  fullImage?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  items?: Array<{
    fields: ContentfulFields;
  }>;
}

// Funciones para obtener datos

// Obtener slides del hero
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'heroSlide',
      // @ts-expect-error - El tipo de contentful no reconoce correctamente 'fields.order'
      order: 'fields.order',
    });
    
    return entries.items.map(item => {
      const fields = item.fields as ContentfulFields;
      return {
        id: item.sys.id,
        title: fields.title || '',
        client: fields.client || '',
        src: fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}` 
          : '',
        alt: fields.image?.fields?.description || fields.title || '',
        type: fields.videoUrl ? 'video' : 'image',
        videoUrl: fields.videoUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching hero slides from Contentful:', error);
    return [];
  }
}

// Obtener items de trabajos seleccionados
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'portfolioItem',
      // @ts-expect-error - El tipo de contentful no reconoce correctamente 'fields.order'
      order: 'fields.order',
    });
    
    return entries.items.map(item => {
      const fields = item.fields as ContentfulFields;
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
        contentType: fields.videoUrl ? 'video' : 'image',
        videoUrl: fields.videoUrl,
        description: fields.description || '',
      };
    });
  } catch (error) {
    console.error('Error fetching portfolio items from Contentful:', error);
    return [];
  }
}

// Obtener datos de archivo
export async function getArchiveData(): Promise<ArchiveSection[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'archiveSection',
      // @ts-expect-error - El tipo de contentful no reconoce correctamente 'fields.order'
      order: 'fields.order',
      include: 2, // Para obtener referencias anidadas
    });
    
    return entries.items.map(section => {
      const fields = section.fields as ContentfulFields;
      const items = fields.items ? 
        fields.items.map(item => ({
          project: item.fields.project || '',
          year: item.fields.year || '',
          company: item.fields.company || '',
        })) : [];
        
      return {
        title: fields.title || '',
        items,
      };
    });
  } catch (error) {
    console.error('Error fetching archive data from Contentful:', error);
    return [];
  }
} 