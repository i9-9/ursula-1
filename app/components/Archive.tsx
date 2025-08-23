'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useHydration, useSafeBrowserEffect } from '../hooks/useHydration';

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
  const isHydrated = useHydration();
  const containerRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => {
    if (!sections || !Array.isArray(sections)) return [];
    
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

  const filteredItems = useMemo(() => {
    if (!allItems || allItems.length === 0) return [];
    
    let filtered = allItems.filter(item => {
      const hasTitle = !!(item.title && item.title.trim());
      const hasProject = !!(item.project && item.project.trim());
      return hasTitle || hasProject;
    });

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

  // Animation logic - only run after hydration
  useSafeBrowserEffect(() => {
    if (filteredItems.length === 0) return;

    if (!isInitialLoad) {
      setVisibleItems(new Set());

      setTimeout(() => {
        filteredItems.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => new Set(prev).add(index));
          }, index * 25);
        });
        
        setTimeout(() => {
          setIsInitialLoad(false);
        }, filteredItems.length * 25 + 200);
      }, 100);
    } else {
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

  const handleProjectClick = (item: ArchiveItem) => {
    if (item.sys?.id) {
      router.push(`/archive/${item.sys.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 md:pt-28 pb-16">
      
      {/* Filter Section */}
      <div className="absolute top-16 md:top-20 left-8 mb-8 z-10 md:block hidden">
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

      {/* Mobile Filter */}
      <div className="hidden md:hidden px-4 mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-foreground text-[10px] uppercase tracking-wide font-medium">
            FILTER
          </span>
          <div className="relative">
            <select 
              className="appearance-none bg-transparent border border-foreground/20 rounded px-2 py-1 text-[10px] text-foreground focus:outline-none focus:border-foreground/40 transition-colors cursor-pointer"
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

      {/* Main Content */}
      <div className="flex-1 w-full pt-8 md:pt-16" ref={containerRef}>
        {/* Desktop - Grid de 2 columnas */}
        <div className="hidden md:block w-full px-8">
          <div className="grid grid-cols-2 gap-2">
            {/* Columna 1: vacía */}
            <div></div>
            
            {/* Columna 2: ARCHIVE - aquí va la lista */}
            <div>
              <div className="space-y-2">
                {filteredItems.map((item, index) => (
                  <div 
                    key={`${item.sys?.id || `item-${index}`}-row`}
                    className={`group cursor-pointer hover:opacity-60 text-left relative transition-all duration-500 ease-out ${
                      isHydrated && visibleItems.has(index)
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-100 transform translate-y-0'
                    }`}
                    style={{
                      transitionDelay: isHydrated ? `${index * 80}ms` : '0ms'
                    }}
                    onClick={() => handleProjectClick(item)}
                  >
                    <span 
                      className="text-foreground text-[10px] tracking-tight uppercase leading-none block text-left whitespace-nowrap"
                      style={{ fontFamily: 'Suisse BP INTL' }}
                    >
                      <span className="inline-block w-8 text-[7px]">{String(item.displayOrder).padStart(2, '0')}</span>
                      {item.title || item.project}
                      {(item.artist || (item.company && item.company.trim())) && `, ${item.artist || item.company}`}
                      {item.year && ` (${item.year})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Columnas 8-12: vacías */}
            <div className="col-span-5"></div>
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="block md:hidden px-4">
          <div className="space-y-3 max-w-sm mx-auto">
            {filteredItems.map((item, index) => (
              <div 
                key={`${item.sys?.id || `item-${index}`}-row`}
                className={`group cursor-pointer hover:opacity-60 text-left relative transition-all duration-500 ease-out ${
                  isHydrated && visibleItems.has(index)
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-100 transform translate-y-0'
                }`}
                style={{
                  transitionDelay: isHydrated ? `${index * 80}ms` : '0ms'
                }}
                onClick={() => handleProjectClick(item)}
              >
                <div className="flex">
                  <span className="inline-block w-6 text-[7px] text-foreground tracking-tight uppercase leading-none flex-shrink-0" style={{ fontFamily: 'Suisse BP INTL' }}>
                    {String(item.displayOrder).padStart(2, '0')}
                  </span>
                  <span 
                    className="text-foreground text-[9px] tracking-tight uppercase leading-none flex-1"
                    style={{ fontFamily: 'Suisse BP INTL' }}
                  >
                    {item.title || item.project}
                    {(item.artist || (item.company && item.company.trim())) && `, ${item.artist || item.company}`}
                    {item.year && ` (${item.year})`}
                  </span>
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