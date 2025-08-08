import { Suspense } from 'react';
import ClientHome from './components/ClientHome';
import { getPortfolioItems, getArchiveData } from '@/lib/contentful';

export default async function Home() {
  // Fetch data on the server
  const [portfolioItems, archiveSections] = await Promise.all([
    getPortfolioItems(),
    getArchiveData()
  ]);

  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
    </main>
    }>
      <ClientHome 
        initialPortfolioItems={portfolioItems} 
        archiveSections={archiveSections}
      />
    </Suspense>
  );
}
