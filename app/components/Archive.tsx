'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ArchiveFilters from './ArchiveFilters';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

interface ArchiveItem {
  project: string;
  year: string;
  company: string;
}

interface ArchiveSection {
  title: string;
  items: ArchiveItem[];
}

interface ArchiveDataProps {
  sections: ArchiveSection[];
}

// Datos de archivo
const archiveData: ArchiveDataProps = {
  sections: [
    {
      title: "MUSIC VIDEO",
      items: [
        {
          project: "yatra - pelirroja",
          year: "2025",
          company: "the movement / landia"
        },
        {
          project: "swaggerboys & dillom - el morocho, el rubio y el colo",
          year: "2024",
          company: "arena collective"
        },
        {
          project: "milo j - tres pecados despues",
          year: "2024",
          company: "arena collective"
        },
        {
          project: "milo j - ali oli",
          year: "2024",
          company: "poster"
        },
        {
          project: "dillom - cirugia",
          year: "2024",
          company: "poster"
        },
        {
          project: "dillom - buenos tiempos",
          year: "2024",
          company: "bunker"
        },
        {
          project: "taichu ft. lali - s.o.s",
          year: "2024",
          company: "castadiva"
        },
        {
          project: "saramalacara - mas feliz",
          year: "2024",
          company: "the movement / landia"
        },
        {
          project: "chita - sola",
          year: "2023",
          company: "mamahungara"
        },
        {
          project: "conociendo rusia & natalia lafourcade - cinco horas",
          year: "2024",
          company: "the movement / landia"
        },
        {
          project: "conociendo rusia - te lo voy a decir",
          year: "2024",
          company: "lacasadealado / oruga"
        },
        {
          project: "julieta venegas - mismo amor",
          year: "2022",
          company: "asalto"
        },
        {
          project: "julieta venegas - en tu orilla",
          year: "2023",
          company: "asalto"
        },
        {
          project: "maria becerra - iman",
          year: "2024",
          company: "asalto"
        },
        {
          project: "maria becerra - primer aviso",
          year: "2024",
          company: "asalto"
        },
        {
          project: "maria becerra - corazon vacio",
          year: "2023",
          company: "anestesia audiovisual"
        },
        {
          project: "maria becerra - automatico",
          year: "2023",
          company: ""
        },
        {
          project: "duki - antes de perderte",
          year: "2022",
          company: ""
        },
        {
          project: "duki & de la ghetto & quevedo - si quieren frontear",
          year: "2021",
          company: ""
        }
      ]
    },
    {
      title: "COMMERCIAL",
      items: [
        {
          project: "spotify argentina",
          year: "",
          company: "poster"
        },
        {
          project: "bonafont mexico",
          year: "2024",
          company: "mamahungara"
        },
        {
          project: "spotify argentina x maria becerra",
          year: "2024",
          company: "the movement / landia"
        },
        {
          project: "betwarrior",
          year: "2024",
          company: "mamahungara"
        },
        {
          project: "personal",
          year: "2024",
          company: "poster"
        },
        {
          project: "cerveza quilmes",
          year: "2023",
          company: "the movement / landia"
        },
        {
          project: "mercadolibre argentina x bizarrap",
          year: "2023",
          company: "the movement / landia"
        }
      ]
    },
    {
      title: "LIVE",
      items: [
        {
          project: "maria becerra / lollapalooza",
          year: "2024",
          company: "asalto"
        }
      ]
    },
    {
      title: "SET DESIGN",
      items: [
        {
          project: "ries",
          year: "",
          company: ""
        },
        {
          project: "puma",
          year: "",
          company: ""
        },
        {
          project: "ay not dead",
          year: "",
          company: ""
        },
        {
          project: "luna alvarez castillo",
          year: "",
          company: ""
        },
        {
          project: "jazmin chebar",
          year: "",
          company: ""
        }
      ]
    }
  ]
};

const Archive = () => {
  useScrollReveal();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [filters, setFilters] = useState<{ category: string | null }>({
    category: null
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAccordionHovered, setIsAccordionHovered] = useState(false);

  // Filter sections based on selected filters
  const filteredSections = useMemo(() => {
    return archiveData.sections.filter(section => {
      // If no filters are selected, show all sections
      if (!filters.category) return true;
      
      // Filter by category
      if (filters.category && section.title !== filters.category) return false;
      
      return true;
    });
  }, [filters]);

  const handleMouseMove = (e: React.MouseEvent) => {
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
    window.addEventListener('close-archive', closeArchive);
    return () => window.removeEventListener('close-archive', closeArchive);
  }, []);

  return (
    <section id="archive" className="py-6 md:py-8 px-2.5 md:px-[15px] relative" style={{ zIndex: 1 }} onMouseMove={handleMouseMove}>
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
            className="overflow-hidden pt-6"
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
                categories={archiveData.sections.map(section => section.title)} 
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
                            onMouseEnter={() => setHoveredItem(item.project)}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip de imagen que sigue al cursor (solo en desktop) */}
      {hoveredItem && (
        <div 
          className="fixed hidden md:block pointer-events-none transition-opacity duration-150 opacity-100 z-[100]"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: mousePosition.x + 210 > window.innerWidth ? 'translate(-100%, 10px)' : 'translate(10px, 10px)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <div className="w-[400px] h-[300px] relative shadow-xl rounded overflow-hidden">
            <Image
              src="/images/archive/1.jpg"
              alt={hoveredItem}
              fill
              className="object-cover"
            />
            {/* Opcional: Título del proyecto en el tooltip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
              {hoveredItem}
            </div>
          </div>
        </div>
      )}

      {/* Modal para visualización móvil */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4 md:hidden"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-[90vw] w-full rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image 
                  src="/images/archive/1.jpg"
                  alt={selectedItem.project}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-medium uppercase">{selectedItem.project}</h4>
                <div className="mt-1 flex flex-wrap gap-x-2 text-sm opacity-70">
                  {selectedItem.year && <span>{selectedItem.year}</span>}
                  {selectedItem.company && <span className="uppercase">{selectedItem.company}</span>}
                </div>
              </div>
              
              <div className="px-6 pb-6 flex justify-end">
                <button 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Archive; 