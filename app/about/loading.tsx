'use client';

import { motion } from 'framer-motion';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background pt-[var(--navbar-height)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </motion.div>

        {/* Content skeleton */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Image skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </motion.div>

          {/* Text sections skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </motion.div>
          ))}

          {/* Contact info skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center pt-8"
          >
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="flex justify-center gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
