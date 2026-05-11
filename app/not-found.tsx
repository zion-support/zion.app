import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-[-9rem] h-[26rem] w-[26rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-300/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-100">
          Error 404
        </span>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Page{' '}
          <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
            Not Found
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
          on track.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
          >
            Back to Home
          </a>
          <a
            href="/solutions"
            className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
          >
            Explore Solutions
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-purple-400/40 bg-purple-500/10 px-7 py-3 text-base font-semibold text-purple-100 transition hover:bg-purple-500/20"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}