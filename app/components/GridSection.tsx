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
    <section className="py-12 md:py-16 fade-in">
      <div className="mb-10">
        <h2 className="h2 tracking-wide section-title section-title-delay-1">Grid Section</h2>
      </div>
      <div className="">
        {items.map((item) => (
          <div
            key={item.id}
            className="col-span-12 md:col-span-6 lg:col-span-4 group cursor-pointer px-2.5 md:px-[15px]"
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
            <div className="mt-6">
              <h3 className="text-p font-medium">{item.title}</h3>
              <p className="text-sm opacity-70 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 