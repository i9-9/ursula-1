import Navbar from './components/Navbar';
import HeroMarquee from './components/HeroMarquee';
import WorksGrid from './components/WorksGrid';
import Archive from './components/Archive';
import Contact from './components/Contact';
import ScrollIndicator from './components/ScrollIndicator';
import { getHeroSlides, getPortfolioItems, getArchiveData } from '@/lib/contentful';
import ClientWrapper from './components/ClientWrapper';

// Server Component principal
export default async function Home() {
  // Obtener datos de Contentful
  const heroSlides = await getHeroSlides();
  const portfolioItems = await getPortfolioItems();
  const archiveSections = await getArchiveData();
  
  return (
    <main>
      <ClientWrapper>
        <Navbar />
        <ScrollIndicator />
        <HeroMarquee slides={heroSlides} />
        <WorksGrid works={portfolioItems} />
        <Archive archiveData={archiveSections} />
        <Contact />
      </ClientWrapper>
    </main>
  );
}
