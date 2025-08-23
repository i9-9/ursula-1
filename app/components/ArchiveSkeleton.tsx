'use client';

import React from 'react';

const ArchiveSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col px-8 pt-20 md:pt-28 pb-16">
      {/* Main Content - Left aligned with navbar ARCHIVE */}
      <div className="flex flex-col justify-center min-h-screen">
        <main className="w-full">
          {/* Archive list skeleton */}
          <div className="w-full">
            <div className="space-y-1 md:ml-0 mx-auto md:mx-0 max-w-none md:max-w-none w-auto md:w-auto">
              {/* Generate skeleton items */}
              {Array.from({ length: 12 }).map((_, index) => (
                <div 
                  key={`skeleton-${index}`}
                  className="flex items-start group animate-pulse"
                >
                  {/* Number column skeleton */}
                  <div className="flex-shrink-0 w-8 py-0 pl-0 m-0">
                    <div className="h-4 bg-foreground/10 rounded w-6"></div>
                  </div>
                 
                  {/* Project name column skeleton */}
                  <div className="flex-1 py-0 pl-2">
                    <div className="h-4 bg-foreground/10 rounded w-48 md:w-64"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer skeleton */}
      <footer className="fixed bottom-8 right-8">
        <div className="h-3 bg-foreground/10 rounded w-8"></div>
      </footer>
    </div>
  );
};

export default ArchiveSkeleton;
