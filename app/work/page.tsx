import { Suspense } from 'react';
import { getWorksGridProjects } from '@/lib/contentful';
import WorkLoader from '@/app/components/WorkLoader';
import Loader from '@/app/components/Loader';

export default async function WorkPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <WorkLoaderWrapper />
      </Suspense>
    </main>
  );
}

async function WorkLoaderWrapper() {
  const works = await getWorksGridProjects();
  return <WorkLoader works={works} />;
}


