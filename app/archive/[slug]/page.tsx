import { notFound } from 'next/navigation';
import { getProjects } from '../../../lib/contentful';
import { findProjectBySlug, generateAllSlugs } from '../../../lib/slug-utils';
import VideoPlayer from './VideoPlayer';
import Script from 'next/script';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArchiveProjectPage({ params }: PageProps) {
  const { slug } = await params;
  console.log('🔍 Looking for project with slug:', slug);
  
  // Fetch projects from Contentful
  const projects = await getProjects();
  console.log('📋 Total projects fetched:', projects.length);
  
  // Find project by semantic slug using utility function
  const project = findProjectBySlug(projects, slug);
  
  console.log('📦 Project found:', project);

  if (!project) {
    console.log('❌ Project not found with slug:', slug);
    console.log('❌ Available slugs:', generateAllSlugs(projects).map(p => p.slug));
    notFound();
  }

  // Additional validation to ensure project has required properties
  if (!project.title || !project.artist) {
    console.error('❌ Project missing required properties:', {
      id: project.id,
      title: project.title,
      artist: project.artist,
      vimeoId: project.vimeoId,
      videoUrl: project.videoUrl,
      thumbnail: project.thumbnail
    });
    notFound();
  }

  // Find the project index
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const displayIndex = currentIndex >= 0 ? currentIndex + 1 : 1;
  console.log('📍 Project index:', displayIndex);

  // Determine display info
  const displayTitle = project.title || 'Untitled Project';
  const displayCreator = project.artist || project.company || '';
  console.log('🎬 Display info:', { displayTitle, displayCreator, vimeoId: project.vimeoId, videoUrl: project.videoUrl });

  return (
    <div className="min-h-screen bg-background archive-page-fullscreen">
      <Script id="hide-navbar" strategy="beforeInteractive">
        {`
          // Hide navbar on archive project pages for fullscreen experience
          if (typeof window !== 'undefined') {
            const navbar = document.querySelector('[data-navbar]');
            if (navbar) {
              navbar.style.display = 'none';
            }
            
            // Cleanup: restore navbar when leaving the page
            window.addEventListener('beforeunload', () => {
              if (navbar) {
                navbar.style.display = '';
              }
            });
          }
        `}
      </Script>
      {/* Video/Image - Fullscreen */}
      {project && (
        <VideoPlayer 
          project={project}
          displayTitle={displayTitle}
          displayCreator={displayCreator}
          displayIndex={displayIndex}
        />
      )}

      {/* Footer */}
      <footer className="fixed bottom-8 right-8">
        <span className="text-xs opacity-60">© 2025</span>
      </footer>
    </div>
  );
}

// Generate static routes at build time using semantic slugs
export async function generateStaticParams() {
  try {
    console.log('🏗️ Generating static params for archive projects with semantic URLs...');
    const projects = await getProjects();
    
    console.log(`📋 Total projects available: ${projects.length}`);
    
    // Generate routes for projects with title and artist using utility function
    const slugsWithProjects = generateAllSlugs(projects);
    
    console.log(`✅ Generated ${slugsWithProjects.length} static routes with semantic URLs`);
    
    // Log the first few routes being generated
    slugsWithProjects.slice(0, 5).forEach(({ project, slug }, index) => {
      console.log(`  ${index + 1}. /archive/${slug} - ${project.title} by ${project.artist}`);
    });
    
    return slugsWithProjects.map(({ slug }) => ({
      slug,
    }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}
