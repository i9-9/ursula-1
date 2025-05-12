'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PortfolioItem } from '@/lib/contentful'

interface FeaturedProjectProps {
  works: PortfolioItem[]
}

const FeaturedProject = ({ works = [] }: FeaturedProjectProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAutoplaying, setIsAutoplaying] = useState(true)

  const projects = works.length > 0 ? works : [
    {
      id: 'grid-1',
      title: 'Tres Pecados Después',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
      contentType: 'video',
      description: 'Videoclip para Milo J - Tres Pecados Después.',
    },
    {
      id: 'grid-2',
      title: 'Ali Oli',
      artist: 'Milo J',
      year: '2024',
      thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
      fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
      contentType: 'video',
      description: 'Videoclip para Milo J - Ali Oli.',
    },
    {
      id: 'grid-3',
      title: 'Sola',
      artist: 'Chita',
      year: '2024',
      thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
      fullImage: '/videos_grid/3 - Chita - Sola.mp4',
      contentType: 'video',
      description: 'Videoclip para Chita - Sola.',
    },
    {
      id: 'grid-4',
      title: 'S.O.S',
      artist: 'Taichu ft Lali',
      year: '2024',
      thumbnail: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      fullImage: '/videos_grid/4 - Taichu ft Lali - S.O.S.mp4',
      contentType: 'video',
      description: 'Videoclip para Taichu ft Lali - S.O.S.',
    },
    {
      id: 'grid-5',
      title: 'Cirugía',
      artist: 'Dillom',
      year: '2024',
      thumbnail: '/videos_grid/5 - Dillom - Cirugia.mp4',
      fullImage: '/videos_grid/5 - Dillom - Cirugia.mp4',
      contentType: 'video',
      description: 'Videoclip para Dillom - Cirugía.',
    },
    {
      id: 'grid-6',
      title: 'Bonafont MX',
      artist: 'Dir. Carmen Rivoira - Prod. Mamahungara',
      year: '2024',
      thumbnail: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      fullImage: '/videos_grid/6 - Dir. Carmen Rivoira - Prod. Mamahungara - Bonafont MX.mp4',
      contentType: 'video',
      description: 'Commercial para Bonafont MX. Dirección: Carmen Rivoira. Producción: Mamahungara.',
    }
  ]

  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingRef.current) return
    
    const container = scrollContainerRef.current
    const scrollLeft = container.scrollLeft
    const containerWidth = container.clientWidth
    const videoWidth = containerWidth * 0.9
    const totalWidth = videoWidth * projects.length
    
    // Calculate current index
    const newIndex = Math.floor(scrollLeft / videoWidth) % projects.length
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }

    // Check if we need to reset position
    if (scrollLeft >= totalWidth * 2) {
      isScrollingRef.current = true
      container.scrollLeft = totalWidth
      isScrollingRef.current = false
    } else if (scrollLeft <= 0) {
      isScrollingRef.current = true
      container.scrollLeft = totalWidth
      isScrollingRef.current = false
    }
  }

  const startAutoAdvance = useCallback(() => {
    if (!isAutoplaying) return
    
    intervalRef.current = setInterval(() => {
      if (!scrollContainerRef.current || isScrollingRef.current || isDragging) return
      
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const videoWidth = containerWidth * 0.9
      const nextPosition = container.scrollLeft + videoWidth
      
      container.scrollTo({
        left: nextPosition,
        behavior: 'smooth'
      })
    }, 15000)
  }, [isAutoplaying, isDragging])

  useEffect(() => {
    // Set initial scroll position to show first slide complete
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Start at the beginning of the first set
      container.scrollLeft = 0;
    }
    
    startAutoAdvance();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [startAutoAdvance]);

  // Separate useEffect for handling auto-advance when currentIndex changes
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    startAutoAdvance()
  }, [currentIndex, isAutoplaying, startAutoAdvance])

  // DRAG IMPLEMENTATION
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true)
    setDragStart(clientX)
    setIsAutoplaying(false)
    document.body.style.cursor = 'grabbing'
    
    // Pause the auto-advance
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    
    const offset = clientX - dragStart
    setDragOffset(offset)
    
    // Directly manipulate scroll position for immediate feedback
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= offset * 0.1
    }
  }, [isDragging, dragStart])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    document.body.style.cursor = ''
    
    // Determine the direction of the swipe
    const container = scrollContainerRef.current
    if (container) {
      const containerWidth = container.clientWidth
      const videoWidth = containerWidth * 0.9
      const threshold = videoWidth * 0.2 // 20% of slide width
      
      if (Math.abs(dragOffset) > threshold) {
        if (dragOffset > 0) {
          // Swipe right (previous)
          container.scrollTo({
            left: container.scrollLeft - videoWidth,
            behavior: 'smooth'
          })
        } else {
          // Swipe left (next)
          container.scrollTo({
            left: container.scrollLeft + videoWidth,
            behavior: 'smooth'
          })
        }
      }
    }
    
    setIsDragging(false)
    setDragOffset(0)
    setIsAutoplaying(true)
    startAutoAdvance()
  }, [isDragging, dragOffset, startAutoAdvance])

  // Mouse Events
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const onMouseDown = (e: MouseEvent) => {
      // No iniciar arrastre si el clic fue en un botón
      if ((e.target as Element).closest('button')) return
      e.preventDefault()
      handleDragStart(e.clientX)
    }
    
    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX)
    }
    
    const onMouseUp = () => {
      handleDragEnd()
    }
    
    const onMouseLeave = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }
    
    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('mouseleave', onMouseLeave)
    
    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [handleDragStart, handleDragMove, handleDragEnd, isDragging])

  // Touch Events
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const onTouchStart = (e: TouchEvent) => {
      handleDragStart(e.touches[0].clientX)
      // Prevent scrolling the page
      e.preventDefault()
    }
    
    const onTouchMove = (e: TouchEvent) => {
      handleDragMove(e.touches[0].clientX)
      // Prevent scrolling when swiping horizontally
      if (isDragging && Math.abs(dragOffset) > 10) {
        e.preventDefault()
      }
    }
    
    const onTouchEnd = () => {
      handleDragEnd()
    }
    
    container.addEventListener('touchstart', onTouchStart, { passive: false })
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchend', onTouchEnd)
    
    return () => {
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleDragStart, handleDragMove, handleDragEnd, isDragging, dragOffset])

  return (
    <section 
      className="relative pt-8 px-2.5 md:px-[15px] bg-background text-foreground hidden md:block"
      style={{ height: '100vh' }}
    >
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden cursor-grab"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onScroll={handleScroll}
      >
        <div className="flex h-full items-center" style={{ 
          width: `${projects.length * 300}%`,
          gap: '15px',
        }}>
          {[...projects, ...projects, ...projects].map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="relative flex flex-col justify-center"
              style={{ 
                width: '75%',
                flexShrink: 0,
                maxWidth: '1200px'
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full"
                style={{ paddingBottom: '56.25%' }}
              >
                <video
                  src={project.fullImage}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </motion.div>
              
              {/* Project Info */}
              <div className="mt-4">
                <h2 className="h2 font-neue-haas-grotesk-display">{project.title}</h2>
                <p className="text-small opacity-70">{project.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        <button 
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={() => {
            const isCurrentlyPlaying = !isAutoplaying
            setIsAutoplaying(isCurrentlyPlaying)
            if (!isCurrentlyPlaying && intervalRef.current) {
              clearInterval(intervalRef.current)
            } else {
              startAutoAdvance()
            }
          }}
          aria-label={isAutoplaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoplaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="2" width="4" height="12" fill="currentColor" />
              <rect x="9" y="2" width="4" height="12" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2L14 8L4 14V2Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </section>
  )
}

export default FeaturedProject 