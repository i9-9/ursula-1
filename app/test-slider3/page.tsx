import VariableWidthSlider from './VariableWidthSlider'
import { getHeroSlides } from '@/lib/contentful'

export default async function TestSlider3Page() {
  // Obtener slides reales de Contentful
  const heroSlides = await getHeroSlides()
  
  if (!heroSlides || heroSlides.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-xl font-medium mb-4">No hay slides disponibles</h1>
          <p className="text-sm opacity-70">Configura hero slides en Contentful</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <VariableWidthSlider slides={heroSlides} />
    </main>
  )
}
