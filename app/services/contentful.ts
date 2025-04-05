import { createClient } from 'contentful';

// To be replaced with actual Contentful credentials
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'your_space_id';
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || 'your_access_token';
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || 'your_preview_token';

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

const previewClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
});

// Helper to determine which client to use
const getClient = (preview: boolean = false) => (preview ? previewClient : client);

// Fetch all featured projects
export async function getFeaturedProjects(preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'project', 
    'fields.featured': true,
    order: ['-fields.priority'],
    include: 2,
  });
  
  return entries.items;
}

// Fetch all grid projects (not featured)
export async function getGridProjects(preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'project', 
    'fields.featured': false,
    order: ['-fields.date'],
    include: 1,
  });
  
  return entries.items;
}

// Fetch all archive projects
export async function getArchiveProjects(preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'archiveProject',
    order: ['-fields.year'],
    include: 1,
  });
  
  return entries.items;
}

// Fetch hero slider items
export async function getHeroItems(preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'heroItem',
    order: ['fields.order'],
    include: 1,
  });
  
  return entries.items;
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string, preview: boolean = false) {
  const client = getClient(preview);
  const entries = await client.getEntries({
    content_type: 'project',
    'fields.slug': slug,
    include: 2,
  });
  
  return entries.items[0];
}

// Contentful Content Models
/*
HeroItem:
- title (Text) - Title of the project
- client (Text) - Client or brand name
- director (Text, optional) - Director of the project
- media (Media) - Image or video to show
- mediaType (Text) - "video" or "image"
- videoUrl (Text, optional) - URL to external video if needed
- videoThumbnail (Media, optional) - Thumbnail for video
- order (Number) - Order in the carousel
- displayInfo (Boolean) - Whether to show title/client info

Project:
- title (Text)
- client (Text)
- year (Text)
- role (Text)
- mainImage (Media)
- additionalImages (Media, multiple)
- description (Rich Text)
- featured (Boolean)
- priority (Number)
- slug (Text)
- date (Date)

ArchiveProject:
- title (Text)
- client (Text)
- year (Text)
- category (Text)
- link (Text, optional)
*/ 