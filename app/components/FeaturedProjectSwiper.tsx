'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Mousewheel } from 'swiper/modules'
import { HeroSlide } from '@/lib/contentful'
import { useSplash } from '../contexts/SplashContext'
import HydrationSafe from './HydrationSafe'

import 'swiper/css'

// ═══════════════════════════════════════════════════════════════
// 🎯 CONFIGURACIÓN FIJA: Normalización de altura + Auto-play
// ═══════════════════════════════════════════════════════════════

const SLIDE_HEIGHT_VH = 70 // Altura fija en vh
const GAP_SIZE = 80 // Espacio entre slides en px
const AUTOPLAY_DELAY = 3000 // Cambio automático cada 4 segundos

// ═══════════════════════════════════════════════════════════════
// 📦 MediaSlide - Altura normalizada con dimensiones calculadas
// ═══════════════════════════════════════════════════════════════

interface MediaSlideProps {
  slide: HeroSlide
  slideHeight: number // Altura calculada en px
}

const MediaSlide = ({ slide, slideHeight }: MediaSlideProps) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Calcular ancho basado en aspect ratio original y altura fija
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const aspectRatio = img.naturalWidth / img.naturalHeight
    const calculatedWidth = slideHeight * aspectRatio
    setImageDimensions({ width: calculatedWidth, height: slideHeight })
  }

  // Contenedor con altura FIJA en píxeles (no vh relativo)
  const containerStyle: React.CSSProperties = {
    height: `${slideHeight}px`,
    width: imageDimensions ? `${imageDimensions.width}px` : 'auto',
    minWidth: imageDimensions ? `${imageDimensions.width}px` : '400px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  if (slide.videoUrl) {
    return (
      <div style={containerStyle}>
        <video
          src={slide.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    )
  }

  if (slide.src) {
    return (
      <div style={containerStyle}>
        <Image
          src={slide.src}
          alt={slide.alt || slide.title}
          width={imageDimensions?.width || 800}
          height={slideHeight}
          onLoad={handleImageLoad}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
          }}
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 1200px"
          priority={false}
        />
      </div>
    )
  }

  return (
    <div style={{ ...containerStyle, background: '#1a1a1a', border: '1px dashed #333' }}>
      <p className="text-gray-500 text-sm">Media no disponible</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 Swiper Principal
// ═══════════════════════════════════════════════════════════════

interface FeaturedProjectSwiperProps {
  heroSlides?: HeroSlide[]
}

const FeaturedProjectSwiper = ({ heroSlides = [] }: FeaturedProjectSwiperProps) => {
  const router = useRouter()
  const { isSplashVisible } = useSplash()
  
  // Calcular altura en píxeles basada en viewport
  const slideHeightPx = typeof window !== 'undefined' 
    ? (window.innerHeight * SLIDE_HEIGHT_VH) / 100 
    : 700 // fallback

  const handleSlideClick = useCallback(
    (slide: HeroSlide) => {
      if (slide.projectSlug) router.push(`/work/${slide.projectSlug}`)
    },
    [router]
  )

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className={`w-full flex flex-col items-center justify-center bg-background text-foreground`} style={{ height: 'calc(100vh - 71.5px)' }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando proyectos destacados...</h1>
          <p className="text-sm opacity-70">Conectando con Contentful</p>
        </div>
      </section>
    )
  }

  if (isSplashVisible) return null

  return (
    <HydrationSafe>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🎭 ESTILOS: Transición de escala suave y consistente */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* Wrapper alineado al centro */
        .featured-swiper .swiper-wrapper {
          align-items: center !important;
        }
        
        /* Cada slide mantiene su altura natural */
        .featured-swiper .swiper-slide {
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
        .featured-swiper .swiper-slide-active {
          transform: scale(1) !important;
          opacity: 1 !important;
          z-index: 10 !important;
        }
        
        /* Slides adyacentes: scale intermedio más pequeño */
        .featured-swiper .swiper-slide-next,
        .featured-swiper .swiper-slide-prev {
          transform: scale(0.6) !important;
          opacity: 0.5 !important;
          z-index: 5 !important;
        }
        
        /* Prevenir overflow horizontal */
        .featured-swiper {
          overflow: hidden !important;
        }
      `}</style>
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🎡 SWIPER: centeredSlides + spaceBetween consistente */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section 
        className={`w-full flex flex-col items-center justify-center bg-background text-foreground`}
        style={{ height: 'calc(100vh - 71.5px)' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Swiper
            modules={[Autoplay, Mousewheel]}
            spaceBetween={GAP_SIZE}
            slidesPerView="auto"
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: AUTOPLAY_DELAY,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            mousewheel={{ 
              forceToAxis: true, 
              sensitivity: 1.5, 
              releaseOnEdges: true,
              thresholdDelta: 30
            }}
            grabCursor
            className="w-full featured-swiper"
            watchSlidesProgress={true}
            speed={600}
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
            {heroSlides.map((slide, index) => {
              const isClickable = Boolean(slide.projectSlug)
              
              return (
                <SwiperSlide 
                  key={`${slide.id}-${index}`}
                  className={isClickable ? 'cursor-pointer' : ''}
                  onClick={() => isClickable && handleSlideClick(slide)}
                  style={{ width: 'auto' }}
                >
                  <MediaSlide slide={slide} slideHeight={slideHeightPx} />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </section>
    </HydrationSafe>
  )
}

export default FeaturedProjectSwiper

/**
 * SOLUCIÓN APLICADA (siguiendo principios frontend-developer template):
 * 
 * 1. ALTURA NORMALIZADA:
 *    - Calculamos altura en px desde 70vh
 *    - Pasamos slideHeightPx como prop
 *    - Contenedor tiene height fijo en píxeles (no relativo)
 * 
 * 2. NEXT.JS IMAGE CORREGIDO:
 *    - Usamos width/height explícitos (NO fill)
 *    - onLoad calcula dimensiones basadas en aspect ratio original
 *    - Ancho se ajusta proporcionalmente a altura fija
 * 
 * 3. GAPS CONSISTENTES:
 *    - spaceBetween en píxeles constantes
 *    - Todos los contenedores tienen misma altura
 *    - Gaps visualmente uniformes
 * 
 * 4. CENTRADO HORIZONTAL:
 *    - centeredSlides={true}
 *    - slidesPerView="auto" + width: 'auto'
 *    - Cada slide ocupa su ancho natural
 * 
 * 5. TRANSICIONES SUAVES:
 *    - CSS transitions en transform y opacity
 *    - Scale 0.75 → 1.0 con cubic-bezier
 *    - Duración 600ms
 * 
 * 6. AUTOPLAY:
 *    - Módulo Autoplay de Swiper
 *    - Cambio automático cada 4 segundos
 *    - Pausa al hacer hover
 *    - Continúa después de interacción manual
 *    - Loop infinito
 * 
 * PERFORMANCE:
 * - State local para dimensiones (evita re-renders globales)
 * - onLoad solo calcula una vez por imagen
 * - priority={false} para lazy loading
 * 
 * TYPE SAFETY:
 * - Interface MediaSlideProps con tipos explícitos
 * - React.CSSProperties para containerStyle
 * - Callbacks tipados con useCallback
 */
