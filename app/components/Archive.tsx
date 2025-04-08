'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ArchiveFilters from './ArchiveFilters';

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
      title: "VIDEOCLIP",
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
      title: "PROJECT",
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [filters, setFilters] = useState<{ category: string | null, year: string | null }>({
    category: null,
    year: null
  });

  // Get unique years from all items
  const years = useMemo(() => {
    const yearSet = new Set<string>();
    archiveData.sections.forEach(section => {
      section.items.forEach(item => {
        if (item.year && item.year.trim() !== '') {
          yearSet.add(item.year);
        }
      });
    });
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

  // Filter sections based on selected filters
  const filteredSections = useMemo(() => {
    return archiveData.sections.filter(section => {
      // If no filters are selected, show all sections
      if (!filters.category && !filters.year) return true;
      
      // Filter by category
      if (filters.category && section.title !== filters.category) return false;
      
      // Filter by year
      if (filters.year) {
        return section.items.some(item => item.year === filters.year);
      }
      
      return true;
    }).map(section => {
      // If year filter is active, filter the items within the section
      if (filters.year) {
        return {
          ...section,
          items: section.items.filter(item => item.year === filters.year)
        };
      }
      return section;
    });
  }, [filters]);

  // Handler para registrar la posición del mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    // Ajustamos la posición para evitar que el tooltip salga de la ventana
    const tooltipWidth = 210; // Ancho del tooltip incluyendo el margen
    const tooltipHeight = 150; // Alto del tooltip incluyendo el margen
    
    // Comprobamos si estamos cerca del borde derecho o inferior
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
      category: null,
      year: null
    });
  }, []);

  return (
    <section id="archive" className="py-6 md:py-8 px-2.5 md:px-[15px] relative" style={{ zIndex: 1 }} onMouseMove={handleMouseMove}>
      <div className="mb-4">
        <h2 className="h2 text-hover section-title section-title-delay-2">ARCHIVE</h2>
      </div>
      
      {/* Componente de filtros */}
      <ArchiveFilters 
        categories={archiveData.sections.map(section => section.title)} 
        years={years} 
        selectedCategory={filters.category}
        selectedYear={filters.year}
        onCategoryChange={(category) => setFilters(prev => ({ ...prev, category }))}
        onYearChange={(year) => setFilters(prev => ({ ...prev, year }))}
        onReset={resetFilters}
      />
      
      <div className="space-y-6 md:space-y-4">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <div key={index} className="archive-section">
              <h3 className={`h4 font-medium mb-4 md:mb-6 text-hover section-title section-title-delay-${index + 1}`}>{section.title}</h3>
              
              {/* Header for desktop */}
              <div className="hidden md:grid md:grid-cols-12 mb-2 text-xs opacity-60">
                <div className="col-span-6">{section.title === "PROJECT" ? "CLIENT" : "PROJECT"}</div>
                <div className="col-start-7 col-span-3">YEAR</div>
                <div className="col-start-10 col-span-3">PROD COMPANY</div>
              </div>
              
              {/* Header for mobile */}
              <div className="md:hidden mb-3 text-xs opacity-60">
                <div>{section.title === "PROJECT" ? "CLIENT" : "PROJECT"}</div>
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
                      <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">{item.project}</div>
                      <div className="col-start-7 col-span-3 text-left whitespace-nowrap text-p">{item.year}</div>
                      <div className="col-start-10 col-span-3 text-left whitespace-nowrap overflow-visible text-p">{item.company}</div>
                    </div>
                    
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <div className="flex flex-col">
                        <div className="font-medium text-p mb-1">{item.project}</div>
                        {(item.year || item.company) && (
                          <div className="text-sm opacity-70 flex items-center flex-wrap">
                            {item.year && <span className="mr-2">{item.year}</span>}
                            {item.company && <span>{item.company}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>

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
              className="bg-white max-w-sm w-full rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video">
                <Image 
                  src="/images/archive/1.jpg"
                  alt={selectedItem.project}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h4 className="text-lg font-medium">{selectedItem.project}</h4>
                <div className="mt-1 flex flex-wrap gap-x-2 text-sm opacity-70">
                  {selectedItem.year && <span>{selectedItem.year}</span>}
                  {selectedItem.company && <span>{selectedItem.company}</span>}
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-end">
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