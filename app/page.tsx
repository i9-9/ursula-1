'use client';

import Navbar from './components/Navbar';
import HeroMarquee from './components/HeroMarquee';
import WorksGrid from './components/WorksGrid';
import Archive from './components/Archive';
import Contact from './components/Contact';
import { useScrollReveal, useTouchFeedback /* useSnapScroll */ } from './hooks/useScrollReveal';
import ScrollIndicator from './components/ScrollIndicator';

export default function Home() {
  // Activar los hooks de animación
  useScrollReveal();
  useTouchFeedback();
  // useSnapScroll(); // Deshabilitado temporalmente para evitar problemas con los enlaces
  
  return (
    <main>
      <Navbar />
      <ScrollIndicator />
      <HeroMarquee />
      <WorksGrid />
      <Archive />
      <Contact />
    </main>
  );
}
