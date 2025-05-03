'use client';

import { useState, useEffect } from 'react';

interface ArchiveFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onReset: () => void;
}

const ArchiveFilters = ({ 
  categories, 
  selectedCategory,
  onCategoryChange,
  onReset
}: ArchiveFiltersProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Pequeña animación de entrada
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manejar cambios de filtro
  const handleCategoryChange = (category: string | null) => {
    const newCategory = category === selectedCategory ? null : category;
    onCategoryChange(newCategory);
  };
  
  return (
    <div 
      className={`grid grid-cols-12 items-center mb-6 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="col-span-9 flex items-center gap-2">
        <div className="text-xs uppercase opacity-60">Filters:</div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(category => (
            <button 
              key={category}
              className={`text-xs px-6 h-7 rounded-lg border border-foreground/10 transition-colors flex items-center justify-center leading-none ${
                selectedCategory === category ? 'bg-black/20 text-black' : 'hover:bg-black/5'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Reset button - only visible if there are active filters */}
      <div className="col-start-10 col-span-3 flex justify-start">
        {selectedCategory && (
          <button 
            className="text-xs px-2 py-0.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ArchiveFilters; 