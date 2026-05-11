import React, { useEffect, useState, memo } from "react";
import { HelmetProvider } from "react-helmet-async";
import Navigation from "./app/components/Navigation";
import Footer from "./app/components/Footer";
import LazyHomePage from "./app/components/LazyHomePage";
import PerformanceMonitor from "./app/components/PerformanceMonitor";
import PerformanceDashboard from "./app/components/PerformanceDashboard";
import PWAInstaller from "./app/components/PWAInstaller";
import ServiceWorkerRegistration from "./app/components/ServiceWorkerRegistration";
import SEOHead from "./app/components/SEOHead";
import AccessibilityEnhancer from "./app/components/AccessibilityEnhancer";
import ErrorBoundary from "./app/components/ErrorBoundary";
import LoadingSpinner from "./app/components/LoadingSpinner";
import PerformanceOptimizer from "./app/components/PerformanceOptimizer";

// Note: Page imports removed as they are not used in the main App component
// Individual pages are handled by Next.js routing

// Note: Lazy imports removed as they are not used in the main App component
// Individual pages are handled by Next.js routing

// Error fallback component
export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
        <p className="mt-2 text-sm text-gray-500">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
);
// Memoized loading component
const LoadingFallback = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

// Memoized main content component
const MainContent = memo(() => (
  <main className="relative z-10" id="main-content" role="main">
    <LazyHomePage />
  </main>
));

// Memoized app layout component
const AppLayout = memo(() => (
  <div className="min-h-screen bg-slate-900">
    <Navigation />
    <MainContent />
    <Footer />
    <PerformanceMonitor />
    <PerformanceDashboard />
    <PWAInstaller />
    <AccessibilityEnhancer />
  </div>
));

const App = memo(() => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading application...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SEOHead />
        <PerformanceOptimizer>
          <AppLayout />
          <ServiceWorkerRegistration />
        </PerformanceOptimizer>
      </HelmetProvider>
    </ErrorBoundary>
  );
});

App.displayName = 'App';export default App;