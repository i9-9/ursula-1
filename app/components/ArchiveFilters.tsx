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
      className={`mb-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-2 w-full">
        <div className="flex items-center gap-2 order-2 md:order-1">
          <div className="text-xs uppercase opacity-60">Filters:</div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
              <button
                key={category}
                className={`text-xs px-3 h-7 rounded-lg border border-foreground/10 transition-colors flex items-center justify-center leading-none ${
                  selectedCategory === category ? 'bg-black/20 text-black' : 'hover:bg-black/5'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {selectedCategory && (
          <div className="order-1 md:order-2 flex md:ml-4">
            <button
              className="text-xs px-2 py-0.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveFilters; 