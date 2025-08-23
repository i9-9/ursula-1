import { Suspense } from 'react';
import { getPortfolioItems } from '@/lib/contentful';
import WorksGrid from '@/app/components/WorksGrid';
import WorksGridSkeleton from '@/app/components/WorksGridSkeleton';

export default async function WorkPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<WorksGridSkeleton />}>
        <WorksGridWrapper />
      </Suspense>
    </main>
  );
}

async function WorksGridWrapper() {
  const works = await getPortfolioItems();
  return <WorksGrid works={works} />;
}


