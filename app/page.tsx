import FeaturedProject from './components/FeaturedProject'
import WorksGrid from './components/WorksGrid'
import Archive from './components/Archive'
import Contact from './components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <FeaturedProject works={[]} />
      <WorksGrid works={[]} />
      <Archive />
      <Contact />
    </main>
  )
}
