// Global chunk loading error handler
export const handleChunkError = (error: ErrorEvent) => {
  // Check if it's a chunk loading error
  if (error.message && (
    error.message.includes('ChunkLoadError') ||
    error.message.includes('Loading chunk') ||
    error.message.includes('Failed to fetch dynamically imported module')
  )) {
    console.warn('Chunk loading error detected, attempting to reload...');
    
    // Force page reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return true; // Error was handled
  }
  
  return false; // Error was not handled
};

// Initialize global error handlers
export const initializeChunkErrorHandling = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections (common with chunk loading)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason === 'string') {
        if (event.reason.includes('ChunkLoadError') || 
            event.reason.includes('Loading chunk')) {
          event.preventDefault();
          console.warn('Chunk loading promise rejection, reloading...');
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (handleChunkError(event)) {
        event.preventDefault();
      }
    });
  }
};

// Check if we're in a chunk loading error state
export const isChunkLoadingError = (error: Error | string | unknown): boolean => {
  if (typeof error === 'string') {
    return error.includes('ChunkLoadError') ||
           error.includes('Loading chunk') ||
           error.includes('Failed to fetch dynamically imported module');
  }
  
  if (error instanceof Error) {
    return error.message.includes('ChunkLoadError') ||
           error.message.includes('Loading chunk') ||
           error.message.includes('Failed to fetch dynamically imported module') ||
           error.name === 'ChunkLoadError';
  }
  
  return false;
};
