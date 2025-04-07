'use client';

import { useState } from 'react';
import LazyVideo from './LazyVideo';

interface GridItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
}

interface GridSectionProps {
  items: GridItem[];
}

const GridSection = ({ items }: GridSectionProps) => {
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: GridItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <section className="py-16 md:py-20 px-5 md:px-[30px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => openModal(item)}
          >
            <div className="aspect-video w-full">
              <LazyVideo
                src={item.videoUrl}
                poster={item.poster}
                alt={item.title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-p font-medium">{item.title}</h3>
              <p className="text-sm opacity-70 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[9999999]">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center">
            <div 
              className="relative w-full max-w-4xl mx-4 bg-background rounded"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-background text-p opacity-70 hover:opacity-100 transition-opacity border border-foreground/10 z-10"
              >
                ×
              </button>
              <div className="aspect-video w-full">
                <LazyVideo
                  src={selectedItem.videoUrl}
                  poster={selectedItem.poster}
                  alt={selectedItem.title}
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-p font-medium mb-2">{selectedItem.title}</h3>
                <p className="text-sm opacity-70">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GridSection; 