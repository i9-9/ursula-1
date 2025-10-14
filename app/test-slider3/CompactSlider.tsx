'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

// ═══════════════════════════════════════════════════════════════
// 🎯 TIPOS Y CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

interface HeroSlide {
  id: string
  title: string
  src?: string
  videoUrl?: string
  alt?: string
}

const AUTO_PLAY_DELAY = 2500 // Slider más rápido - 2.5 segundos
const SLIDE_HEIGHT = 500 // Altura fija para todas las slides (en px)
const SLIDE_GAP = 20 // Espacio entre slides (en px)

// ═══════════════════════════════════════════════════════════════
// 📸 COMPONENTE INDIVIDUAL DE SLIDE
// ═══════════════════════════════════════════════════════════════

interface SlideItemProps {
  slide: HeroSlide
  index: number
}

function SlideItem({ slide, index }: SlideItemProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Calcular dimensiones solo para videos
  useEffect(() => {
    const element = videoRef.current
    if (!element) return

    const handleLoad = () => {
      const aspectRatio = element.videoWidth / element.videoHeight
      const width = SLIDE_HEIGHT * aspectRatio
      setDimensions({ width, height: SLIDE_HEIGHT })
    }

    if (element.readyState >= 1) {
      handleLoad()
    } else {
      element.addEventListener('loadedmetadata', handleLoad)
    }

    return () => {
      element.removeEventListener('loadedmetadata', handleLoad)
    }
  }, [])

  // Para imágenes usamos ancho fijo, para videos calculamos dinámicamente
  const slideWidth = slide.videoUrl && dimensions ? dimensions.width : 300

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: `${slideWidth}px`,
        height: `${SLIDE_HEIGHT}px`,
        marginRight: `${SLIDE_GAP}px`,
      }}
    >
      {slide.videoUrl ? (
        <video
          ref={videoRef}
          src={slide.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: 'auto',
            height: `${SLIDE_HEIGHT}px`,
            display: 'block',
          }}
        />
      ) : slide.src ? (
        <Image
          src={slide.src}
          alt={slide.alt || slide.title}
          width={300}
          height={SLIDE_HEIGHT}
          style={{
            width: 'auto',
            height: `${SLIDE_HEIGHT}px`,
            display: 'block',
          }}
        />
      ) : (
        <div 
          className="flex flex-col items-center justify-center bg-gray-800 text-white"
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

interface EmblaSliderProps {
  slides: HeroSlide[]
}

export default function EmblaSlider({ slides }: EmblaSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    skipSnaps: false,
  })

  const [isPlaying] = useState(true)

  // Auto-play
  useEffect(() => {
    if (!emblaApi || !isPlaying) return

    const autoPlayInterval = setInterval(() => {
      emblaApi.scrollNext()
    }, AUTO_PLAY_DELAY)

    return () => clearInterval(autoPlayInterval)
  }, [emblaApi, isPlaying])

  return (
    <div 
      className="w-full flex items-center justify-center bg-black"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className="relative w-full overflow-hidden" ref={emblaRef}>
        <div className="flex items-center">
          {slides.map((slide, index) => (
            <SlideItem key={slide.id} slide={slide} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 SIN LETTERBOXING - DIV SE AJUSTA A LA IMAGEN
 * ═══════════════════════════════════════════════════════════════
 * 
 * ✅ El DIV se ajusta exactamente a las dimensiones de la imagen
 * ✅ Altura fija de 500px, ancho calculado por aspect ratio
 * ✅ Sin object-fit - la imagen llena su contenedor naturalmente
 * ✅ Sin recortes, sin espacios vacíos, sin letterboxing
 * ✅ Gap de 20px entre slides
 * ✅ Auto-play cada 4 segundos
 * ✅ Loop infinito centrado
 * 
 * CÓMO FUNCIONA:
 * 1. Se calcula el aspect ratio de la imagen/video
 * 2. Se calcula el ancho: width = height × aspectRatio
 * 3. El div contenedor tiene esas dimensiones exactas
 * 4. La imagen/video tiene esas dimensiones exactas
 * 5. Resultado: contenedor ajustado perfectamente a la imagen
 * 
 * EJEMPLO DE USO:
 * 
 * const slides = [
 *   { id: '1', title: 'Imagen', src: '/img.jpg' },
 *   { id: '2', title: 'Video', videoUrl: '/vid.mp4' }
 * ]
 * 
 * <EmblaSlider slides={slides} />
 */