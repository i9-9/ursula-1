'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

// Types matching your Contentful structure
interface ArchiveItem {
  title?: string;
  artist?: string;
  project?: string;  
  company?: string;  
  year?: string;
  thumbnail?: string;
  videoUrl?: string;
  vimeoId?: string;
  order?: number;
  sys?: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
}

interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
  order?: number;
}

interface ArchiveProps {
  sections: ArchiveSection[];
}



const Archive = ({ sections }: ArchiveProps) => {
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);



  // Get all individual items (exclude section containers)
  const allItems = useMemo(() => {
    return sections.reduce((acc: ArchiveItem[], section) => {
      if (section.items && Array.isArray(section.items)) {
        // Only include items that are not section containers
        const validItems = section.items.filter(item => {
          const contentType = item.sys?.contentType?.sys?.id;
          return contentType !== 'archiveSection';
        });
        acc.push(...validItems);
      }
      return acc;
    }, []);
  }, [sections]);

  // Debug: Log items to see what we're getting
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 All items from Contentful:', allItems);
    console.log('📊 Items breakdown:');
    allItems.forEach((item, index) => {
      console.log(`${index + 1}. Title: "${item.title || 'N/A'}" | Project: "${item.project || 'N/A'}" | Type: ${item.sys?.contentType?.sys?.id || 'unknown'}`);
    });
  }

  // Process items: filter and sort by order from Contentful
  const filteredItems = useMemo(() => {
    return allItems
      .filter(item => {
        // Only include items with actual content
        const hasTitle = !!(item.title && item.title.trim());
        const hasProject = !!(item.project && item.project.trim());
        const hasContent = hasTitle || hasProject;
        
        // Debug logging for filtered items
        if (!hasContent && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log('❌ Filtering out empty item:', {
            title: item.title,
            project: item.project,
            sys: item.sys,
            fullItem: item
          });
        }
        
        return hasContent;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by Contentful order
      .map((item, index) => ({ 
        ...item,
        displayOrder: item.order || index + 1 // Use real order from Contentful
      }));
  }, [allItems]);

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url || !url.includes('youtu')) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col px-8 pt-80 pb-16">
        {/* Main Content - Centered */}
        <div className="flex flex-col justify-center min-h-screen">
          <main className="w-full max-w-4xl mx-auto">
            {/* Archive list */}
            <div className="space-y-1">
              {filteredItems.map((item, index) => (
                <div 
                  key={`${item.sys?.id || index}-row`}
                  className="flex items-start group cursor-pointer hover:opacity-60 transition-opacity"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Number column */}
                  <div className="flex-shrink-0 w-8 py-0 pl-0 m-0">
                    <span 
                      className="text-foreground text-[10px] leading-4 font-normal block text-left" 
                      style={{ fontFamily: 'Suisse BP INTL' }}
                    >
                      {String(item.displayOrder).padStart(2, '0')}
                    </span>
                  </div>
                 
                  {/* Project name column */}
                  <div className="flex-1 py-0 pl-2">
                    <span className="text-foreground text-[10px] tracking-tight uppercase leading-4 block">
                      {item.title || item.project}
                      {(item.artist || (item.company && item.company.trim())) && `, ${item.artist || item.company}`}
                      {item.year && ` (${item.year})`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-8 right-8">
          <span className="text-xs opacity-60">© 2025</span>
        </footer>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video/Image Container */}
            <div className="relative w-full aspect-video bg-black">
              {selectedItem.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${selectedItem.vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={selectedItem.title || selectedItem.project}
                />
              ) : selectedItem.videoUrl && extractYouTubeId(selectedItem.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedItem.videoUrl)}?autoplay=1&loop=1&mute=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={selectedItem.title || selectedItem.project}
                />
              ) : selectedItem.thumbnail ? (
                <Image 
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title || selectedItem.project || ''}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <span className="text-sm">No content available</span>
                </div>
              )}
              
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 w-8 h-8 flex items-center justify-center rounded transition-colors"
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            {/* Info */}
            <div className="p-6 bg-white">
              <h3 className="text-lg font-medium uppercase tracking-wide">{selectedItem.title || selectedItem.project}</h3>
              <div className="mt-2 text-sm opacity-60">
                {(selectedItem.artist || selectedItem.company) && <span className="uppercase">{selectedItem.artist || selectedItem.company}</span>}
                {selectedItem.year && <span className="ml-3">{selectedItem.year}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .project-list {
          font-family: inherit;
          font-size: 14px;
          line-height: 1.4;
          z-index: 10;
          background: var(--background);
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .project-list > div {
          margin-bottom: 8px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          padding-left: 0;
          margin-left: 0;
        }
        
        .project-list > div:hover {
          opacity: 0.7;
          transform: translateX(4px);
        }
        
        @media (max-width: 768px) {
          .project-list {
            position: static !important;
            max-width: 90%;
            margin: 0 auto;
            left: auto !important;
            top: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default Archive;