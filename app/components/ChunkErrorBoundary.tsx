'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChunkErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's a chunk loading error
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      // Force page reload to resolve chunk loading issues
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a chunk loading error
      if (this.state.error?.message.includes('ChunkLoadError') || 
          this.state.error?.message.includes('Loading chunk')) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🔄</div>
              <h2 className="text-xl font-semibold text-foreground">
                Reloading Application...
              </h2>
              <p className="text-sm text-muted-foreground">
                There was an issue loading the application. Reloading automatically...
              </p>
            </div>
          </div>
        );
      }

      // For other errors, show the fallback or default error UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground">
              Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-foreground text-background rounded hover:opacity-80 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
