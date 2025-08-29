import { Suspense } from 'react';
import { getHeroSlides } from '@/lib/contentful';
import ClientHome from '@/app/components/ClientHome';
import HomeHeroSkeleton from '@/app/components/HomeHeroSkeleton';

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HomeHeroSkeleton />}>
        <HomeLoaderWrapper />
      </Suspense>
    </main>
  );
}

async function HomeLoaderWrapper() {
  const heroSlides = await getHeroSlides();
  return <ClientHome heroSlides={heroSlides} />;
}
