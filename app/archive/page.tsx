import { Suspense } from 'react';
import { getProjects } from '@/lib/contentful';
import Archive from '@/app/components/Archive';
import Loader from '@/app/components/Loader';

export default async function ArchivePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <ArchiveWrapper />
      </Suspense>
    </main>
  );
}

async function ArchiveWrapper() {
  const projects = await getProjects();
  return <Archive projects={projects} />;
}


