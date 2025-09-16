import { getHeroSlides } from '@/lib/contentful';
import ClientHome from '@/app/components/ClientHome';

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <HomeLoaderWrapper />
    </main>
  );
}

async function HomeLoaderWrapper() {
  const heroSlides = await getHeroSlides();
  return <ClientHome heroSlides={heroSlides} />;
}
