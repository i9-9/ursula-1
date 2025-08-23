'use client';

import React from 'react';

const AboutSkeleton = () => {
  return (
    <div className="min-h-screen bg-background px-8 pt-32 md:pt-80 pb-16">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="mb-16 animate-pulse">
          <div className="h-12 bg-foreground/10 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-foreground/10 rounded w-1/2"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-8 animate-pulse">
          {/* Paragraph skeletons */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`paragraph-${index}`} className="space-y-3">
              <div className="h-4 bg-foreground/10 rounded w-full"></div>
              <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
              <div className="h-4 bg-foreground/10 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSkeleton;
