'use client';

import { motion } from 'framer-motion';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background pt-[var(--navbar-height)]">
      {/* Hero section skeleton */}
      <div className="relative h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Background image skeleton */}
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          
          {/* Content overlay skeleton */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6">
              {/* Title skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="h-16 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
                <div className="h-8 bg-gray-300 rounded w-80 mx-auto animate-pulse"></div>
              </motion.div>
              
              {/* Subtitle skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-2"
              >
                <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-48 mx-auto animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured project skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Section title */}
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
            </div>
            
            {/* Project grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
