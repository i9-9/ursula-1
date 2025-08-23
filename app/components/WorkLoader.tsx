'use client';

import { useState } from 'react';
import WorksGrid from './WorksGrid';
import HomeLoader from './HomeLoader';
import { PortfolioItem } from '@/lib/contentful';

interface WorkLoaderProps {
  works: PortfolioItem[];
}

export default function WorkLoader({ works }: WorkLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <HomeLoader onLoadingComplete={handleLoadingComplete} />}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <WorksGrid works={works} />
      </div>
    </>
  );
}
