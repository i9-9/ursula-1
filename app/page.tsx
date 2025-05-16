'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './components/FeaturedProject'
import WorksGrid from './components/WorksGrid'
import Archive from './components/Archive'
import Contact from './components/Contact'

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    works: false,
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

    window.addEventListener('show-section', handleShowSection as EventListener);
    return () => {
      window.removeEventListener('show-section', handleShowSection as EventListener);
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
