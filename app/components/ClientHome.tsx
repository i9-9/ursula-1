'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import WorksGrid from './WorksGrid'
import Archive from './Archive'
import Contact from './Contact'
import { PortfolioItem, HeroSlide, ArchiveSection } from '@/lib/contentful';

interface ClientHomeProps {
  initialPortfolioItems: PortfolioItem[];
  initialHeroSlides: HeroSlide[];
  archiveSections: ArchiveSection[];
}

export default function ClientHome({ initialPortfolioItems, initialHeroSlides, archiveSections }: ClientHomeProps) {
  const [visibleSections, setVisibleSections] = useState({
    works: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    archive: false,
    contact: false
  });

  console.log('Client received:', {
    portfolioItems: initialPortfolioItems.length,
    heroSlides: initialHeroSlides.length,
    archiveSections: archiveSections.length
  });

  useEffect(() => {
    const handleShowSection = (event: CustomEvent) => {
      const section = event.detail as keyof typeof visibleSections;
      setVisibleSections(prev => ({
        ...prev,
        [section]: true
      }));
    };

    const handleResize = () => {
      setVisibleSections(prev => ({
        ...prev,
        works: window.innerWidth < 768
      }));
    };

    window.addEventListener('show-section', handleShowSection as EventListener);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('show-section', handleShowSection as EventListener);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <FeaturedProject works={initialPortfolioItems} />
      {visibleSections.works && <WorksGrid works={initialPortfolioItems} />}
      {visibleSections.archive && <Archive sections={archiveSections} />}
      {visibleSections.contact && <Contact />}
    </main>
  );
} 