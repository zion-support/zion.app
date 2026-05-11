import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Free Surveys – Gather Feedback for Free',
  description: 'Use free Microsoft Forms to create surveys and collect valuable insights.'
};

export default function SurveysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Free Surveys</h1>
        <p className="text-lg text-slate-300 mb-8">Create surveys, collect feedback, and generate leads—all with free Microsoft Forms.</p>
        <a
          href="https://forms.microsoft.com/?utm_source=ziontech&utm_medium=dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-colors"
        >
          Open Microsoft Forms
        </a>
      </div>
    </div>
  );
}
