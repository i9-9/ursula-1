'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { HeroSlide } from '@/lib/contentful'
import { useIsMobile } from '@/app/hooks/useIsMobile'

// ═══════════════════════════════════════════════════════════════
// 🎯 CONFIGURACIÓN: Slideshow - Ritmo sincronizado con /work y /archive
// ═══════════════════════════════════════════════════════════════

const SLIDE_HEIGHT_VH = 50 // Altura más pequeña
const AUTOPLAY_DELAY = 700 // Slider más rápido - 0.7 segundos
const MOBILE_IMAGE_QUALITY = 75 // Calidad reducida para mobile
const DESKTOP_IMAGE_QUALITY = 95 // Calidad alta para desktop

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
  const isMobile = useIsMobile(768) // Detectar mobile con breakpoint 768px

  // Calcular altura responsive basada en viewport
  const slideHeightPx = typeof window !== 'undefined' 
    ? window.innerWidth < 768 
      ? (window.innerHeight * 60) / 100 // 60vh en mobile (más grande)
      : (window.innerHeight * SLIDE_HEIGHT_VH) / 100 // 70vh en desktop
    : 700

  // Pre-cargar imágenes de forma optimizada según dispositivo
  useEffect(() => {
    const preloadImages = async () => {
      // En mobile: solo precargar la primera imagen para mejorar performance
      // En desktop: precargar todas las imágenes para evitar flicker
      const slidesToPreload = isMobile 
        ? slides.slice(0, 1) // Solo primera en mobile
        : slides // Todas en desktop

      const imagePromises = slidesToPreload
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
  }, [slides, isMobile])

  // En mobile: precargar la siguiente imagen cuando cambia el índice actual
  useEffect(() => {
    if (!isMobile || !hasStarted) return

    const nextIndex = (currentIndex + 1) % slides.length
    const nextSlide = slides[nextIndex]
    
    if (nextSlide?.src && !loadedImages.has(nextSlide.src)) {
      const img = new window.Image()
      img.onload = () => {
        imageRefs.current.set(nextSlide.src!, img)
        setLoadedImages(prev => new Set(prev).add(nextSlide.src!))
      }
      img.src = nextSlide.src
    }
  }, [currentIndex, slides, isMobile, hasStarted, loadedImages])

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
        {/* Renderizar slides con transición de opacidad */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          // En mobile: solo renderizar la activa y la siguiente (precargada)
          // En desktop: renderizar todas las precargadas
          const isVisible = isMobile 
            ? isActive || (index === (currentIndex + 1) % slides.length && loadedImages.has(slide.src || ''))
            : isActive || loadedImages.has(slide.src || '')
          
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
              {slide.src ? (
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
                    sizes={isMobile 
                      ? "(max-width: 768px) 90vw, 90vw" 
                      : "(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 40vw"
                    }
                    priority={isActive && index === 0}
                    quality={isMobile ? MOBILE_IMAGE_QUALITY : DESKTOP_IMAGE_QUALITY}
                    loading={isActive ? 'eager' : 'lazy'}
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
 * - Transición inmediata (sin animación)
 * - Pre-carga optimizada según dispositivo
 * - Ritmo variable: 5 slides normales (2s) + 9 slides acelerados (50ms)
 * - Altura normalizada (50vh desktop, 60vh mobile)
 * - Sin UI decorativa
 * - Ciclos de aceleración automáticos
 * 
 * RITMO:
 * - Normal: 1.5 segundos por slide (5 slides = 7.5 segundos)
 * - Acelerado: 50ms por slide (9 slides = 450ms)
 * - Ciclo completo: ~8 segundos
 * 
 * OPTIMIZACIONES DE PERFORMANCE:
 * - Desktop: Pre-carga de todas las imágenes al inicio (95% calidad)
 * - Mobile: Solo precarga la primera imagen, luego carga la siguiente on-demand (75% calidad)
 * - Lazy loading agresivo en mobile para imágenes no visibles
 * - Preload de videos solo cuando están activos en mobile
 * - Renderizado optimizado: solo renderiza la activa y la siguiente en mobile
 * - Sizes attributes optimizados para mobile (90vw vs 60vw desktop)
 */

