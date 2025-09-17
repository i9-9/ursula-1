'use client'

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { HeroSlide } from '@/lib/contentful'

// Memoized image component
const ImageSlide = ({ slide }: { slide: HeroSlide }) => {
  const imageSource = useMemo(() => {
    // Prioritize the src field (which contains the optimized image URL)
    if (slide.src) {
      return slide.src;
    }
    
    // Fallback to videoUrl if it's an image
    if (slide.videoUrl && (slide.videoUrl.includes('.jpg') || slide.videoUrl.includes('.jpeg') || slide.videoUrl.includes('.png') || slide.videoUrl.includes('.webp'))) {
      return slide.videoUrl;
    }
    
    return '';
  }, [slide])
  
  const ImageContent = useMemo(() => {
    if (!imageSource) {
      return (
        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Imagen no disponible</p>
        </div>
      )
    }
    
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSource}
        alt={slide.alt || slide.title}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="lazy"
      />
    )
  }, [imageSource, slide.alt, slide.title])
  
  return ImageContent
}

interface FeaturedProjectProps {
  heroSlides?: HeroSlide[]
}

const FeaturedProject = ({ heroSlides = [] }: FeaturedProjectProps) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Simple hydration check
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Función para manejar click en slide
  const handleSlideClick = useCallback((slide: HeroSlide) => {
    if (slide.projectSlug) {
      const url = `/work/${slide.projectSlug}`;
      router.push(url);
    }
  }, [router])

  // Memoized slides to avoid recalculation
  const slides = useMemo((): HeroSlide[] => {
    // Always use slides from Contentful (including empty array)
    return heroSlides || [];
  }, [heroSlides])

  // Optimized scroll update with proper throttling
  const updateCurrentIndexFromScroll = useCallback(() => {
    if (isScrollingRef.current) return
    
    const container = scrollContainerRef.current
    if (!container) return
    
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2
    let closestIndex = 0
    let smallestDistance = Infinity
    
    slideRefs.current.forEach((el, idx) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const slideCenter = rect.left + rect.width / 2
      const distance = Math.abs(slideCenter - containerCenter)
      
      if (distance < smallestDistance) {
        smallestDistance = distance
        closestIndex = idx
      }
    })
    
    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex)
    }
  }, [currentIndex])

  // Initial position to center slide without horizontal animation
  useLayoutEffect(() => {
    if (!isHydrated) return
    
    const firstIndex = 0 // Always start at slide 1 (index 0)
    setCurrentIndex(firstIndex)

    const container = scrollContainerRef.current
    const target = slideRefs.current[firstIndex]
    if (!container || !target) return

    // Ensure we start at the first slide (slide 1)
    const previousBehavior = container.style.scrollBehavior
    container.style.scrollBehavior = 'auto'
    
    // Force scroll to the first slide
    container.scrollLeft = 0
    target.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
    
    container.style.scrollBehavior = previousBehavior
  }, [slides.length, isHydrated])

  // Optimized scroll listener with RAF throttling
  useEffect(() => {
    if (!isHydrated) return
    
    const container = scrollContainerRef.current
    if (!container) return
    
    let rafId: number | null = null
    
    const handleScroll = () => {
      if (rafId) return
      
      rafId = requestAnimationFrame(() => {
        updateCurrentIndexFromScroll()
        rafId = null
      })
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [updateCurrentIndexFromScroll, isHydrated])

  // Enable vertical wheel -> horizontal scroll mapping
  useEffect(() => {
    if (!isHydrated) return
    
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault()
        container.scrollLeft += event.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [isHydrated])

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutId = scrollTimeoutRef.current
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // If no slides, show a loading state or empty message
  if (slides.length === 0) {
    return (
      <section className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center" style={{ height: '100vh', paddingTop: 0 }}>
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">Cargando proyectos destacados...</h1>
          <p className="text-sm opacity-70">Conectando con Contentful</p>
        </div>
      </section>
    );
  }
  
  return (
    <section 
      className="absolute inset-0 px-0 bg-background text-foreground overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        height: '100vh',
        paddingTop: 0
      }}
    >
      
      <div className="w-full flex items-center justify-center">
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden px-0 snap-x snap-mandatory touch-pan-x"
          aria-label="Featured projects slider"
          style={{ 
            scrollPaddingInline: 'calc((100vw - 72vw)/2)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
            
            /* Estilo para las imágenes del hero */
            img {
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          <div className="flex items-center justify-start gap-0 w-max" style={{ minHeight: '0' }}>
            {/* Left spacer to allow first slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 60vw)/2)' }} aria-hidden="true" />
            
            {slides.map((slide, index) => {
              const isActive = isHydrated && index === currentIndex
              const isClickable = Boolean(slide.projectSlug)
              
              return (
                <div
                  key={slide.id}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className={`group flex-shrink-0 snap-center ${isClickable ? 'cursor-pointer' : ''}`}
                  style={{ width: isActive ? '60vw' : 'calc(60vw + 120px)' }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slide.title} by ${slide.client}`}
                  onClick={() => isClickable && handleSlideClick(slide)}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      handleSlideClick(slide)
                    }
                  }}
                  tabIndex={isClickable ? 0 : -1}
                >
                  <div
                    className="transition-all duration-300 ease-out will-change-transform"
                    style={{ 
                      clipPath: isActive 
                        ? 'none' 
                        : 'inset(0 60px 0 60px)' // Show 60px peek on each side
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative w-full"
                      style={{ paddingBottom: isActive ? '56.25%' : '40%' }}
                    >
                      <ImageSlide slide={slide} />
                    </motion.div>
                  </div>
                </div>
              )
            })}
            
            {/* Right spacer to allow last slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 60vw)/2)' }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProject