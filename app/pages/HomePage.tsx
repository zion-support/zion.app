import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="home-page min-h-[40vh] flex flex-col items-center justify-center gap-6 bg-slate-950 px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Welcome to Zion Tech Group</h1>
      <p className="max-w-xl text-slate-300">
        Your partner in AI solutions and technology innovation. We deliver production-ready AI apps,
        secure engineering, and practical delivery roadmaps so your team can move from pilot to scale.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="/solutions"
          className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Explore solutions
        </a>
        <a
          href="/contact"
          className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-purple-400 hover:text-white"
        >
          Contact us
        </a>
      </div>
    </div>
  );
};

export default HomePage;