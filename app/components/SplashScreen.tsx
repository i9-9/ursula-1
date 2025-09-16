'use client';

import { useSplash } from '../contexts/SplashContext';
import Loader from './Loader';

export default function SplashScreen() {
  const { isSplashVisible } = useSplash();

  console.log('SplashScreen: isSplashVisible:', isSplashVisible);

  if (!isSplashVisible) {
    console.log('SplashScreen: Not rendering (isSplashVisible is false)');
    return null;
  }

  console.log('SplashScreen: Rendering Loader component');
  return <Loader />;
}
