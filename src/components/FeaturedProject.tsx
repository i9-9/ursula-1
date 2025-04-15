'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: string
  title: string
  director: string
  mediaUrl: string
  duration: string
  isVideo: boolean
}

interface FeaturedProjectProps {
  projects: Project[]
}

const FeaturedProject = ({ projects }: FeaturedProjectProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  const currentProject = projects[currentIndex]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.play()
      } else {
        mainVideoRef.current.pause()
      }
    }
  }, [isPlaying])

  return (
    <div className="relative h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-light">STUDIO NAME</h1>
          <nav className="flex gap-6">
            <Link href="/work" className="hover:opacity-70 transition-opacity">WORK</Link>
            <Link href="/archive" className="hover:opacity-70 transition-opacity">ARCHIVE</Link>
            <Link href="/contact" className="hover:opacity-70 transition-opacity">CONTACT</Link>
          </nav>
        </div>
        <p className="text-sm opacity-70">DESCRIPTOR TEXT</p>
      </header>

      {/* Main Content */}
      <div className="flex h-full pt-20">
        {/* Main Project (75%) */}
        <div className="w-3/4 relative">
          <div className="absolute top-4 left-4 z-10 bg-black/50 px-2 py-1 rounded">
            {formatTime(mainVideoRef.current?.currentTime || 0)}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {currentProject.isVideo ? (
                <video
                  ref={mainVideoRef}
                  src={currentProject.mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={currentProject.mediaUrl}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl">{currentProject.title}</h2>
            <p className="text-sm opacity-70">{currentProject.director}</p>
          </div>
        </div>

        {/* Preview Project (25%) */}
        <div 
          className="w-1/4 relative cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleNext}
        >
          <div className="absolute top-4 right-4 z-10 bg-black/50 px-2 py-1 rounded">
            {formatTime(previewVideoRef.current?.currentTime || 0)}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={nextProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {nextProject.isVideo ? (
                <video
                  ref={previewVideoRef}
                  src={nextProject.mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={nextProject.mediaUrl}
                  alt={nextProject.title}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 text-right">
            <h3 className="text-lg">{nextProject.title}</h3>
            <p className="text-sm opacity-70">{nextProject.director}</p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          Next
        </button>
      </div>

      {/* Info Overlay */}
      <div 
        className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded cursor-pointer"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center gap-2">
          <span>{currentProject.title}</span>
          <button className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
            i
          </button>
        </div>
        {showInfo && (
          <div className="mt-2 text-sm">
            <p>Duration: {currentProject.duration}</p>
            <p>Director: {currentProject.director}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedProject 