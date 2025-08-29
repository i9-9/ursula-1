'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import HomeHeroSkeleton from './HomeHeroSkeleton';
import { HeroSlide } from '@/lib/contentful';
import { useSplash } from '../contexts/SplashContext';

interface ClientHomeProps {
  heroSlides: HeroSlide[];
}

export default function ClientHome({ heroSlides }: ClientHomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { hideSplash } = useSplash();
  const [, setShowWorks] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Show splash for 2 seconds on home page, then hide it
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      hideSplash(); // Hide splash when content is ready
    }, 2000); // 2 seconds to show splash

    return () => clearTimeout(timer);
  }, [hideSplash]);

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
      {isLoading && <HomeHeroSkeleton />}
      <main className={`min-h-screen transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <FeaturedProject heroSlides={heroSlides} />
      </main>
    </>
  );
} 