import { Suspense } from 'react';
import { getProjects } from '@/lib/contentful';
import Archive from '@/app/components/Archive';
import ArchiveSkeleton from '@/app/components/ArchiveSkeleton';

export default async function ArchivePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<ArchiveSkeleton />}>
        <ArchiveWrapper />
      </Suspense>
    </main>
  );
}

async function ArchiveWrapper() {
  const projects = await getProjects();
  return <Archive projects={projects} />;
}


