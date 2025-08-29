import { Suspense } from 'react';
import { getHeroSlides } from '@/lib/contentful';
import ClientHome from '@/app/components/ClientHome';
import HomeSkeleton from '@/app/components/HomeSkeleton';

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeLoaderWrapper />
      </Suspense>
    </main>
  );
}

async function HomeLoaderWrapper() {
  console.log('🔍 HomeLoaderWrapper: Starting to fetch heroSlides...')
  const heroSlides = await getHeroSlides();
  console.log('🔍 HomeLoaderWrapper: heroSlides fetched:', heroSlides)
  console.log('🔍 HomeLoaderWrapper: Returning ClientHome component')
  return <ClientHome heroSlides={heroSlides} />;
}
