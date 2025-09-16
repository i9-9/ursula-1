import { getWorksGridProjects } from '@/lib/contentful';
import WorkLoader from '@/app/components/WorkLoader';

export default async function WorkPage() {
  return (
    <main className="min-h-screen">
      <WorkLoaderWrapper />
    </main>
  );
}

async function WorkLoaderWrapper() {
  const works = await getWorksGridProjects();
  return <WorkLoader works={works} />;
}


