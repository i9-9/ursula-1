'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHydration, useSafeBrowserEffect } from '../hooks/useHydration';
import { Project } from '@/lib/contentful';
import { generateSemanticSlug } from '@/lib/slug-utils';

interface ArchiveProps {
  projects: Project[];
}

const Archive = ({ projects }: ArchiveProps) => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [animationKey, setAnimationKey] = useState(0); // Force re-render on filter change
  const isHydrated = useHydration();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    let filtered = projects.filter(project => {
      const hasTitle = !!(project.title && project.title.trim());
      const hasArtist = !!(project.artist && project.artist.trim());
      return hasTitle && hasArtist;
    });
    
    if (selectedFilter === 'music-videos') {
      filtered = filtered.filter(project => project.category === 'MUSIC VIDEOS');
    } else if (selectedFilter === 'commercial') {
      filtered = filtered.filter(project => project.category === 'COMMERCIAL');
    } else if (selectedFilter === 'set-design') {
      filtered = filtered.filter(project => project.category === 'SET DESIGN');
    } else if (selectedFilter === 'narrative') {
      filtered = filtered.filter(project => project.category === 'NARRATIVE');
    }

    return filtered.map((project, index) => ({ 
      ...project,
      displayOrder: project.archiveOrder || index + 1
    })).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, selectedFilter]);

  // Reset animation when filter changes
  useEffect(() => {
    setVisibleItems(new Set());
    setAnimationKey(prev => prev + 1);
  }, [selectedFilter]);

  // Animation logic - only run after hydration
  useSafeBrowserEffect(() => {
    if (filteredItems.length === 0) return;

    // Reset animation state - hide all items immediately
    setVisibleItems(new Set());

    // Force a re-render to ensure all items are hidden
    const resetTimer = setTimeout(() => {
      // Start animation sequence after reset is complete
      filteredItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(index));
        }, index * 80);
      });
    }, 100); // Reduced delay for faster reset

    return () => clearTimeout(resetTimer);
  }, [filteredItems, isHydrated]);

  const handleProjectClick = (item: Project) => {
    console.log('=== ARCHIVE NAVIGATION DEBUG ===');
    console.log('Project clicked:', item);
    console.log('Title:', item.title);
    console.log('Artist:', item.artist);
    
    if (item.title && item.artist) {
      const semanticSlug = generateSemanticSlug(item.title, item.artist);
      const url = `/work/${semanticSlug}`;
      console.log('🚀 Generated semantic slug:', semanticSlug);
      console.log('🚀 Navigating to WORK URL:', url);
      router.push(url);
    } else {
      console.error('❌ Missing title or artist for project:', item);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 pb-16">
      
      {/* Filter Section */}
      <div className="absolute top-12 md:top-16 left-8 mb-8 z-10 md:block hidden">
        <div className="flex items-center space-x-4">
          <span className="text-foreground text-[12px] uppercase tracking-wide font-regular">
            FILTER
          </span>
          <div className="relative">
            <select 
              className="appearance-none bg-transparent border border-foreground/20 rounded px-3 py-1 text-[12px] text-foreground focus:outline-none focus:border-foreground/40 transition-colors cursor-pointer min-w-[120px]"
              style={{ fontFamily: 'Suisse BP INTL' }}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="music-videos">Music Videos</option>
              <option value="commercial">Commercial</option>
              <option value="set-design">Set Design</option>
              <option value="narrative">Narrative</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
              <option value="narrative">Narrative</option>
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
      <div className="flex-1 w-full pt-2" ref={containerRef}>
        {/* Desktop - Grid de 12 columnas usando solo Tailwind */}
        <div className="hidden md:block w-full px-8">
          <div className="grid grid-cols-12 gap-2">
            {/* Columnas 1-4: Vacías */}
            <div className="col-span-4"></div>
            
            {/* Columnas 5-8: Lista de proyectos - alineada con navbar */}
            <div className="col-span-4 flex justify-start items-start" key={`archive-column-${animationKey}`}>
              <div className="space-y-1.5" style={{marginLeft: 'calc(33.333% + 52px)'}}>
                {filteredItems.map((item, index) => (
                  <div 
                    key={`${item.id || `item-${index}`}-row`}
                    className={`group cursor-pointer hover:opacity-60 relative transition-all duration-500 ease-out text-left ${
                      visibleItems.has(index)
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-4'
                    }`}
                    style={{
                      transitionDelay: `${(item.displayOrder || index) * 80}ms`
                    }}
                    onClick={() => handleProjectClick(item)}
                  >
                    <span 
                      className="text-foreground text-[12px] tracking-tight uppercase leading-none block whitespace-nowrap"
                      style={{ fontFamily: 'Suisse BP INTL' }}
                    >
                      <span className="inline-block w-6 text-[9px]">{String(item.displayOrder).padStart(2, '0')}</span>
                      {item.title}
                      {item.artist && `, ${item.artist}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Columnas 9-12: Vacías */}
            <div className="col-span-4"></div>
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="block md:hidden px-4" key={`mobile-archive-${animationKey}`}>
          <div className="space-y-2 max-w-sm mx-auto">
            {filteredItems.map((item, index) => (
              <div 
                key={`${item.id || `item-${index}`}-row`}
                className={`group cursor-pointer hover:opacity-60 text-left relative transition-all duration-500 ease-out ${
                  visibleItems.has(index)
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}
                style={{
                  transitionDelay: `${(item.displayOrder || index) * 80}ms`
                }}
                onClick={() => handleProjectClick(item)}
              >
                <div className="flex">
                  <span className="inline-block w-6 text-[11px] text-foreground tracking-tight uppercase leading-none flex-shrink-0" style={{ fontFamily: 'Suisse BP INTL' }}>
                    {String(item.displayOrder).padStart(2, '0')}
                  </span>
                  <span 
                    className="text-foreground text-[14px] tracking-tight uppercase leading-none flex-1"
                    style={{ fontFamily: 'Suisse BP INTL' }}
                  >
                    {item.title}
                    {item.artist && `, ${item.artist}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Archive; 