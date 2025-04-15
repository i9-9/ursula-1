import FeaturedProject from '@/components/FeaturedProject'
import WorksGrid from '@/components/WorksGrid'
// import HeroMarquee from '@/components/HeroMarquee'

const projects = [
  {
    id: '1',
    title: 'Project One',
    director: 'Director Name',
    mediaUrl: '/videos/project1.mp4',
    duration: '2:30',
    isVideo: true
  },
  {
    id: '2',
    title: 'Project Two',
    director: 'Director Name',
    mediaUrl: '/videos/project2.mp4',
    duration: '3:15',
    isVideo: true
  },
  // Add more projects as needed
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* <HeroMarquee /> */}
      <FeaturedProject projects={projects} />
      <WorksGrid />
    </main>
  )
} 