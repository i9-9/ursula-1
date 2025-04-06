'use client';

import { useState, useEffect } from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '.';
        return prevDots + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mb-2"></div>
        <p className="text-sm opacity-70">
          {message}
          <span className="inline-block w-6 text-left">{dots}</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingState; 