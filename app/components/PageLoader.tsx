'use client';
import React, { useState, useEffect, memo } from 'react';

interface PageLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
  fallback?: React.ReactNode;
}

const PageLoader: React.FC<PageLoaderProps> = memo(({
  children,
  loading = false,
  fallback
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    // Simulate loading delay
    if (loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isLoading) {
    return (
      <div className="page-loader">
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
});

PageLoader.displayName = 'PageLoader';

export default PageLoader;