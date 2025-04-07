'use client';

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
  onOpenModal: (item: GridItem) => void;
}

export default function GridSection({ items, onOpenModal }: GridSectionProps) {
  return (
    <section className="py-16 md:py-20 px-5 md:px-[30px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => onOpenModal(item)}
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
    </section>
  );
} 