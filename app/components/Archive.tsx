'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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

  return (
    <section id="archive" className="py-16 px-[30px]" onMouseMove={handleMouseMove}>
      <div className="mb-10">
        <h2 className="h2 tracking-wide">ARCHIVE</h2>
      </div>
      
      <div className="space-y-12">
        {archiveData.sections.map((section, index) => (
          <div key={index} className="archive-section">
            <h3 className="h4 font-medium mb-6 tracking-wide">{section.title}</h3>
            
            {/* Header for desktop */}
            <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] mb-2 text-xs opacity-60">
              <div>{section.title === "PROJECT" ? "CLIENT" : "PROJECT"}</div>
              <div className="text-right">YEAR</div>
              <div className="text-right">PROD COMPANY</div>
            </div>
            
            <div className="space-y-0">
              {section.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group cursor-pointer hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-0 relative"
                  onMouseEnter={() => setHoveredItem(item.project)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Desktop layout (3 columns) */}
                  <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                    <div className="pr-4 whitespace-nowrap overflow-visible text-p">{item.project}</div>
                    <div className="text-right whitespace-nowrap text-p">{item.year}</div>
                    <div className="text-right whitespace-nowrap overflow-visible text-p">{item.company}</div>
                  </div>
                  
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-0">
                    <div className="font-medium whitespace-nowrap overflow-visible text-p">{item.project}</div>
                    <div className="flex justify-between text-p opacity-80">
                      <div className="whitespace-nowrap">{item.year}</div>
                      <div className="whitespace-nowrap overflow-visible">{item.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip de imagen que sigue al cursor */}
      {hoveredItem && (
        <div 
          className="fixed pointer-events-none z-50 transition-opacity duration-150 opacity-100"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: mousePosition.x + 210 > window.innerWidth ? 'translate(-100%, 10px)' : 'translate(10px, 10px)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          <div className="w-52 h-36 relative shadow-xl rounded overflow-hidden">
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
    </section>
  );
};

export default Archive; 