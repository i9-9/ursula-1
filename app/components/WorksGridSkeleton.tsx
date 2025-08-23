'use client';

import React from 'react';

const WorksGridSkeleton = () => {
  return (
    <div className="min-h-screen bg-background px-8 pt-20 md:pt-28 pb-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Generate skeleton items */}
          {Array.from({ length: 9 }).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="group relative animate-pulse"
            >
              {/* Video/Image skeleton */}
              <div className="aspect-video bg-foreground/10 rounded-lg mb-4"></div>
              
              {/* Project number skeleton */}
              <div className="absolute -top-12 left-0">
                <div className="h-6 w-8 bg-foreground/10 rounded"></div>
              </div>
              
              {/* Project title skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
                <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorksGridSkeleton;
