'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import { PortfolioItem, ArchiveSection } from '@/lib/contentful';

interface ClientHomeProps {
  initialPortfolioItems: PortfolioItem[];
  archiveSections: ArchiveSection[];
}

export default function ClientHome({ initialPortfolioItems }: ClientHomeProps) {
  const [, setShowWorks] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  

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
    <main className="min-h-screen">
      <FeaturedProject works={initialPortfolioItems} />
    </main>
  );
} 