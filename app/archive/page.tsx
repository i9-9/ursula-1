import { getProjects } from '@/lib/contentful';
import Archive from '@/app/components/Archive';

export default async function ArchivePage() {
  return (
    <main className="min-h-screen">
      <ArchiveWrapper />
    </main>
  );
}

async function ArchiveWrapper() {
  const projects = await getProjects();
  return <Archive projects={projects} />;
}


