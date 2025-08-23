import { Suspense } from 'react';
import { getArchiveData } from '@/lib/contentful';
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
  const sections = await getArchiveData();
  return <Archive sections={sections} />;
}


