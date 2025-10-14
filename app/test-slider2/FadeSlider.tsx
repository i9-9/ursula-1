'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { HeroSlide } from '@/lib/contentful'

// ═══════════════════════════════════════════════════════════════
// 🎯 CONFIGURACIÓN: Slideshow - Ritmo sincronizado con /work y /archive
// ═══════════════════════════════════════════════════════════════

const SLIDE_HEIGHT_VH = 50 // Altura más pequeña
const AUTOPLAY_DELAY = 1000 // Slider más rápido - 2 segundos

// ═══════════════════════════════════════════════════════════════
// 📦 FadeSlider - Imagen central con transición de opacidad
// ═══════════════════════════════════════════════════════════════

interface FadeSliderProps {
  slides: HeroSlide[]
}

export default function FadeSlider({ slides }: FadeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map())

  // Calcular altura responsive basada en viewport
  const slideHeightPx = typeof window !== 'undefined' 
    ? window.innerWidth < 768 
      ? (window.innerHeight * 60) / 100 // 60vh en mobile (más grande)
      : (window.innerHeight * SLIDE_HEIGHT_VH) / 100 // 70vh en desktop
    : 700

  // Pre-cargar imágenes para evitar flicker
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides
        .filter(slide => slide.src)
        .map(slide => {
          return new Promise<string>((resolve, reject) => {
            const img = new window.Image()
            img.onload = () => {
              imageRefs.current.set(slide.src!, img)
              resolve(slide.src!)
            }
            img.onerror = () => reject(slide.src!)
            img.src = slide.src!
          })
        })

      try {
        const loadedSrcs = await Promise.all(imagePromises)
        setLoadedImages(new Set(loadedSrcs))
      } catch (error) {
        console.warn('Error preloading images:', error)
      }
    }

    preloadImages()
  }, [slides])

  // Initial delay - mismo patrón que WorksGrid (100ms)
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setHasStarted(true)
    }, 100)
    
    return () => clearTimeout(initialTimer)
  }, [])

  // Auto-play: cambiar slide automáticamente con ritmo variable (fixed)
  useEffect(() => {
    if (!hasStarted) return

    let timer: NodeJS.Timeout

    const scheduleNext = () => {
      timer = setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % slides.length
          return nextIndex
        })
        
        // Programar el siguiente cambio
        scheduleNext()
      }, AUTOPLAY_DELAY)
    }

    scheduleNext()

    return () => clearTimeout(timer)
  }, [slides.length, hasStarted])

  const currentSlide = slides[currentIndex]

  if (!currentSlide) return null

  return (
    <section 
      className="absolute inset-0 flex items-center justify-center bg-background"
      style={{ height: 'calc(100vh - 36px)' }}
    >
      {/* Contenedor central más pequeño */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          height: `${slideHeightPx}px`,
          width: '100%',
          maxWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? '90vw' : '60vw',
          margin: '0 auto',
        }}
      >
        {/* Renderizar todas las slides con transición de opacidad */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          const isVisible = isActive || loadedImages.has(slide.src || '')
          
          if (!isVisible) return null

          return (
            <div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
              }}
            >
              {slide.videoUrl ? (
                <video
                  src={slide.videoUrl}
                  autoPlay={isActive}
                  loop
                  muted
                  playsInline
                  style={{
                    height: '100%',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : slide.src ? (
                <div 
                  className="relative flex items-center justify-center"
                  style={{
                    height: '100%',
                    width: '100%',
                    maxHeight: '100%',
                    maxWidth: '100%',
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt || slide.title}
                    fill
                    style={{
                      objectFit: 'contain',
                    }}
                    sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 40vw"
                    priority={isActive}
                    quality={95}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-900 border border-dashed border-gray-700">
                  <p className="text-gray-500">Media no disponible</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/**
 * RHYTHMIC SLIDESHOW - Diseño alternativo con ritmo variable
 * 
 * CARACTERÍSTICAS:
 * - Imagen central que NUNCA se mueve
 * - Transición suave de opacidad (300ms)
 * - Pre-carga de imágenes para evitar flicker
 * - Ritmo variable: 5 slides normales (2s) + 9 slides acelerados (50ms)
 * - Altura normalizada (50vh)
 * - Sin UI decorativa
 * - Ciclos de aceleración automáticos
 * 
 * RITMO:
 * - Normal: 1.5 segundos por slide (5 slides = 7.5 segundos)
 * - Acelerado: 50ms por slide (9 slides = 450ms)
 * - Ciclo completo: ~8 segundos
 * 
 * MEJORAS ANTI-FLICKER:
 * - Pre-carga de todas las imágenes al inicio
 * - Renderizado de slides con transición de opacidad
 * - Control de estado de transición para evitar cambios durante fade
 * - Prioridad de carga para la imagen activa
 * - Calidad de imagen optimizada (95%)
 */

