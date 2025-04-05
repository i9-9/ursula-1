'use client';

import { useState, useRef, useEffect } from 'react';

interface MarqueeItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  client: string;
  type: 'image' | 'video';
  videoUrl?: string;
}

// This would come from CMS in production
const dummyItems: MarqueeItem[] = [
  { 
    id: '1', 
    src: '/images/hero/chita - sola.png', 
    alt: 'Chita - Sola', 
    title: 'SOLA',
    client: 'CHITA',
    type: 'image'
  },
  { 
    id: '2', 
    src: '/images/hero/saramalacara - mas feliz.png', 
    alt: 'Sara Malacara - Más Feliz', 
    title: 'MÁS FELIZ',
    client: 'SARA MALACARA',
    type: 'image'
  },
  { 
    id: '3', 
    src: '/images/hero/swaggerboys & dillom - el morocho, el rubio y el colo.png', 
    alt: 'Swagger Boys & Dillom - El Morocho, El Rubio y El Colo', 
    title: 'EL MOROCHO, EL RUBIO Y EL COLO',
    client: 'SWAGGER BOYS & DILLOM',
    type: 'image'
  },
];

const HeroMarquee = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-advance slides every 7 seconds if not paused
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyItems.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle horizontal scroll navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Let native horizontal scroll work
      
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scroll down = next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyItems.length);
      } else if (e.deltaY < 0) {
        // Scroll up = previous slide
        setCurrentIndex((prevIndex) => prevIndex === 0 ? dummyItems.length - 1 : prevIndex - 1);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (slider) {
        slider.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Handle video playback when slide changes
  useEffect(() => {
    const currentItem = dummyItems[currentIndex];
    if (currentItem.type === 'video') {
      const videoElement = videoRefs.current[currentIndex];
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(err => console.error('Error playing video:', err));
      }
    }
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyItems.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? dummyItems.length - 1 : prevIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section 
      className="relative pt-16 md:pt-20 pb-8 px-[30px] h-[100vh] flex flex-col overflow-hidden bg-background"
      ref={containerRef}
    >
      <div 
        className="relative w-full flex-grow overflow-hidden" 
        ref={sliderRef}
      >
        <div className="h-full flex items-center">
          <div 
            className="flex transition-transform duration-500"
            style={{ 
              transform: `translateX(-${currentIndex * 95}%)`,
              width: `${dummyItems.length * 100}%`
            }}
          >
            {dummyItems.map((item, index) => (
              <div
                key={item.id}
                className="relative flex-shrink-0 px-4"
                style={{ width: '95%', height: '100%' }}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="w-full h-full relative">
                  <div className="w-full aspect-video flex items-center justify-center">
                    {item.type === 'video' ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={item.videoUrl}
                        poster={item.src}
                        muted
                        playsInline
                        className="max-w-full max-h-full object-contain"
                        aria-label={item.alt}
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project metadata below image/video */}
      <div className="flex justify-between items-end pt-2 h-12 md:h-14 lg:h-16">
        {/* Project info - Left side */}
        <div className="max-w-full w-full">
          <p className="text-small tracking-wide opacity-70 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{dummyItems[currentIndex].client}</p>
          <h2 className="text-p md:h5 lg:h4 tracking-wider font-medium whitespace-nowrap overflow-hidden text-ellipsis">{dummyItems[currentIndex].title}</h2>
        </div>
      </div>
    </section>
  );
};

export default HeroMarquee; 