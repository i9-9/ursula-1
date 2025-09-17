import { useState, useEffect } from 'react';

/**
 * Custom hook for managing hydration state
 * Ensures consistent behavior between SSR and CSR
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

/**
 * Hook for safely accessing browser APIs after hydration
 * @param defaultValue - Default value to return before hydration
 * @param getValue - Function to get the actual value after hydration
 */
export const useSafeBrowserValue = <T>(
  defaultValue: T,
  getValue: () => T
): T => {
  const isHydrated = useHydration();
  
  if (!isHydrated) {
    return defaultValue;
  }
  
  try {
    return getValue();
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Hook for safely executing browser-only code after hydration
 * @param callback - Function to execute after hydration
 * @param deps - Dependencies for the effect
 */
export const useSafeBrowserEffect = (
  callback: () => void | (() => void),
  deps: React.DependencyList = []
) => {
  const isHydrated = useHydration();
  
  useEffect(() => {
    if (!isHydrated) return;
    
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, ...deps]);
};
