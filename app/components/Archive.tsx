'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug: log sections data
  console.log('Archive sections:', sections);

  // Get all individual items (exclude section containers)
  const allItems = useMemo(() => {
    return sections.reduce((acc: ArchiveItem[], section) => {
      if (section.items && Array.isArray(section.items)) {
        const validItems = section.items.filter(item => {
          const contentType = item.sys?.contentType?.sys?.id;
          return contentType !== 'archiveSection';
        });
        acc.push(...validItems);
      }
      return acc;
    }, []);
  }, [sections]);

  // Process items: filter and use sequential numbering
  const filteredItems = useMemo(() => {
    let filtered = allItems.filter(item => {
      const hasTitle = !!(item.title && item.title.trim());
      const hasProject = !!(item.project && item.project.trim());
      return hasTitle || hasProject;
    });

    // Apply filter logic
    if (selectedFilter === 'music-videos') {
      filtered = filtered.filter(item => {
        return sections.some(section => 
          section.title === 'MUSIC VIDEOS' && 
          section.items?.some(sectionItem => sectionItem.sys?.id === item.sys?.id)
        );
      });
    } else if (selectedFilter === 'commercial') {
      filtered = filtered.filter(item => {
        return sections.some(section => 
          section.title === 'COMMERCIAL' && 
          section.items?.some(sectionItem => sectionItem.sys?.id === item.sys?.id)
        );
      });
    } else if (selectedFilter === 'set-design') {
      filtered = filtered.filter(item => {
        return sections.some(section => 
          section.title === 'SET DESIGN' && 
          section.items?.some(sectionItem => sectionItem.sys?.id === item.sys?.id)
        );
      });
    } else if (selectedFilter === 'film') {
      filtered = filtered.filter(item => {
        return sections.some(section => 
          section.title === 'FILM' && 
          section.items?.some(sectionItem => sectionItem.sys?.id === item.sys?.id)
        );
      });
    }

    return filtered.map((item, index) => ({ 
      ...item,
      displayOrder: index + 1
    }));
  }, [allItems, selectedFilter, sections]);

  // Animation logic with reorder effect
  useEffect(() => {
    if (filteredItems.length === 0) return;

    // When filter changes, trigger reorder animation
    if (!isInitialLoad) {
      setIsReordering(true);
      setVisibleItems(new Set());

      // First phase: fade out all items
      setTimeout(() => {
        // Second phase: fade in items with new order
        filteredItems.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => new Set(prev).add(index));
          }, index * 25); // Faster animation during reorder
        });
        
        // End reorder state
        setTimeout(() => {
          setIsReordering(false);
        }, filteredItems.length * 25 + 200);
      }, 100); // Brief pause between fade out and fade in
    } else {
      // Initial load animation (slower)
      const timer = setTimeout(() => {
        filteredItems.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => new Set(prev).add(index));
          }, index * 35);
        });
      }, 150);

      setIsInitialLoad(false);
      return () => clearTimeout(timer);
    }
  }, [filteredItems, isInitialLoad]);

  // Function to navigate to project page
  const handleProjectClick = (item: ArchiveItem) => {
    if (item.sys?.id) {
      router.push(`/archive/${item.sys.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 md:pt-28 pb-16">
      
      {/* Filter Section - solo visible en desktop */}
      <div className="hidden md:block absolute top-16 md:top-20 left-8 mb-8 z-10">
        <div className="flex items-center space-x-4">
          <span className="text-foreground text-[12px] uppercase tracking-wide font-medium">
            FILTER
          </span>
          <div className="relative">
            <select 
              className="appearance-none bg-transparent border border-foreground/20 rounded px-2 py-1 text-[12px] text-foreground focus:outline-none focus:border-foreground/40 transition-colors cursor-pointer"
              style={{ fontFamily: 'Suisse BP INTL' }}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="music-videos">Music Videos</option>
              <option value="commercial">Commercial</option>
              <option value="set-design">Set Design</option>
              <option value="film">Film</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Lista centrada en desktop, alineada a la izquierda en mobile */}
      <div className="flex-1 w-full flex md:justify-center justify-start pt-16" ref={containerRef}>
        <div className="relative w-full md:w-auto">
          {/* Container - responsive positioning */}
          <div className="space-y-0.5 px-8 md:px-0">
            {filteredItems.map((item, index) => (
              <div 
                key={`${item.sys?.id || index}-row`}
                className={`flex items-start group cursor-pointer hover:opacity-60 text-left relative transition-all ease-out ${
                  isReordering ? 'duration-300' : 'duration-700'
                } ${
                  visibleItems.has(index) 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-1'
                }`}
                style={{
                  transitionDelay: isReordering ? `${index * 25}ms` : `${index * 35}ms`
                }}
                onClick={() => handleProjectClick(item)}
              >
                {/* Mobile: layout flex normal, Desktop: layout absoluto centrado */}
                <div className="block md:hidden">
                  {/* Mobile layout */}
                  <div className="flex items-start">
                    <div className="py-0.5 w-8 flex justify-start">
                      <span 
                        className="text-foreground text-[10px] leading-3 font-normal" 
                        style={{ fontFamily: 'Suisse BP INTL' }}
                      >
                        {String(item.displayOrder).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="py-0.5 pl-4 flex-1">
                      <span className="text-foreground text-[10px] tracking-tight uppercase leading-3 block whitespace-nowrap">
                        {item.title || item.project}
                        {(item.artist || (item.company && item.company.trim())) && `, ${item.artist || item.company}`}
                        {item.year && ` (${item.year})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  {/* Desktop layout - centrado */}
                  <div className="absolute py-0.5 flex justify-center"
                       style={{
                         left: '50%',
                         transform: 'translateX(-50%)',
                         width: '32px'
                       }}>
                    <span 
                      className="text-foreground text-[10px] leading-3 font-normal" 
                      style={{ fontFamily: 'Suisse BP INTL' }}
                    >
                      {String(item.displayOrder).padStart(2, '0')}
                    </span>
                  </div>
                 
                  <div className="py-0.5 pl-2"
                       style={{
                         marginLeft: 'calc(50% + 16px)'
                       }}>
                    <span className="text-foreground text-[10px] tracking-tight uppercase leading-3 block whitespace-nowrap">
                      {item.title || item.project}
                      {(item.artist || (item.company && item.company.trim())) && `, ${item.artist || item.company}`}
                      {item.year && ` (${item.year})`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-8 right-8">
        <span className="text-xs opacity-60">© 2025</span>
      </footer>
    </div>
  );
};

export default Archive;