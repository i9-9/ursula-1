import { Suspense } from 'react';
import { getPortfolioItems } from '@/lib/contentful';
import WorkLoader from '@/app/components/WorkLoader';
import WorksGridSkeleton from '@/app/components/WorksGridSkeleton';

export default async function WorkPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<WorksGridSkeleton />}>
        <WorkLoaderWrapper />
      </Suspense>
    </main>
  );
}

async function WorkLoaderWrapper() {
  const works = await getPortfolioItems();
  return <WorkLoader works={works} />;
}


