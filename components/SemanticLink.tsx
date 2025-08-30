'use client';

import Link from 'next/link';
import { generateSemanticSlug } from '../lib/slug-utils';

interface SemanticLinkProps {
  title: string;
  artist: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Component that automatically generates semantic URLs for projects
 * Usage: <SemanticLink title="Project Title" artist="Artist Name">Link Text</SemanticLink>
 */
export default function SemanticLink({ 
  title, 
  artist, 
  children, 
  className = '',
  onClick 
}: SemanticLinkProps) {
  const slug = generateSemanticSlug(title, artist);
  const href = `/archive/${slug}`;

  return (
    <Link 
      href={href} 
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

/**
 * Hook to get semantic URL for a project
 * Usage: const projectUrl = useSemanticUrl(project.title, project.artist);
 */
export function useSemanticUrl(title: string, artist: string): string {
  return `/archive/${generateSemanticSlug(title, artist)}`;
}
