import { notFound } from 'next/navigation';
import { getArchiveItemById, getArchiveData, type ArchiveItem } from '../../../lib/contentful';
import VideoPlayer from './VideoPlayer';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArchiveProjectPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getArchiveItemById(id);

  if (!item) {
    notFound();
  }

  // Get all archive items to find the correct index
  const sections = await getArchiveData();
  const allItems = sections.reduce((acc: ArchiveItem[], section) => {
    acc.push(...section.items);
    return acc;
  }, []);
  
  // Find the index of the current item
  const currentIndex = allItems.findIndex(archiveItem => archiveItem.sys?.id === item.sys?.id);
  const displayIndex = currentIndex >= 0 ? currentIndex + 1 : 1;

  // Determinar el título a mostrar
  const displayTitle = item.title || item.project || 'Untitled Project';
  const displayCreator = item.artist || item.company || '';

  return (
    <div className="min-h-screen bg-background archive-page-fullscreen">
      {/* Video/Image - Fullscreen */}
      <VideoPlayer 
        item={item}
        displayTitle={displayTitle}
        displayCreator={displayCreator}
        displayIndex={displayIndex}
      />

      {/* Footer */}
      <footer className="fixed bottom-8 right-8">
        <span className="text-xs opacity-60">© 2025</span>
      </footer>
    </div>
  );
}

// Generar rutas estáticas en build
export async function generateStaticParams() {
  try {
    const sections = await getArchiveData();
    
    const allItems = sections.reduce((acc: ArchiveItem[], section) => {
      acc.push(...section.items);
      return acc;
    }, []);

    return allItems.map((item) => ({
      id: item.sys?.id || '',
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
