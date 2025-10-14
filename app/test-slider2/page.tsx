import { getHeroSlides } from '@/lib/contentful'
import FadeSlider from './FadeSlider'

export default async function TestSlider2Page() {
  const heroSlides = await getHeroSlides()
  
  if (!heroSlides || heroSlides.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-4">No hay slides disponibles</h1>
          <p className="text-sm opacity-70">Configura hero slides en Contentful</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <FadeSlider slides={heroSlides} />
    </main>
  )
}
