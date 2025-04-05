import Navbar from './components/Navbar';
import HeroMarquee from './components/HeroMarquee';
import WorksGrid from './components/WorksGrid';
import Archive from './components/Archive';
import Contact from './components/Contact';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroMarquee />
      <WorksGrid />
      <Archive />
      <Contact />
    </main>
  );
}
