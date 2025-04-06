'use client';

import { useState, useEffect } from 'react';

interface ArchiveFiltersProps {
  categories: string[];
  years: string[];
  onFilterChange: (filters: { category: string | null, year: string | null }) => void;
  initialCategory?: string | null;
  initialYear?: string | null;
}

const ArchiveFilters = ({ 
  categories, 
  years, 
  onFilterChange,
  initialCategory = null,
  initialYear = null
}: ArchiveFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedYear, setSelectedYear] = useState<string | null>(initialYear);
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
    setSelectedCategory(newCategory);
    onFilterChange({
      category: newCategory,
      year: selectedYear
    });
  };
  
  const handleYearChange = (year: string | null) => {
    const newYear = year === selectedYear ? null : year;
    setSelectedYear(newYear);
    onFilterChange({
      category: selectedCategory,
      year: newYear
    });
  };
  
  // Reiniciar filtros
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedYear(null);
    onFilterChange({ category: null, year: null });
  };
  
  // Actualizar estado local si cambian los valores iniciales
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedYear(initialYear);
  }, [initialCategory, initialYear]);
  
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
          onClick={resetFilters}
        >
          Reiniciar
        </button>
      )}
    </div>
  );
};

export default ArchiveFilters; 