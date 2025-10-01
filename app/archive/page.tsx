import { getProjects } from '@/lib/contentful';
import Archive from '@/app/components/Archive';
import Copyright from '@/app/components/Copyright';

export default async function ArchivePage() {
  return (
    <div className="relative min-h-screen">
      <main className="min-h-screen" style={{ minHeight: 'calc(100vh - 36px)' }}>
        <ArchiveWrapper />
      </main>
      <div className="absolute bottom-8 right-0 px-4 md:px-[30px]">
        <Copyright absolute={true} />
      </div>
    </div>
  );
}

async function ArchiveWrapper() {
  const projects = await getProjects();
  return <Archive projects={projects} />;
}


