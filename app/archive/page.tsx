import { getProjects } from '@/lib/contentful';
import Archive from '@/app/components/Archive';
import Copyright from '@/app/components/Copyright';

export default async function ArchivePage() {
  return (
    <main className="min-h-screen">
      <ArchiveWrapper />
      <Copyright />
    </main>
  );
}

async function ArchiveWrapper() {
  const projects = await getProjects();
  return <Archive projects={projects} />;
}


