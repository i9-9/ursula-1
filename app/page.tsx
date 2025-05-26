'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './components/FeaturedProject'
import WorksGrid from './components/WorksGrid'
import Archive from './components/Archive'
import Contact from './components/Contact'

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    works: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    archive: false,
    contact: false
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
      <FeaturedProject works={[]} />
      {visibleSections.works && <WorksGrid works={[]} />}
      {visibleSections.archive && <Archive />}
      {visibleSections.contact && <Contact />}
    </main>
  )
}
