'use client';

import { useState, useEffect } from 'react';

interface UseSequentialAnimationOptions {
  itemCount: number;
  delayBetweenItems?: number;
  initialDelay?: number;
  animationKey?: string | number;
}

export const useSequentialAnimation = ({
  itemCount,
  delayBetweenItems = 40,
  initialDelay = 50,
  animationKey = 0
}: UseSequentialAnimationOptions) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || itemCount === 0) return;

    console.log('🎬 Starting animation with:', { itemCount, delayBetweenItems, initialDelay });

    // Reset animation state - hide all items immediately
    setVisibleItems(new Set());

    // Start animation sequence after initial delay
    const resetTimer = setTimeout(() => {
      console.log('🎬 Animation sequence starting...');
      for (let index = 0; index < itemCount; index++) {
        setTimeout(() => {
          console.log(`🎬 Animating item ${index}`);
          setVisibleItems(prev => new Set(prev).add(index));
        }, index * delayBetweenItems);
      }
    }, initialDelay);

    return () => clearTimeout(resetTimer);
  }, [itemCount, delayBetweenItems, initialDelay, animationKey, isClient]);

  const isItemVisible = (index: number) => visibleItems.has(index);

  const getItemAnimationProps = (index: number) => {
    const isVisible = isItemVisible(index);
    console.log(`🎬 Item ${index} visibility:`, isVisible);
    
    return {
      className: `transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`,
      style: {
        transitionDelay: `${index * delayBetweenItems}ms`
      }
    };
  };

  return {
    isItemVisible,
    getItemAnimationProps,
    visibleItems
  };
};
