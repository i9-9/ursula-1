/**
 * Utility functions for generating semantic slugs from project titles and artists
 */

/**
 * Generates a semantic slug from a title and artist
 * @param title - The project title
 * @param artist - The project artist
 * @returns A URL-friendly slug
 */
export function generateSemanticSlug(title: string, artist: string): string {
  return `${title} ${artist}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates a semantic slug from just a title
 * @param title - The project title
 * @returns A URL-friendly slug
 */
export function generateTitleSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Finds a project by its semantic slug
 * @param projects - Array of projects
 * @param slug - The semantic slug to search for
 * @returns The project if found, undefined otherwise
 */
export function findProjectBySlug<T extends { title?: string; artist?: string }>(
  projects: T[],
  slug: string
): T | undefined {
  return projects.find(project => {
    if (!project.title || !project.artist) return false;
    const projectSlug = generateSemanticSlug(project.title, project.artist);
    return projectSlug === slug;
  });
}

/**
 * Generates all possible semantic slugs for a list of projects
 * @param projects - Array of projects
 * @returns Array of objects with project and slug
 */
export function generateAllSlugs<T extends { title?: string; artist?: string }>(
  projects: T[]
): Array<{ project: T; slug: string }> {
  return projects
    .filter(p => p.title && p.artist)
    .map(project => ({
      project,
      slug: generateSemanticSlug(project.title!, project.artist!)
    }));
}
