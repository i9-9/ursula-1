'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import HomeLoader from './HomeLoader';
import { PortfolioItem, ArchiveSection } from '@/lib/contentful';

interface ClientHomeProps {
  initialPortfolioItems: PortfolioItem[];
  archiveSections: ArchiveSection[];
}

export default function ClientHome({ initialPortfolioItems }: ClientHomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setShowWorks] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setShowWorks(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && <HomeLoader onLoadingComplete={handleLoadingComplete} />}
      <main className={`min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <FeaturedProject works={initialPortfolioItems} />
      </main>
    </>
  );
} 