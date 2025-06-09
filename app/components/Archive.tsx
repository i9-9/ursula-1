'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ArchiveFilters from './ArchiveFilters';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';
import { ArchiveSection, ArchiveItem } from '@/lib/contentful';

interface ArchiveProps {
  sections: ArchiveSection[];
}

const Archive = ({ sections = [] }: ArchiveProps) => {
  useScrollReveal();

  const [hoveredItem, setHoveredItem] = useState<ArchiveItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [filters, setFilters] = useState<{ category: string | null }>({
    category: null
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAccordionHovered, setIsAccordionHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Filter sections based on selected filters
  const filteredSections = useMemo(() => {
    return sections.filter(section => {
      // If no filters are selected, show all sections
      if (!filters.category) return true;
      
      // Filter by category
      if (filters.category && section.title !== filters.category) return false;
      
      return true;
    });
  }, [filters, sections]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Solo para el tooltip del accordion
    const tooltipWidth = 210;
    const tooltipHeight = 150;
    
    const x = e.clientX + tooltipWidth > window.innerWidth 
              ? e.clientX - tooltipWidth 
              : e.clientX;
              
    const y = e.clientY + tooltipHeight > window.innerHeight 
              ? e.clientY - tooltipHeight 
              : e.clientY;
    
    setMousePosition({ x, y });
  };

  // Función para extraer ID de YouTube
  const extractYouTubeId = (url: string): string | null => {
    if (!url || !url.includes('youtu')) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleItemClick = (item: ArchiveItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const resetFilters = useCallback(() => {
    setFilters({
      category: null
    });
  }, []);

  // Listen for global event to close archive
  useEffect(() => {
    const closeArchive = () => setIsExpanded(false);
    const openArchive = () => setIsExpanded(true);
    
    window.addEventListener('close-archive', closeArchive);
    window.addEventListener('open-archive', openArchive);
    
    return () => {
      window.removeEventListener('close-archive', closeArchive);
      window.removeEventListener('open-archive', openArchive);
    };
  }, []);

  // Show loading state if no sections
  if (!sections || sections.length === 0) {
    return (
      <section id="archive" className="py-6 pb-0 md:py-8 px-2.5 md:px-[15px] relative" style={{ zIndex: 1 }}>
        <div className="mb-4 flex items-center justify-between py-2 rounded-lg">
          <h2 className="h2 section-title section-title-delay-2 font-neue-haas-grotesk-display">ARCHIVE</h2>
        </div>
        <div className="border-t border-gray-300/20 dark:border-gray-700/20"></div>
        <div className="py-10 text-center opacity-60">
          <p>Loading archive data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="archive" className="py-6 pb-0 md:py-8 px-2.5 md:px-[15px] relative" style={{ zIndex: 1 }} onMouseMove={handleMouseMove}>
      <div 
        className="mb-4 flex items-center justify-between cursor-pointer hover:bg-foreground/5 transition-colors duration-200 py-2 rounded-lg relative"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsAccordionHovered(true)}
        onMouseLeave={() => setIsAccordionHovered(false)}
        aria-label={isExpanded ? "Close archive" : "Open archive"}
      >
        <h2 className="h2 section-title section-title-delay-2 font-neue-haas-grotesk-display">ARCHIVE</h2>
        
        <div className={`text-xs transition-transform duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`}>
          ▼
        </div>
        
        {/* Tooltip mejorado que sigue al cursor */}
        {isAccordionHovered && (
          <div 
            className="fixed pointer-events-none z-50"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y - 30}px`, // Posicionado justo encima del cursor
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)', 
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isExpanded ? 'Close' : 'Open'}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-300/20 dark:border-gray-700/20"></div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1.0],
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden pt-6 relative"
          >
            {/* Componente de filtros con animación secuencial */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2,
                duration: 0.3
              }}
            >
              <ArchiveFilters 
                categories={sections.map(section => section.title)} 
                selectedCategory={filters.category}
                onCategoryChange={(category) => setFilters(prev => ({ ...prev, category }))}
                onReset={resetFilters}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="space-y-0"
            >
              {filteredSections.length > 0 ? (
                filteredSections.map((section, index) => (
                  <div key={index} className="archive-section">
                    <div className={`py-4`}>
                      <div className="text-sm md:text-base font-medium uppercase tracking-wide opacity-80">
                        {section.title}
                      </div>
                      
                      {/* Header for desktop */}
                      <div className="hidden md:grid md:grid-cols-12 mb-2 text-xs opacity-60">
                        <div className="col-span-6">{section.title === "COMMERCIAL" ? "CLIENT" : "PROJECT"}</div>
                        <div className="col-start-7 col-span-3">YEAR</div>
                        <div className="col-start-10 col-span-3">PROD COMPANY</div>
                      </div>
                      
                      {/* Header for mobile */}
                      <div className="md:hidden mb-3 text-xs opacity-60">
                        <div>{section.title === "COMMERCIAL" ? "CLIENT" : "PROJECT"}</div>
                      </div>
                      
                      <div className="space-y-0">
                        {section.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="group cursor-pointer hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1 mb-0 relative"
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => handleItemClick(item)}
                          >
                            {/* Desktop layout (3 columns) */}
                            <div className="hidden md:grid md:grid-cols-12 items-start">
                              <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p uppercase">{item.project}</div>
                              <div className="col-start-7 col-span-3 text-left whitespace-nowrap text-p">{item.year}</div>
                              <div className="col-start-10 col-span-3 text-left whitespace-nowrap overflow-visible text-p uppercase">{item.company}</div>
                            </div>
                            
                            {/* Mobile layout */}
                            <div className="md:hidden">
                              <div className="flex flex-col">
                                <div className="font-medium text-p mb-1 uppercase">{item.project}</div>
                                {(item.year || item.company) && (
                                  <div className="text-sm opacity-70 flex items-center flex-wrap">
                                    {item.year && <span className="mr-2">{item.year}</span>}
                                    {item.company && <span className="uppercase">{item.company}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-60">
                  <p>No results found for selected filters</p>
                  <button 
                    className="mt-4 text-xs px-3 py-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </motion.div>

            {/* Imagen de hover centrada en el componente (solo en desktop) */}
            <AnimatePresence>
              {hoveredItem && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
                >
                  <div className="w-[800px] h-[600px] relative shadow-2xl rounded-lg overflow-hidden border border-white/20">
                    {hoveredItem.thumbnail ? (
                      <Image
                        src={hoveredItem.thumbnail}
                        alt={hoveredItem.project}
                        fill
                        sizes="800px"
                        className="object-cover"
                        priority={false}
                        loading="lazy"
                        quality={95}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Sin imagen</span>
                      </div>
                    )}
                    {/* Título del proyecto en el tooltip */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-sm p-4">
                      <div className="font-medium truncate">{hoveredItem.project}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para visualización móvil y desktop */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-[90vw] md:max-w-4xl w-full rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video container */}
              <div className="relative w-full aspect-video bg-black">
                {selectedItem.vimeoId ? (
                  // Video de Vimeo con autoplay y sin controles
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedItem.vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0&controls=0`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedItem.project}
                  />
                ) : selectedItem.videoUrl && extractYouTubeId(selectedItem.videoUrl) ? (
                  // Video de YouTube con autoplay y sin controles
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedItem.videoUrl)}?autoplay=1&loop=1&controls=0&showinfo=0&rel=0&mute=1&playlist=${extractYouTubeId(selectedItem.videoUrl)}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedItem.project}
                  />
                ) : selectedItem.videoUrl ? (
                  // Fallback para otros tipos de video
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-sm">Video disponible</p>
                      <a 
                        href={selectedItem.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 underline text-sm mt-2 inline-block"
                      >
                        Ver en fuente externa
                      </a>
                    </div>
                  </div>
                ) : selectedItem.thumbnail ? (
                  // Mostrar imagen si no hay video
                  <Image 
                    src={selectedItem.thumbnail}
                    alt={selectedItem.project}
                    fill
                    sizes="(max-width: 768px) 90vw, 800px"
                    className="object-cover"
                    priority={true}
                  />
                ) : (
                  // Placeholder si no hay contenido
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                    <span className="text-sm">Sin contenido disponible</span>
                  </div>
                )}
                
                {/* Botón de cerrar */}
                <button 
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              {/* Información del proyecto */}
              <div className="p-6 bg-white">
                <h4 className="text-lg md:text-xl font-medium uppercase text-black">{selectedItem.project}</h4>
                <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-gray-600">
                  {selectedItem.year && <span>{selectedItem.year}</span>}
                  {selectedItem.company && <span className="uppercase">{selectedItem.company}</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Archive; 