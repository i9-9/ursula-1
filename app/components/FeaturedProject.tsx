'use client'

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroSlide } from '@/lib/contentful'

// Memoized helper function
const getVideoSource = (slide: HeroSlide): string => {
  // Check if it's a YouTube URL
  if (slide.videoUrl && (slide.videoUrl.includes('youtube.com') || slide.videoUrl.includes('youtu.be'))) {
    const youtubeId = slide.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1];
    if (youtubeId) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeId}?controls=0&modestbranding=1&rel=0&showinfo=0&autoplay=1&mute=1`;
      return embedUrl;
    }
  }
  
  // Check if it's a Vimeo URL
  if (slide.videoUrl && slide.videoUrl.includes('vimeo.com')) {
    const vimeoId = slide.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    if (vimeoId) {
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}?controls=0&background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`;
      return embedUrl;
    }
  }
  
  // Direct video URL (MP4, etc.)
  if (slide.videoUrl) {
    return slide.videoUrl;
  }
  
  if (slide.src) {
    return slide.src;
  }
  
  return ''
}

// Memoized video component
const VideoSlide = ({ slide }: { slide: HeroSlide }) => {
  const videoSource = useMemo(() => getVideoSource(slide), [slide])
  
  const VideoContent = useMemo(() => {
    if (!videoSource) {
      return (
        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Video no disponible</p>
        </div>
      )
    }
    
    if (videoSource.includes('player.vimeo.com') || videoSource.includes('youtube.com/embed')) {
      return (
        <iframe
          src={videoSource}
          className="absolute inset-0 w-full h-full z-0"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={slide.title}
          loading="lazy"
        />
      )
    }
    
    return (
      <video
        src={videoSource}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    )
  }, [videoSource, slide.title])
  
  return VideoContent
}

interface FeaturedProjectProps {
  heroSlides?: HeroSlide[]
}

const FeaturedProject = ({ heroSlides = [] }: FeaturedProjectProps) => {
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

  // Memoized slides to avoid recalculation
  const slides = useMemo((): HeroSlide[] => {
    if (heroSlides && heroSlides.length > 0) {
      return heroSlides;
    }
    // Fallback to local works if no heroSlides provided
    return [
      {
        id: 'grid-1',
        title: 'Tres Pecados Después',
        client: 'Milo J',
        src: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
        alt: 'Videoclip para Milo J - Tres Pecados Después',
        type: 'video' as const,
        videoUrl: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
        order: 1,
      },
      {
        id: 'grid-2',
        title: 'Ali Oli',
        client: 'Milo J',
        src: '/videos_grid/2 Milo J - Ali Oli.mp4',
        alt: 'Videoclip para Milo J - Ali Oli',
        type: 'video' as const,
        videoUrl: '/videos_grid/2 Milo J - Ali Oli.mp4',
        order: 2,
      },
      {
        id: 'grid-3',
        title: 'Sola',
        client: 'Chita',
        src: '/videos_grid/3 - Chita - Sola.mp4',
        alt: 'Videoclip para Chita - Sola',
        type: 'video' as const,
        videoUrl: '/videos_grid/3 - Chita - Sola.mp4',
        order: 3,
      }
    ];
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
    
    const middleIndex = Math.floor(slides.length / 2)
    setCurrentIndex(middleIndex)

    const container = scrollContainerRef.current
    const target = slideRefs.current[middleIndex]
    if (!container || !target) return

    const previousBehavior = container.style.scrollBehavior
    container.style.scrollBehavior = 'auto'
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

  // If no slides, show a fallback message
  if (slides.length === 0) {
    return (
      <section className="absolute inset-0 px-0 bg-red-600 text-white overflow-hidden flex flex-col items-center justify-center" style={{ height: '100vh', paddingTop: 0 }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Featured Projects Available</h1>
          <p className="text-lg">Please check your Contentful configuration or add some projects.</p>
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
            
            /* Hacer que YouTube se vea más limpio */
            iframe[src*="youtube.com/embed"] {
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
          `}</style>
          <div className="flex items-center justify-start gap-0 w-max" style={{ minHeight: '0' }}>
            {/* Left spacer to allow first slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72vw)/2)' }} aria-hidden="true" />
            
            {slides.map((slide, index) => {
              const isActive = isHydrated && index === currentIndex
              
              return (
                <div
                  key={slide.id}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className="group flex-shrink-0 snap-center"
                  style={{ width: '72vw' }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slide.title} by ${slide.client}`}
                >
                  <div
                    className={`transition-all duration-300 ease-out will-change-transform ${isActive ? 'filter-none' : 'filter blur-[1px]'}`}
                    style={{ 
                      transform: `scale(${isActive ? 1 : 0.68})`,
                      opacity: isActive ? 1 : 0.2
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative w-full"
                      style={{ paddingBottom: '56.25%' }}
                    >
                      <VideoSlide slide={slide} />
                      {/* Hover overlay only on active slide */}
                      {isActive && (
                        <div className="absolute inset-0 z-20 group" aria-hidden="true">
                          <div className="pointer-events-none absolute inset-0 flex items-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/70 text-white px-2 py-1">
                              <div className="text-sm md:text-base font-medium uppercase leading-tight text-white">{slide.title}</div>
                              <div className="text-xs md:text-sm opacity-80 uppercase text-white">{slide.client}{slide.order ? ` · ${slide.order}` : ''}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
            
            {/* Right spacer to allow last slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72vw)/2)' }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProject