'use client';

import { useSplash } from '../contexts/SplashContext';
import Loader from './Loader';
import HydrationSafe from './HydrationSafe';

export default function SplashScreen() {
  const { isSplashVisible } = useSplash();

  if (!isSplashVisible) {
    return null;
  }
  return (
    <HydrationSafe>
      <Loader />
    </HydrationSafe>
  );
}
