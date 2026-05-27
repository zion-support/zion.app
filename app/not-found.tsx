// app/not-found.tsx — Custom 404 Page
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 text-lg">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary px-8 py-3 text-lg">
            🏠 Go Home
          </Link>
          <Link href="/services/" className="btn-secondary px-8 py-3 text-lg">
            🛠️ Browse Services
          </Link>
          <Link href="/contact/" className="btn-secondary px-8 py-3 text-lg">
            📧 Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
