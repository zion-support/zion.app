// app/error.tsx — Error Boundary
'use client';

import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-3">Something Went Wrong</h1>
        <p className="text-slate-400 mb-8 text-lg">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary px-8 py-3 text-lg cursor-pointer">
            🔄 Try Again
          </button>
          <Link href="/" className="btn-secondary px-8 py-3 text-lg inline-block">
            🏠 Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-slate-500 cursor-pointer">Error details</summary>
            <pre className="mt-4 text-xs text-red-400 bg-slate-900 p-4 rounded-lg overflow-auto max-h-60">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
