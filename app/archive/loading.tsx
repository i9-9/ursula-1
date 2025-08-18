'use client';

import { motion } from 'framer-motion';

export default function ArchiveLoading() {
  return (
    <div className="min-h-screen bg-background pt-[var(--navbar-height)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </motion.div>

        {/* Filters skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          ))}
        </motion.div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="space-y-3"
            >
              {/* Image skeleton */}
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              
              {/* Text skeleton */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
