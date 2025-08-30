'use client';

import HydrationSafe from './HydrationSafe';
import Navbar from './Navbar';
import { useSplash } from '../contexts/SplashContext';

export default function NavbarWithLoader() {
  const { isSplashVisible } = useSplash();

  console.log('NavbarWithLoader: isSplashVisible:', isSplashVisible);

  // No mostrar el navbar si la splash screen está visible
  if (isSplashVisible) {
    console.log('NavbarWithLoader: Hiding navbar (splash visible)');
    return null;
  }

  console.log('NavbarWithLoader: Showing navbar');
  
  return (
    <HydrationSafe fallback={null}>
      <Navbar />
    </HydrationSafe>
  );
}
