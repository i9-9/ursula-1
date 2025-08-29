'use client';

import React from 'react';
import UrsulaLogo from './UrsulaLogo';

const HomeHeroSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
      {/* Logo centrado con animación pulse */}
      <div className="flex items-center justify-center">
        <UrsulaLogo 
          width={300} 
          height={50} 
          className="text-foreground animate-pulse"
        />
      </div>
    </div>
  );
};

export default HomeHeroSkeleton;
