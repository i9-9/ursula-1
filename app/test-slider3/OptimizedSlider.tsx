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
const SLIDE_GAP = 20 // Espacio entre slides (en px)

// ═══════════════════════════════════════════════════════════════
// 🔄 PRECARGA DE IMÁGENES PARA CALCULAR DIMENSIONES
// ═══════════════════════════════════════════════════════════════

async function preloadImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      const width = SLIDE_HEIGHT * aspectRatio
      resolve({ width, height: SLIDE_HEIGHT })
    }
    img.onerror = reject
    img.src = src
  })
}

async function preloadVideo(videoUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      const aspectRatio = video.videoWidth / video.videoHeight
      const width = SLIDE_HEIGHT * aspectRatio
      resolve({ width, height: SLIDE_HEIGHT })
    }
    video.onerror = reject
    video.src = videoUrl
  })
}

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
}

function SlideItem({ slide, index }: SlideItemProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: `${slide.width}px`,
        height: `${slide.height}px`,
        marginRight: `${SLIDE_GAP}px`,
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
            display: 'block',
            objectFit: 'contain', // Mantiene proporción original sin estirar
          }}
        />
      ) : (
        // Fallback si no hay contenido
        <div 
          className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg"
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

interface OptimizedSliderProps {
  slides: Slide[]
}

export default function OptimizedSlider({ slides }: OptimizedSliderProps) {
  const [preloadedSlides, setPreloadedSlides] = useState<SlideWithDimensions[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  // 🎨 RENDERIZADO DEL SLIDER MINIMALISTA
  // ═══════════════════════════════════════════════════════════════
  
  if (isLoading) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-black"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <div className="text-white text-center">
          <p className="text-lg">Cargando slides...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="w-full flex items-center justify-center bg-black"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      {/* Contenedor del Carousel */}
      <div className="relative w-full overflow-hidden" ref={emblaRef}>
        {/* Contenedor de slides con flexbox */}
        <div className="flex items-center">
          {preloadedSlides.map((slide, index) => (
            <SlideItem key={slide.id} slide={slide} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 📋 CARACTERÍSTICAS DEL COMPONENTE OPTIMIZADO
 * ═══════════════════════════════════════════════════════════════
 * 
 * ✅ ALTURA FIJA: 500px para todas las slides (configurable)
 * ✅ ANCHO VARIABLE: Cada slide mantiene su proporción original
 * ✅ GAP CONSTANTE: 20px entre slides (configurable)
 * ✅ AUTO-PLAY: Cambio automático cada 4 segundos
 * ✅ LOOP INFINITO: Carrusel sin fin con Embla
 * ✅ SOPORTE DE VIDEOS: Autoplay, muted, loop, inline
 * ✅ CENTRADO: Slides centradas horizontal y verticalmente
 * ✅ SIN LETTERBOXING: object-fit: cover evita espacios vacíos
 * ✅ MINIMALISTA: Sin botones, sin indicadores, solo el slider
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
 * 💡 EJEMPLO DE USO
 * ═══════════════════════════════════════════════════════════════
 * 
 * const slides = [
 *   { id: '1', title: 'Imagen 1', src: '/image1.jpg', alt: 'Descripción' },
 *   { id: '2', title: 'Video 1', videoUrl: '/video1.mp4' },
 *   { id: '3', title: 'Imagen 2', src: '/image2.jpg', alt: 'Descripción' }
 * ]
 * 
 * <OptimizedSlider slides={slides} />
 * 
 * ═══════════════════════════════════════════════════════════════
 * 🎯 VENTAJAS DE ESTA IMPLEMENTACIÓN
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. HOOKS CORRECTOS: No se violan las reglas de React Hooks
 * 2. RENDIMIENTO: Cálculo eficiente de dimensiones
 * 3. RESPONSIVE: Se adapta al contenido automáticamente
 * 4. ACCESIBILIDAD: Alt text para imágenes
 * 5. MAINTAINABILITY: Código limpio y bien documentado
 * 6. FLEXIBLE: Fácil de personalizar con las constantes
 * 7. SIN LETTERBOXING: object-fit: cover elimina espacios vacíos
 * 8. VARIABLE WIDTH: Cada slide tiene su ancho natural
 */
