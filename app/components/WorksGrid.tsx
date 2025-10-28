"use client"

import { useState, memo, useMemo, useCallback, useEffect } from "react"
import type { Project } from "@/lib/contentful"
import { useAssetPreloader } from "@/app/hooks/useAssetPreloader"
import { useIsMobile } from "@/app/hooks/useIsMobile"
import OptimizedProjectItem from "./OptimizedProjectItem"
import MobileProjectItem from "./MobileProjectItem"

interface WorksGridProps {
  works: Project[]
}

const ProjectItem = memo(
  ({
    project,
    globalIndex,
    orientation,
    hoveredProject,
    setHoveredProject,
    preloadProjectAsync,
    getVideoSource,
    isVideoProject,
    isImageProject,
    isPreloaded,
  }: {
    project: Project
    globalIndex: number
    orientation: "portrait" | "landscape" | "square"
    hoveredProject: string | null
    setHoveredProject: (id: string | null) => void
    preloadProjectAsync: (project: Project) => void
    getVideoSource: (project: Project) => string
    isVideoProject: (project: Project) => boolean
    isImageProject: (project: Project) => boolean
    isPreloaded: (url: string) => boolean
  }) => {
    return (
      <div key={project.id} className="flex flex-col justify-center h-full">
        <div className="flex-shrink-0">
          <OptimizedProjectItem
            project={project}
            index={globalIndex}
            hoveredProject={hoveredProject}
            setHoveredProject={setHoveredProject}
            onPreloadProject={preloadProjectAsync}
            getVideoSource={getVideoSource}
            isVideoProject={isVideoProject}
            isImageProject={isImageProject}
            isMobile={false}
            showNumber={false}
            showTitle={false}
            projectNumber=""
            skipContainer={true}
            imageOrientation={orientation}
            isPreloaded={isPreloaded}
          />
        </div>

      </div>
    )
  },
)

ProjectItem.displayName = "ProjectItem"

const WorksGrid = ({ works = [] }: WorksGridProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [visibleProjects, setVisibleProjects] = useState<Set<number>>(new Set())

  // Detectar si estamos en mobile
  const isMobile = useIsMobile(1024) // lg breakpoint

  // Hook para precargar assets críticos (solo en desktop)
  const { preloadProjectAsync, isPreloaded } = useAssetPreloader({
    projects: works,
    preloadCount: 6, // Precargar los primeros 6 proyectos
    isMobile: isMobile || false, // No precargar en mobile
  })

  // Memoizar funciones helper para evitar recreaciones
  const isVideoFile = useCallback((url: string) => {
    return url.includes(".mp4") || url.includes(".mov") || url.includes(".webm") || url.includes(".avi")
  }, [])

  const getVideoSource = useCallback((project: Project) => {
    // Solo usar videoUrl si es una URL de video directa (archivo)
    if (project.videoUrl && isVideoFile(project.videoUrl)) {
      return project.videoUrl
    }
    return project.thumbnail || ""
  }, [isVideoFile])

  const isVideoProject = useCallback((project: Project) => {
    return !!(project.videoUrl || project.vimeoId || project.youtubeUrl || project.videoThumbnail)
  }, [])

  const isImageProject = useCallback((project: Project) => {
    return !!(project.images && project.images.length > 0)
  }, [])

  // Animación escalonada al cargar
  useEffect(() => {
    if (works.length === 0) return

    // Reset animation state
    setVisibleProjects(new Set())

    // Start animation sequence
    const timer = setTimeout(() => {
      works.forEach((_, index) => {
        setTimeout(() => {
          setVisibleProjects(prev => new Set(prev).add(index))
        }, index * 80) // 80ms delay entre cada proyecto
      })
    }, 100) // 100ms delay inicial

    return () => clearTimeout(timer)
  }, [works])

  // Memoizar el layout móvil para evitar re-renders innecesarios
  const mobileLayout = useMemo(() => {
    return (
      <div className="lg:hidden px-4">
        {works.map((project, index) => {
          const projectNumber = project.archiveOrder
            ? project.archiveOrder.toString().padStart(2, "0")
            : (index + 1).toString().padStart(2, "0")

          const isVisible = visibleProjects.has(index)

          return (
            <div
              key={project.id}
              className="transition-opacity transition-transform duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                WebkitTransform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${index * 80}ms`,
                willChange: 'opacity, transform'
              }}
            >
              <MobileProjectItem
                project={project}
                projectNumber={projectNumber}
              />
            </div>
          )
        })}
      </div>
    )
  }, [works, visibleProjects])

  if (works.length === 0) {
    return (
      <section className="py-6 md:py-8 px-2.5 md:px-[15px] fade-in">
        <div className="text-center py-12">
          <p className="text-gray-500">No hay proyectos disponibles.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-2 px-4 md:px-[15px] fade-in">
      <div className="mb-6 md:mb-8"></div>

      {/* Mobile/Tablet Layout - Vertical Stack with moderate padding */}
      {mobileLayout}

      {/* Desktop Layout - Contenedor unificado por proyecto */}
      <div className="hidden lg:block px-6">
        {Array.from({ length: Math.ceil(works.length / 4) }, (_, rowIndex) => {
          const startIndex = rowIndex * 4
          const endIndex = Math.min(startIndex + 4, works.length)
          const projectsInRow = works.slice(startIndex, endIndex)

          return (
            <div key={rowIndex} className="mb-16">
              {/* Fila de números alineados con el margen derecho de las imágenes */}
              <div className="grid grid-cols-4 gap-8">
                {projectsInRow.map((project, index) => {
                  const globalIndex = startIndex + index
                  const projectNumber = project.archiveOrder
                    ? project.archiveOrder.toString().padStart(2, "0")
                    : (globalIndex + 1).toString().padStart(2, "0")

                  const isVisible = visibleProjects.has(globalIndex)

                  return (
                    <div
                      key={`number-${project.id}`}
                      className="flex justify-start transition-opacity transition-transform duration-700 ease-out"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        WebkitTransform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        transitionDelay: `${globalIndex * 80}ms`,
                        willChange: 'opacity, transform'
                      }}
                    >
                      {/* Ambos tipos usan el mismo ancho para mantener alineación vertical consistente */}
                      <div className="w-5/6 flex justify-end">
                        <span className="font-normal text-foreground text-[9px]">{projectNumber}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Fila de imágenes */}
              <div className="grid grid-cols-4 gap-8 items-center min-h-[200px]">
                {projectsInRow.map((project, index) => {
                  const globalIndex = startIndex + index
                  const isVisible = visibleProjects.has(globalIndex)

                  // Determinar orientación basada en el campo isVertical
                  const orientation = project.isVertical ? "portrait" : "square"

                  return (
                    <div
                      key={project.id}
                      className="transition-opacity transition-transform duration-700 ease-out"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        WebkitTransform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        transitionDelay: `${globalIndex * 80}ms`,
                        willChange: 'opacity, transform'
                      }}
                    >
                      <ProjectItem
                        project={project}
                        globalIndex={globalIndex}
                        orientation={orientation}
                        hoveredProject={hoveredProject}
                        setHoveredProject={setHoveredProject}
                        preloadProjectAsync={preloadProjectAsync}
                        getVideoSource={getVideoSource}
                        isVideoProject={isVideoProject}
                        isImageProject={isImageProject}
                        isPreloaded={isPreloaded}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Fila de títulos - alineados al margen izquierdo de las imágenes */}
              <div className="grid grid-cols-4 gap-8 mt-2">
                {projectsInRow.map((project, index) => {
                  const globalIndex = startIndex + index
                  const isVisible = visibleProjects.has(globalIndex)

                  return (
                    <div
                      key={`title-${project.id}`}
                      className="flex justify-start transition-opacity transition-transform duration-700 ease-out"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        WebkitTransform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                        transitionDelay: `${globalIndex * 80}ms`,
                        willChange: 'opacity, transform'
                      }}
                    >
                      <div className="w-5/6">
                        <p
                          className={`font-normal uppercase tracking-wide text-foreground text-left leading-tight text-[12px] transition-opacity duration-300 ${
                            hoveredProject === project.id ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {project.title}, {project.artist}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WorksGrid