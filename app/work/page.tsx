import { getWorksGridProjects } from '@/lib/contentful';
import WorkLoader from '@/app/components/WorkLoader';
import Copyright from '@/app/components/Copyright';

export default async function WorkPage() {
  return (
    <main className="min-h-screen">
      <WorkLoaderWrapper />
      <Copyright />
    </main>
  );
}

async function WorkLoaderWrapper() {
  const works = await getWorksGridProjects();
  return <WorkLoader works={works} />;
}


