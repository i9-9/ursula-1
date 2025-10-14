import { getHeroSlides } from '@/lib/contentful';
import FeaturedProjectSwiper from '@/app/components/FeaturedProjectSwiper';

export default async function TestSliderPage() {
  const heroSlides = await getHeroSlides();
  
  return (
    <main className="min-h-screen">
      <FeaturedProjectSwiper heroSlides={heroSlides} />
    </main>
  );
}

