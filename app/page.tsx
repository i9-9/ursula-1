import { getHeroSlides } from '@/lib/contentful';
import ClientHome from '@/app/components/ClientHome';

// ISR: regenerar la home como máximo cada 60s (o cuando el webhook de Contentful revalide)
export const revalidate = 60;

export default async function HomePage() {
  return (
    <main className="h-screen">
      <HomeLoaderWrapper />
    </main>
  );
}

async function HomeLoaderWrapper() {
  const heroSlides = await getHeroSlides();
  return <ClientHome heroSlides={heroSlides} />;
}
