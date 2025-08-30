// This page now redirects to /work/[slug] to prevent duplicate content

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArchiveProjectPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Redirect to work page instead of duplicating content
  // This prevents duplicate pages and unifies the experience
  const redirectUrl = `/work/${slug}`;
  
  // Use Next.js redirect
  const { redirect } = await import('next/navigation');
  redirect(redirectUrl);
}

// No longer generating static routes for archive - all projects now use /work/[slug]
export async function generateStaticParams() {
  // Return empty array to prevent static generation
  // All projects now use the unified /work/[slug] route
  return [];
}
