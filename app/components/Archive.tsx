'use client';

import React, { useState, useMemo } from 'react';

// Types matching your Contentful structure
interface ArchiveItem {
  project?: string;
  company?: string;
  year?: string;
  thumbnail?: string;
  videoUrl?: string;
  vimeoId?: string;
  order?: number;
}

interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
  order?: number;
}

interface ArchiveProps {
  sections: ArchiveSection[];
}

const Archive = ({ sections = [] }: ArchiveProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  // Get all unique categories from sections
  const categories = useMemo(() => {
    if (!sections || sections.length === 0) return ['all'];
    const cats = ['all', ...sections.map(section => section.title)];
    return [...new Set(cats)];
  }, [sections]);

  // Get all items from all sections with their category
  const allItems = useMemo(() => {
    const items: (ArchiveItem & { category: string })[] = [];
    sections.forEach(section => {
      section.items.forEach(item => {
        items.push({
          ...item,
          category: section.title
        });
      });
    });
    return items;
  }, [sections]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return allItems;
    }
    return allItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory, allItems]);

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url || !url.includes('youtu')) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Show loading state if no sections
  if (!sections || sections.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="text-center opacity-60">
          <p>Loading archive data...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="mb-12">
          <label className="text-xs tracking-wider mr-3">FILTER</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-black px-3 py-1 text-sm bg-white focus:outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'ALL' : cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Items List */}
        <div className="space-y-1">
          {filteredItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-start group cursor-pointer hover:opacity-60 transition-opacity"
              onClick={() => setSelectedItem(item)}
            >
              <span className="text-black mr-4 text-sm leading-6 font-mono">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="text-sm tracking-wide leading-6">
                <span className="uppercase">
                  {item.project}
                  {item.company && `, ${item.company}`}
                  {item.year && ` (${item.year})`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer - optional, remove if handled elsewhere */}
        <div className="mt-16 text-right text-xs opacity-60">
          © 2025
        </div>
      </section>

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full rounded-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video/Image Container */}
            <div className="relative w-full aspect-video bg-black">
              {selectedItem.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${selectedItem.vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={selectedItem.project}
                />
              ) : selectedItem.videoUrl && extractYouTubeId(selectedItem.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedItem.videoUrl)}?autoplay=1&loop=1&mute=1`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={selectedItem.project}
                />
              ) : selectedItem.thumbnail ? (
                <img 
                  src={selectedItem.thumbnail}
                  alt={selectedItem.project || ''}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <span className="text-sm">No content available</span>
                </div>
              )}
              
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 w-8 h-8 flex items-center justify-center rounded transition-colors"
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            {/* Info */}
            <div className="p-6 bg-white">
              <h3 className="text-lg font-medium uppercase tracking-wide">{selectedItem.project}</h3>
              <div className="mt-2 text-sm opacity-60">
                {selectedItem.company && <span className="uppercase">{selectedItem.company}</span>}
                {selectedItem.year && <span className="ml-3">{selectedItem.year}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Archive;