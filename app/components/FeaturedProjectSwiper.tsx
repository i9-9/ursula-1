'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import { HeroSlide } from '@/lib/contentful'
import { useSplash } from '../contexts/SplashContext'
import HydrationSafe from './HydrationSafe'

// Import Swiper styles
import 'swiper/css'

const MediaSlide = ({ slide }: { slide: HeroSlide }) => {
  const mediaStyle = {
    maxHeight: '70vh', // Altura máxima
    width: 'auto', // Ancho natural de la imagen
    height: 'auto',
    objectFit: 'contain' as const,
    display: 'block',
  }

  if (slide.videoUrl) {
    return (
      <video
        src={slide.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        style={mediaStyle}
      />
    )
  }

  if (slide.src) {
    return (
      <img 
        src={slide.src}
        alt={slide.alt || slide.title} 
        loading="lazy" 
        style={mediaStyle}
      />
    )
  }

  return (
    <div style={{ 
      height: '300px', 
      width: '300px', 
      background: '#eee', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p className="text-gray-500 text-sm">Media no disponible</p>
    </div>
  )
}

interface FeaturedProjectSwiperProps {
  heroSlides?: HeroSlide[]
}

const FeaturedProjectSwiper = ({ heroSlides = [] }: FeaturedProjectSwiperProps) => {
  const router = useRouter()
  const { isSplashVisible } = useSplash()

  const handleSlideClick = useCallback(
    (slide: HeroSlide) => {
      if (slide.projectSlug) router.push(`/work/${slide.projectSlug}`)
    },
    [router]
  )


  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: '100vh' }}>
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
      <style jsx global>{`
        .reference-swiper .swiper-wrapper {
          align-items: center !important;
          justify-content: center !important;
        }
        
        .reference-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.4s ease !important;
          transform: scale(0.8) !important;
          opacity: 0.6 !important;
        }
        
        .reference-swiper .swiper-slide-active {
          transform: scale(1.2) !important;
          opacity: 1 !important;
          z-index: 10 !important;
        }
        
        .reference-swiper .swiper-slide-next,
        .reference-swiper .swiper-slide-prev {
          transform: scale(1.0) !important;
          opacity: 0.8 !important;
          z-index: 5 !important;
        }
        
        .reference-swiper img,
        .reference-swiper video {
          border-radius: 0 !important;
          box-shadow: none !important;
          transition: inherit !important;
        }
      `}</style>
      
      <section className="absolute inset-0 flex flex-col items-center justify-center bg-background text-foreground" style={{ height: '100vh' }}>
        <div className="w-full flex items-center justify-center">
          <Swiper
            modules={[Mousewheel]}
            spaceBetween={80}
            slidesPerView={3}
            centeredSlides={true}
            mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
            grabCursor
            className="w-full reference-swiper"
            watchSlidesProgress={true}
            speed={600}
            breakpoints={{
              320: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3 }
            }}
          >
            {heroSlides.map((slide, index) => {
              const isClickable = Boolean(slide.projectSlug)
              
              return (
                <SwiperSlide 
                  key={`${slide.id}-${index}`}
                  className={isClickable ? 'cursor-pointer' : ''}
                  onClick={() => isClickable && handleSlideClick(slide)}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <MediaSlide slide={slide} />
                  </div>
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
