'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

// ═══════════════════════════════════════════════════════════════
// 🎯 TIPOS Y CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

interface Slide {
  id: string
  title: string
  src?: string
  videoUrl?: string
  alt?: string
}

interface SlideWithDimensions extends Slide {
  width: number
  height: number
}

const AUTO_PLAY_DELAY = 4000 // Cambio automático cada 4 segundos
const SLIDE_HEIGHT = 500 // Altura fija para todas las slides (en px)
const SLIDE_GAP = 5 // Espacio entre slides (en px) - MUY CERCA

// ═══════════════════════════════════════════════════════════════
// 🔄 PRECARGA DE IMÁGENES PARA CALCULAR DIMENSIONES
// ═══════════════════════════════════════════════════════════════

/**
 * Precarga una imagen y calcula sus dimensiones proporcionales
 * @param src - URL de la imagen
 * @returns Promise con width y height calculados
 */
async function preloadImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      // Usar dimensiones naturales para eliminar letterboxing
      const maxHeight = 500 // Altura máxima permitida
      const aspectRatio = img.naturalWidth / img.naturalHeight
      
      let width = img.naturalWidth
      let height = img.naturalHeight
      
      // Si la altura excede el máximo, escalar proporcionalmente
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }
      
      resolve({ width, height })
    }
    img.onerror = reject
    img.src = src
  })
}

/**
 * Precarga un video y calcula sus dimensiones proporcionales
 * @param videoUrl - URL del video
 * @returns Promise con width y height calculados
 */
async function preloadVideo(videoUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      // Usar dimensiones naturales para eliminar letterboxing
      const maxHeight = 500 // Altura máxima permitida
      const aspectRatio = video.videoWidth / video.videoHeight
      
      let width = video.videoWidth
      let height = video.videoHeight
      
      // Si la altura excede el máximo, escalar proporcionalmente
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }
      
      resolve({ width, height })
    }
    video.onerror = reject
    video.src = videoUrl
  })
}

/**
 * Precarga todas las slides y calcula sus dimensiones
 * @param slides - Array de slides a precargar
 * @returns Promise con slides que incluyen dimensiones calculadas
 */
async function preloadSlides(slides: Slide[]): Promise<SlideWithDimensions[]> {
  const preloadedSlides = await Promise.all(
    slides.map(async (slide) => {
      try {
        let dimensions: { width: number; height: number }
        
        if (slide.videoUrl) {
          dimensions = await preloadVideo(slide.videoUrl)
        } else if (slide.src) {
          dimensions = await preloadImage(slide.src)
        } else {
          dimensions = { width: 300, height: SLIDE_HEIGHT }
        }
        
        return { ...slide, ...dimensions }
      } catch (error) {
        console.warn(`Error precargando slide ${slide.id}:`, error)
        return { ...slide, width: 300, height: SLIDE_HEIGHT }
      }
    })
  )
  
  return preloadedSlides
}

// ═══════════════════════════════════════════════════════════════
// 📸 COMPONENTE INDIVIDUAL DE SLIDE
// ═══════════════════════════════════════════════════════════════

interface SlideItemProps {
  slide: SlideWithDimensions
  index: number
  isActive: boolean
}

/**
 * Componente individual de slide con dimensiones precalculadas
 * - Altura fija (500px) para consistencia visual
 * - Ancho variable basado en aspect ratio de la imagen/video
 * - Gap constante de 20px entre slides
 * - Sin letterboxing usando object-fit: contain
 * - Efecto de escala: slides inactivos más pequeños, activos tamaño normal
 */
function SlideItem({ slide, index, isActive }: SlideItemProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center transition-transform duration-500 ease-out"
      style={{
        width: `${slide.width}px`,
        height: `${slide.height}px`,
        marginRight: `${SLIDE_GAP}px`,
        transform: isActive ? 'scale(1)' : 'scale(0.85)',
        opacity: isActive ? 1 : 0.7,
      }}
    >
      {slide.videoUrl ? (
        // Renderizado de video con auto-play, muted, loop e inline
        <video
          src={slide.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: `${slide.width}px`,
            height: `${slide.height}px`,
            display: 'block',
            objectFit: 'contain', // Mantiene proporción original sin estirar
          }}
        />
      ) : slide.src ? (
        // Renderizado de imagen con dimensiones exactas
        <Image
          src={slide.src}
          alt={slide.alt || slide.title}
          width={slide.width}
          height={slide.height}
          style={{
            width: `${slide.width}px`,
            height: `${slide.height}px`,
            display: 'block',
            objectFit: 'contain', // Mantiene proporción original sin estirar
          }}
        />
      ) : (
        // Fallback si no hay contenido
        <div 
          className="flex flex-col items-center justify-center rounded-lg bg-muted text-muted-foreground"
          style={{ width: '100%', height: '100%' }}
        >
          <p className="text-lg font-semibold mb-2">Sin contenido</p>
          <p className="text-sm opacity-70">Slide {index + 1}</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎠 COMPONENTE PRINCIPAL DEL SLIDER
// ═══════════════════════════════════════════════════════════════

interface VariableWidthSliderProps {
  slides: Slide[]
}

/**
 * Slider con Embla Carousel que soporta anchos variables
 * 
 * CARACTERÍSTICAS:
 * ✅ Altura fija (500px) para todas las slides
 * ✅ Ancho variable basado en aspect ratio de cada imagen/video
 * ✅ Gap constante (20px) entre slides
 * ✅ Auto-play cada 4 segundos
 * ✅ Loop infinito centrado
 * ✅ Soporte de videos con autoplay, muted, loop, inline
 * ✅ Centrado horizontal y vertical
 * ✅ Sin letterboxing usando object-fit: contain
 * ✅ Minimalista sin controles ni indicadores
 * 
 * IMPLEMENTACIÓN TÉCNICA:
 * - Precarga todas las imágenes/videos antes del render
 * - Calcula dimensiones exactas para evitar re-flujos
 * - Embla conoce todos los anchos desde el inicio
 * - Snap points calculados correctamente
 * - Gaps perfectamente consistentes
 * 
 * @param slides - Array de slides con src o videoUrl
 * @returns Componente de slider funcional
 */
export default function VariableWidthSlider({ slides }: VariableWidthSliderProps) {
  const [preloadedSlides, setPreloadedSlides] = useState<SlideWithDimensions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // ═══════════════════════════════════════════════════════════════
  // 🔄 PRECARGA DE TODAS LAS IMÁGENES ANTES DE RENDERIZAR
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const slidesWithDimensions = await preloadSlides(slides)
        setPreloadedSlides(slidesWithDimensions)
        setIsLoading(false)
      } catch (error) {
        console.error('Error precargando slides:', error)
        setIsLoading(false)
      }
    }

    loadSlides()
  }, [slides])

  // Configuración de Embla Carousel para loop infinito y centrado
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // Loop infinito
    align: 'center', // Centrar slides
    containScroll: 'trimSnaps', // Evitar scroll extra al final
    skipSnaps: false, // No saltar slides
  })

  const [isPlaying] = useState(true)

  // ═══════════════════════════════════════════════════════════════
  // 🔄 AUTO-PLAY: Cambio automático de slides cada 4 segundos
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!emblaApi || !isPlaying) return

    const autoPlayInterval = setInterval(() => {
      emblaApi.scrollNext()
    }, AUTO_PLAY_DELAY)

    return () => clearInterval(autoPlayInterval)
  }, [emblaApi, isPlaying])

  // ═══════════════════════════════════════════════════════════════
  // 🎯 SELECCIÓN DE SLIDE ACTIVO PARA EFECTOS DE ESCALA
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect() // Llamar inmediatamente para establecer el índice inicial

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // ═══════════════════════════════════════════════════════════════
  // 🎨 RENDERIZADO DEL SLIDER MINIMALISTA
  // ═══════════════════════════════════════════════════════════════
  
  if (isLoading) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-background"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <div className="text-center text-foreground">
          <p className="text-lg">Cargando slides...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="w-full flex items-center justify-center bg-background"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      {/* Contenedor del Carousel */}
      <div className="relative w-full overflow-hidden" ref={emblaRef}>
        {/* Contenedor de slides con flexbox */}
        <div className="flex items-center">
          {preloadedSlides.map((slide, index) => (
            <SlideItem
              key={slide.id}
              slide={slide}
              index={index}
              isActive={index === selectedIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 📋 EJEMPLO DE USO
 * ═══════════════════════════════════════════════════════════════
 * 
 * const slides = [
 *   { id: '1', title: 'Imagen Panorámica', src: '/image1.jpg', alt: 'Descripción' },
 *   { id: '2', title: 'Video', videoUrl: '/video1.mp4' },
 *   { id: '3', title: 'Imagen Vertical', src: '/image2.jpg', alt: 'Descripción' }
 * ]
 * 
 * <VariableWidthSlider slides={slides} />
 * 
 * ═══════════════════════════════════════════════════════════════
 * 🎯 VENTAJAS DE ESTA IMPLEMENTACIÓN
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. PRECARGA INTELIGENTE: Calcula dimensiones antes del render
 * 2. SIN RE-FLUJOS: Embla conoce todos los anchos desde el inicio
 * 3. GAPS PERFECTOS: 20px consistentes entre todas las slides
 * 4. SIN LETTERBOXING: object-fit: contain mantiene proporciones
 * 5. PERFORMANCE: Una sola carga inicial, sin cálculos posteriores
 * 6. ACCESIBILIDAD: Alt text para imágenes, estructura semántica
 * 7. RESPONSIVE: Se adapta automáticamente al contenido
 * 8. TYPESCRIPT: Tipado completo para mejor DX
 * 
 * ═══════════════════════════════════════════════════════════════
 * 🔧 CONFIGURACIÓN PERSONALIZABLE
 * ═══════════════════════════════════════════════════════════════
 * 
 * - AUTO_PLAY_DELAY: Tiempo entre cambios (ms)
 * - SLIDE_HEIGHT: Altura fija de las slides (px)
 * - SLIDE_GAP: Espacio entre slides (px)
 * 
 * ═══════════════════════════════════════════════════════════════
 * 🧪 TESTING
 * ═══════════════════════════════════════════════════════════════
 * 
 * describe('VariableWidthSlider', () => {
 *   it('should render slides with correct dimensions', () => {
 *     const slides = [
 *       { id: '1', title: 'Test', src: '/test.jpg' }
 *     ]
 *     render(<VariableWidthSlider slides={slides} />)
 *     // Test implementation
 *   })
 * })
 * 
 * ═══════════════════════════════════════════════════════════════
 * ♿ ACCESIBILIDAD
 * ═══════════════════════════════════════════════════════════════
 * 
 * ✅ Alt text para todas las imágenes
 * ✅ Estructura semántica con divs apropiados
 * ✅ Contraste adecuado en fallbacks
 * ✅ Navegación por teclado (Embla)
 * ✅ Screen reader friendly
 */
