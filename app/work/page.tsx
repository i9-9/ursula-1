import { getPortfolioItems } from '@/lib/contentful';
import WorksGrid from '@/app/components/WorksGrid';

export default async function WorkPage() {
  const works = await getPortfolioItems();
  return (
    <main className="min-h-screen">
      <WorksGrid works={works} />
    </main>
  );
}


