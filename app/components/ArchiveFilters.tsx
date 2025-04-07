'use client';

import { useState, useEffect } from 'react';

interface ArchiveFiltersProps {
  categories: string[];
  years: string[];
  selectedCategory: string | null;
  selectedYear: string | null;
  onCategoryChange: (category: string | null) => void;
  onYearChange: (year: string | null) => void;
  onReset: () => void;
}

const ArchiveFilters = ({ 
  categories, 
  years, 
  selectedCategory,
  selectedYear,
  onCategoryChange,
  onYearChange,
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
  
  const handleYearChange = (year: string | null) => {
    const newYear = year === selectedYear ? null : year;
    onYearChange(newYear);
  };
  
  return (
    <div 
      className={`flex flex-wrap items-center gap-2 mb-6 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-xs uppercase opacity-60 mr-1">Filtros:</div>
      
      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map(category => (
          <button 
            key={category}
            className={`text-xs px-2 py-0.5 rounded-full border border-foreground/10 transition-colors ${
              selectedCategory === category ? 'bg-foreground text-background' : 'hover:bg-foreground/5'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Separador */}
      <div className="h-3 w-px bg-foreground/20 mx-1"></div>
      
      {/* Filtros por año */}
      <div className="flex flex-wrap gap-1.5">
        {years.slice(0, 6).map(year => (
          <button 
            key={year}
            className={`text-xs px-2 py-0.5 rounded-full border border-foreground/10 transition-colors ${
              selectedYear === year ? 'bg-foreground text-background' : 'hover:bg-foreground/5'
            }`}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </button>
        ))}
      </div>
      
      {/* Botón de reset - solo visible si hay filtros activos */}
      {(selectedCategory || selectedYear) && (
        <button 
          className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors ml-auto"
          onClick={onReset}
        >
          Reiniciar
        </button>
      )}
    </div>
  );
};

export default ArchiveFilters; 