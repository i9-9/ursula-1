import { Suspense } from 'react';
import ClientHome from './components/ClientHome';
import { getPortfolioItems, getHeroSlides, getArchiveData } from '@/lib/contentful';

export default async function Home() {
  // Fetch data on the server
  const [portfolioItems, heroSlides, archiveSections] = await Promise.all([
    getPortfolioItems(),
    getHeroSlides(),
    getArchiveData()
  ]);

  console.log('Portfolio items count:', portfolioItems.length);
  console.log('Hero slides count:', heroSlides.length);
  console.log('Archive sections count:', archiveSections.length);

  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
    </main>
    }>
      <ClientHome 
        initialPortfolioItems={portfolioItems} 
        initialHeroSlides={heroSlides} 
        archiveSections={archiveSections}
      />
    </Suspense>
  );
}
