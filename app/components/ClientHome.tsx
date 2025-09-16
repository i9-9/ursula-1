'use client';

import { useState, useEffect } from 'react';
import FeaturedProject from './FeaturedProject'
import { HeroSlide } from '@/lib/contentful';

interface ClientHomeProps {
  heroSlides: HeroSlide[];
}

export default function ClientHome({ heroSlides }: ClientHomeProps) {
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
      <FeaturedProject heroSlides={heroSlides} />
    </main>
  );
} 