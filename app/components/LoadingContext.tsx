'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface LoadingContextType {
  registerLoader: (id: string) => void;
  unregisterLoader: (id: string) => void;
  setLoaderReady: (id: string) => void;
  isAllReady: boolean;
  activeLoaders: Set<string>;
  readyLoaders: Set<string>;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLoaders, setActiveLoaders] = useState<Set<string>>(new Set());
  const [readyLoaders, setReadyLoaders] = useState<Set<string>>(new Set());
  const loadersRef = useRef<Set<string>>(new Set());
  const readyRef = useRef<Set<string>>(new Set());

  const registerLoader = useCallback((id: string) => {

    loadersRef.current.add(id);
    setActiveLoaders(new Set(loadersRef.current));
  }, []);

  const unregisterLoader = useCallback((id: string) => {

    loadersRef.current.delete(id);
    readyRef.current.delete(id);
    setActiveLoaders(new Set(loadersRef.current));
    setReadyLoaders(new Set(readyRef.current));
  }, []);

  const setLoaderReady = useCallback((id: string) => {
    console.log(`✅ Loader ready: ${id}`);
    readyRef.current.add(id);
    setReadyLoaders(new Set(readyRef.current));
  }, []);

  const isAllReady = activeLoaders.size === 0 || 
    (activeLoaders.size > 0 && activeLoaders.size === readyLoaders.size);

  useEffect(() => {
    console.log(`📊 Loading Status - Active: ${activeLoaders.size}, Ready: ${readyLoaders.size}, All Ready: ${isAllReady}`);
  }, [activeLoaders, readyLoaders, isAllReady]);

  return (
    <LoadingContext.Provider 
      value={{ 
        registerLoader, 
        unregisterLoader, 
        setLoaderReady, 
        isAllReady,
        activeLoaders,
        readyLoaders
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};
