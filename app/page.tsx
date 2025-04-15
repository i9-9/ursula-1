import Navbar from './components/Navbar';
import HeroMarquee from './components/HeroMarquee';
import WorksGrid from './components/WorksGrid';
import Archive from './components/Archive';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import { getHeroSlides, getPortfolioItems } from '@/lib/contentful';
import ClientWrapper from './components/ClientWrapper';
import FeaturedProject from './components/FeaturedProject';

// Server Component principal
export default async function Home() {
  // Obtener datos de Contentful
  const heroSlides = await getHeroSlides();
  const portfolioItems = await getPortfolioItems();

  const projects = [
    {
      id: '1',
      title: 'Project One',
      director: 'Director Name',
      mediaUrl: '/videos/project1.mp4',
      duration: '2:30',
      isVideo: true
    },
    {
      id: '2',
      title: 'Project Two',
      director: 'Director Name',
      mediaUrl: '/videos/project2.mp4',
      duration: '3:15',
      isVideo: true
    },
  ];

  return (
    <main>
      <ClientWrapper>
        <Navbar />
        <ScrollIndicator />
        {/* <HeroMarquee slides={heroSlides} /> */}
        <FeaturedProject projects={projects} />
        <WorksGrid works={portfolioItems} />
        <Archive />
        <Contact />
        <Footer />
      </ClientWrapper>
    </main>
  );
}
