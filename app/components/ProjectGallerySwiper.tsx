'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import { Project } from '@/lib/contentful'
import { useHydration } from '../hooks/useHydration'
import AnimatedProjectInfo from './AnimatedProjectInfo'
import Copyright from './Copyright'

import 'swiper/css'
import 'swiper/css/navigation'

// ═══════════════════════════════════════════════════════════════
// 🎯 CONFIGURACIÓN: Slider para proyectos individuales con navegación
// ═══════════════════════════════════════════════════════════════

const GAP_SIZE = 80 // Espacio entre slides en px

// Función para calcular altura responsive
const getResponsiveSlideHeight = () => {
  if (typeof window === 'undefined') return 700
  
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  
  // En mobile, usar menos altura para dar más espacio
  if (viewportWidth < 768) {
    return Math.min(viewportHeight * 0.5, 400) // Máximo 50vh o 400px
  }
  
  // En tablet, altura intermedia
  if (viewportWidth < 1024) {
    return Math.min(viewportHeight * 0.6, 500) // Máximo 60vh o 500px
  }
  
  // En desktop, altura completa
  return Math.min(viewportHeight * 0.7, 600) // Máximo 70vh o 600px
}

// ═══════════════════════════════════════════════════════════════
// 📦 ProjectImageSlide - Imagen con dimensiones calculadas
// ═══════════════════════════════════════════════════════════════

interface ProjectImageSlideProps {
  imageUrl: string
  title: string
  slideHeight: number
}

const ProjectImageSlide = ({ imageUrl, title, slideHeight }: ProjectImageSlideProps) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Calcular ancho basado en aspect ratio original y altura fija, con límite máximo
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const aspectRatio = img.naturalWidth / img.naturalHeight
    let calculatedWidth = slideHeight * aspectRatio
    
    // Limitar el ancho máximo según el viewport
    const maxWidth = typeof window !== 'undefined' 
      ? Math.min(window.innerWidth * 0.9, 1200) // Máximo 90% del viewport o 1200px
      : 1200
    
    if (calculatedWidth > maxWidth) {
      calculatedWidth = maxWidth
    }
    
    setImageDimensions({ width: calculatedWidth, height: slideHeight })
  }

  // Contenedor con altura FIJA en píxeles y ancho responsive
  const containerStyle: React.CSSProperties = {
    height: `${slideHeight}px`,
    width: imageDimensions ? `${imageDimensions.width}px` : 'auto',
    minWidth: imageDimensions ? `${imageDimensions.width}px` : '300px',
    maxWidth: typeof window !== 'undefined' ? `${Math.min(window.innerWidth * 0.9, 1200)}px` : '1200px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  if (!imageUrl) {
    return (
      <div style={{ ...containerStyle, background: '#1a1a1a', border: '1px dashed #333' }}>
        <p className="text-gray-500 text-sm">Imagen no disponible</p>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <Image
        src={imageUrl}
        alt={title}
        width={imageDimensions?.width || 800}
        height={slideHeight}
        onLoad={handleImageLoad}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
        }}
        sizes="(max-width: 480px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, (max-width: 1200px) 60vw, 1200px"
        priority={false}
        quality={95}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 ProjectGallerySwiper - Swiper con navegación para proyectos individuales
// ═══════════════════════════════════════════════════════════════

interface ProjectGallerySwiperProps {
  project: Project
}

const ProjectGallerySwiper = ({ project }: ProjectGallerySwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [slideHeightPx, setSlideHeightPx] = useState(700)
  const isHydrated = useHydration()
  
  // Hook para manejar redimensionamiento
  useEffect(() => {
    const updateSlideHeight = () => {
      setSlideHeightPx(getResponsiveSlideHeight())
    }
    
    // Actualizar altura inicial
    updateSlideHeight()
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', updateSlideHeight)
    
    return () => {
      window.removeEventListener('resize', updateSlideHeight)
    }
  }, [])

  // Preparar imágenes del proyecto
  const images = project.images && project.images.length > 0 
    ? project.images 
    : project.thumbnail 
      ? [project.thumbnail] 
      : []

  if (images.length === 0) {
    return (
      <section className="relative px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 36px)', paddingTop: 0, marginTop: 0 }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg opacity-70">{project.artist}</p>
          {project.company && (
            <p className="text-sm opacity-50 mt-2">{project.company}</p>
          )}
          <p className="text-sm opacity-50 mt-4">Proyecto sin imágenes disponibles</p>
        </div>
        <Copyright />
      </section>
    )
  }

  if (!isHydrated) {
    return (
      <section className="relative px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 36px)', paddingTop: 0, marginTop: 0 }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando galería...</h1>
          <p className="text-sm opacity-70">Preparando imágenes</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🎭 ESTILOS: Transición de escala suave y consistente */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* Wrapper alineado al centro */
        .project-swiper .swiper-wrapper {
          align-items: center !important;
        }
        
        /* Cada slide mantiene su altura natural */
        .project-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          
          /* ⭐ TRANSICIÓN SUAVE */
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
          
          /* Estado por defecto: mucho más pequeñas */
          transform: scale(0.4) !important;
          opacity: 0.3 !important;
        }
        
        /* ⭐ SLIDE ACTIVA (centro): tamaño natural */
        .project-swiper .swiper-slide-active {
          transform: scale(1) !important;
          opacity: 1 !important;
          z-index: 10 !important;
        }
        
        /* Slides adyacentes: scale intermedio más pequeño */
        .project-swiper .swiper-slide-next,
        .project-swiper .swiper-slide-prev {
          transform: scale(0.6) !important;
          opacity: 0.5 !important;
          z-index: 5 !important;
        }
        
        /* Prevenir overflow horizontal */
        .project-swiper {
          overflow: hidden !important;
        }

        /* Estilos para las flechas de navegación */
        .project-swiper .swiper-button-next,
        .project-swiper .swiper-button-prev {
          color: rgb(var(--foreground)) !important;
          opacity: 0.7 !important;
          transition: opacity 0.3s ease !important;
        }

        .project-swiper .swiper-button-next:hover,
        .project-swiper .swiper-button-prev:hover {
          opacity: 1 !important;
        }

        .project-swiper .swiper-button-next::after,
        .project-swiper .swiper-button-prev::after {
          font-size: 20px !important;
          font-weight: bold !important;
        }
      `}</style>
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🎡 SWIPER: con navegación y flechas */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section 
        className="relative px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center"
        style={{ 
          height: 'calc(100vh - 36px)',
          paddingTop: 0,
          marginTop: 0
        }}
      >
        {/* Project Info - Mismo layout que videos */}
        <AnimatedProjectInfo project={project} displayIndex={0} topPosition="top-4" showProductionCompany={false} />
        
        {/* Navigation arrows - Mismo diseño que el original */}
        {images.length > 1 && (
          <div className="absolute top-4 right-8 z-50 flex items-center space-x-4">
            {/* Navigation arrows */}
            <div className="flex items-center -space-x-2">
              <button 
                className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
                aria-label="Previous image"
                onClick={() => {
                  if (swiperInstance) {
                    swiperInstance.slidePrev()
                  }
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 5v14l-11-7z"/>
                </svg>
              </button>
              
              <button 
                className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer p-1"
                aria-label="Next image"
                onClick={() => {
                  if (swiperInstance) {
                    swiperInstance.slideNext()
                  }
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="w-full h-full flex items-center justify-center">
          <Swiper
            modules={[Navigation, Mousewheel]}
            spaceBetween={GAP_SIZE}
            slidesPerView="auto"
            centeredSlides={true}
            loop={images.length > 1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            mousewheel={{ 
              forceToAxis: true, 
              sensitivity: 1.5, 
              releaseOnEdges: true,
              thresholdDelta: 30
            }}
            grabCursor
            className="w-full project-swiper"
            watchSlidesProgress={true}
            speed={600}
            onSwiper={(swiper) => {
              setSwiperInstance(swiper)
            }}
            onSlideChange={(swiper) => {
              setCurrentIndex(swiper.realIndex)
            }}
            breakpoints={{
              320: { 
                spaceBetween: 40,
              },
              768: { 
                spaceBetween: 60,
              },
              1024: { 
                spaceBetween: GAP_SIZE,
              }
            }}
          >
            {images.map((imageUrl, index) => (
              <SwiperSlide 
                key={`${project.id}-image-${index}`}
                style={{ width: 'auto' }}
              >
                <ProjectImageSlide 
                  imageUrl={imageUrl} 
                  title={project.title} 
                  slideHeight={slideHeightPx} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-foreground scale-125' 
                      : 'bg-foreground/30 hover:bg-foreground/50'
                  }`}
                  onClick={() => {
                    if (swiperInstance) {
                      swiperInstance.slideTo(index)
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="absolute bottom-1 right-0 px-4 md:px-[30px] z-10">
          <Copyright absolute={true} />
        </div>
      </section>
    </>
  )
}

export default ProjectGallerySwiper

/**
 * PROJECT GALLERY SWIPER - Slider para proyectos individuales con navegación
 * 
 * CARACTERÍSTICAS:
 * - Basado en FeaturedProjectSwiper pero adaptado para proyectos individuales
 * - Flechas de navegación integradas con Swiper Navigation
 * - Transiciones suaves de escala (0.4 → 1.0)
 * - Altura normalizada (70vh)
 * - Loop infinito para múltiples imágenes
 * - Dots indicator para navegación directa
 * - Mousewheel support
 * - Responsive breakpoints
 * 
 * NAVEGACIÓN:
 * - Flechas laterales (Swiper Navigation)
 * - Mousewheel horizontal
 * - Dots para navegación directa
 * - Touch/drag support
 * 
 * PERFORMANCE:
 * - Lazy loading de imágenes
 * - Cálculo de dimensiones optimizado
 * - Transiciones CSS hardware-accelerated
 * - Hydration-safe rendering
 */
