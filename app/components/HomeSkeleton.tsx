'use client';

import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section skeleton */}
      <section className="relative h-[calc(100vh-var(--navbar-height))] flex items-center justify-center animate-pulse pt-8">
        <div className="text-center space-y-6">
          <div className="h-16 bg-foreground/10 rounded w-64 mx-auto"></div>
          <div className="h-8 bg-foreground/10 rounded w-48 mx-auto"></div>
        </div>
      </section>

      {/* Featured projects skeleton */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-pulse">
            <div className="h-8 bg-foreground/10 rounded w-1/4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`featured-${index}`} className="animate-pulse">
                <div className="aspect-video bg-foreground/10 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
                  <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSkeleton;
