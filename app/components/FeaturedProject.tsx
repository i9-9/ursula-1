'use client'

import { useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'

// Simulated types and data
interface PortfolioItem {
  id: string
  title: string
  artist: string
  year: string
  thumbnail?: string
  fullImage?: string
  vimeoId?: string
  contentType: 'video'
  description: string
}

const localWorks: Array<{
  title?: string
  vimeoId?: string
  youtubeUrl?: string
}> = [
  // Simulated local works data
]

// Memoized helper function
const getVideoSource = (project: PortfolioItem): string => {
  if (project.fullImage) return project.fullImage
  if (project.thumbnail) return project.thumbnail
  if (project.vimeoId) {
    return `https://player.vimeo.com/video/${project.vimeoId}?controls=0&background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`
  }
  
  const localWork = localWorks.find(work => 
    work.title?.toLowerCase().includes(project.title.toLowerCase()) ||
    project.title.toLowerCase().includes(work.title?.toLowerCase() || '')
  )
  
  if (localWork?.vimeoId) {
    return `https://player.vimeo.com/video/${localWork.vimeoId}?controls=0&background=1&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`
  }
  
  if (localWork?.youtubeUrl) {
    const youtubeId = localWork.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1]
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0`
    }
  }
  
  return ''
}

// Memoized video component
const VideoSlide = ({ project }: { project: PortfolioItem }) => {
  const videoSource = useMemo(() => getVideoSource(project), [project])
  
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
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title={project.title}
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
  }, [videoSource, project.title])
  
  return VideoContent
}

interface FeaturedProjectProps {
  works?: PortfolioItem[]
}

const FeaturedProject = ({ works = [] }: FeaturedProjectProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized projects to avoid recalculation
  const projects = useMemo(() => {
    const baseProjects = works.length > 0 ? works : [
      {
        id: 'grid-1',
        title: 'Tres Pecados Después',
        artist: 'Milo J',
        year: '2024',
        thumbnail: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
        fullImage: '/videos_grid/1 Milo J - Tres Pecados Despues.mp4',
        contentType: 'video' as const,
        description: 'Videoclip para Milo J - Tres Pecados Después.',
      },
      {
        id: 'grid-2',
        title: 'Ali Oli',
        artist: 'Milo J',
        year: '2024',
        thumbnail: '/videos_grid/2 Milo J - Ali Oli.mp4',
        fullImage: '/videos_grid/2 Milo J - Ali Oli.mp4',
        contentType: 'video' as const,
        description: 'Videoclip para Milo J - Ali Oli.',
      },
      {
        id: 'grid-3',
        title: 'Sola',
        artist: 'Chita',
        year: '2024',
        thumbnail: '/videos_grid/3 - Chita - Sola.mp4',
        fullImage: '/videos_grid/3 - Chita - Sola.mp4',
        contentType: 'video' as const,
        description: 'Videoclip para Chita - Sola.',
      }
    ]
    return baseProjects.slice(0, 3)
  }, [works])

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

  // Optimized wheel handler
  // Wheel handler removed to avoid unnecessary work; container is overflow-hidden

  // Optimized navigation (unused currently)

  // Navigation disabled

  // Initial position to center slide without horizontal animation
  useLayoutEffect(() => {
    const middleIndex = Math.floor(projects.length / 2)
    setCurrentIndex(middleIndex)

    const container = scrollContainerRef.current
    const target = slideRefs.current[middleIndex]
    if (!container || !target) return

    const previousBehavior = container.style.scrollBehavior
    container.style.scrollBehavior = 'auto'
    target.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
    container.style.scrollBehavior = previousBehavior
  }, [projects.length])

  // Optimized scroll listener with RAF throttling
  useEffect(() => {
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
  }, [updateCurrentIndexFromScroll])

  // Enable vertical wheel -> horizontal scroll mapping
  useEffect(() => {
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
  }, [])

  // Keyboard navigation disabled (no scroll)

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutId = scrollTimeoutRef.current
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return (
    <section 
      className="relative px-0 bg-background text-foreground overflow-hidden"
      style={{ height: 'calc(100vh - var(--navbar-height))' }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden px-0 snap-x snap-mandatory touch-pan-x"
          aria-label="Featured projects slider"
          style={{ scrollPaddingInline: 'calc((100vw - 72vw)/2)' }}
        >
          <div className="flex items-center justify-start gap-0 w-max">
            {/* Left spacer to allow first slide to center */}
            <div className="flex-shrink-0" style={{ width: 'calc((100vw - 72vw)/2)' }} aria-hidden="true" />
            
            {projects.map((project, index) => {
              const isActive = index === currentIndex
              
              return (
                <div
                  key={project.id}
                  ref={(el) => { if (el) slideRefs.current[index] = el }}
                  className="group flex-shrink-0 snap-center"
                  style={{ width: '72vw' }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${project.title} by ${project.artist}`}
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
                      <VideoSlide project={project} />
                      {/* Hover overlay only on active slide */}
                      {isActive && (
                        <div className="absolute inset-0 z-20 group" aria-hidden="true">
                          <div className="pointer-events-none absolute inset-0 flex items-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/70 text-white px-2 py-1">
                              <div className="text-sm md:text-base font-medium uppercase leading-tight text-white">{project.title}</div>
                              <div className="text-xs md:text-sm opacity-80 uppercase text-white">{project.artist}{project.year ? ` · ${project.year}` : ''}</div>
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

      {/* Controls removed: no arrows, no scroll */}

      {/* Copyright */}
      <div className="absolute right-4 bottom-3 text-xs opacity-60 select-none">
        © {new Date().getFullYear()}
      </div>
    </section>
  )
}

export default FeaturedProject