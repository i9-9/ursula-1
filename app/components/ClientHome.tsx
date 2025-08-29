'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import HomeLoader from './HomeLoader';
import { HeroSlide } from '@/lib/contentful';

interface ClientHomeProps {
  heroSlides: HeroSlide[];
}

export default function ClientHome({ heroSlides }: ClientHomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setShowWorks] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Debug log para verificar heroSlides
  console.log('🔍 ClientHome: heroSlides recibidos:', heroSlides);
  console.log('🔍 ClientHome: Cantidad de heroSlides:', heroSlides?.length);

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
      {isLoading && <HomeLoader onLoadingComplete={handleLoadingComplete} duration={100} />}
      <main className={`min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <FeaturedProject heroSlides={heroSlides} />
      </main>
    </>
  );
} 