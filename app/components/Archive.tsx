'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useHydration, useSafeBrowserEffect } from '../hooks/useHydration';
import { Project } from '@/lib/contentful';
import { generateSemanticSlug } from '@/lib/slug-utils';

interface ArchiveProps {
  projects: Project[];
}

const Archive = ({ projects }: ArchiveProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [animationKey, setAnimationKey] = useState(0); // Force re-render on filter change
  const isHydrated = useHydration();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Leer filtro inicial desde URL params
  useEffect(() => {
    const filterFromUrl = searchParams.get('filter');
    if (filterFromUrl && ['music-videos', 'commercial', 'set-design', 'narrative'].includes(filterFromUrl)) {
      setSelectedFilter(filterFromUrl);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    // Debug: Ver todas las categorías únicas que están llegando
    const uniqueCategories = [...new Set(projects.map(p => p.category))];
    console.log('🔍 Todas las categorías en los datos:', uniqueCategories);
    
    let filtered = projects.filter(project => {
      const hasTitle = !!(project.title && project.title.trim());
      const hasArtist = !!(project.artist && project.artist.trim());
      return hasTitle && hasArtist;
    });
    
    if (selectedFilter === 'music-videos') {
      console.log('Filtering music video...');
      console.log('Projects before filter:', filtered.length);
      console.log('Sample categories:', filtered.slice(0, 3).map(p => ({ title: p.title, category: p.category })));
      // Filtrar proyectos de MUSIC VIDEO
      filtered = filtered.filter(project => {
        const category = project.category?.toUpperCase();
        return category === 'MUSIC VIDEO';
      });
      console.log('Projects after filter:', filtered.length);
    } else if (selectedFilter === 'commercial') {
      filtered = filtered.filter(project => project.category?.toUpperCase() === 'COMMERCIAL');
    } else if (selectedFilter === 'set-design') {
      filtered = filtered.filter(project => project.category?.toUpperCase() === 'SET DESIGN');
    } else if (selectedFilter === 'narrative') {
      filtered = filtered.filter(project => project.category?.toUpperCase() === 'NARRATIVE');
    }

    return filtered.map((project, index) => ({ 
      ...project,
      displayOrder: project.archiveOrder || index + 1
    })).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, selectedFilter]);

  // Animation logic - handles both initial load and filter changes
  useSafeBrowserEffect(() => {
    if (filteredItems.length === 0) return;

    // Reset animation state - hide all items immediately
    setVisibleItems(new Set());
    setAnimationKey(prev => prev + 1);

    // Start animation sequence after a brief delay
    const resetTimer = setTimeout(() => {
      filteredItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(index));
        }, index * 40); // 40ms delay between each item
      });
    }, 50); // 50ms delay before starting animation

    return () => clearTimeout(resetTimer);
  }, [filteredItems, selectedFilter, isHydrated]);

  const handleProjectClick = (item: Project) => {
    if (item.title && item.artist) {
      const semanticSlug = generateSemanticSlug(item.title, item.artist);
      const url = `/work/${semanticSlug}`;
      router.push(url);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pt-20 pt-8" style={{ minHeight: 'calc(100vh - 36px)' }}>
      
      {/* Filter Section */}

      <div className="absolute md:top-16 left-8 mb-16 z-10 md:block hidden">
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
              <option value="music-videos">Music Video</option>
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
      <div className="block md:hidden px-4 mb-16">
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
              <option value="music-videos">Music Video</option>
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
      <div className="flex-1 w-full md:pt-2 pt-0" ref={containerRef}>
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
                      transitionDelay: `${index * 40}ms`
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
                  transitionDelay: `${index * 80}ms`
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