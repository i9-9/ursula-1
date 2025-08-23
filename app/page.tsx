import { Suspense } from 'react';
import { getPortfolioItems } from '@/lib/contentful';
import FeaturedProject from './components/FeaturedProject';
import HomeSkeleton from './components/HomeSkeleton';

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeWrapper />
      </Suspense>
    </main>
  );
}

async function HomeWrapper() {
  const works = await getPortfolioItems();
  return <FeaturedProject works={works} />;
}
