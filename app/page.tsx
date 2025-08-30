import { Suspense } from 'react';
import { getHeroSlides } from '@/lib/contentful';
import ClientHome from '@/app/components/ClientHome';
import Loader from '@/app/components/Loader';

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <HomeLoaderWrapper />
      </Suspense>
    </main>
  );
}

async function HomeLoaderWrapper() {
  const heroSlides = await getHeroSlides();
  return <ClientHome heroSlides={heroSlides} />;
}
