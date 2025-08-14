import { getArchiveData } from '@/lib/contentful';
import Archive from '@/app/components/Archive';

export default async function ArchivePage() {
  const sections = await getArchiveData();
  return (
    <main className="min-h-screen">
      <Archive sections={sections} />
    </main>
  );
}


