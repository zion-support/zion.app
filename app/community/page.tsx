import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Community – Join our free Discord',
  description: 'Connect with developers, get support, and be part of our open-source community.'
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center text-slate-100">
        <h1 className="text-3xl font-bold mb-6">Join Our Free Discord Community</h1>
        <p className="mb-8">Chat with developers, ask questions, and help shape our projects.</p>
        <a
          href="https://discord.gg/your-invite-code"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition"
        >
          Join Discord
        </a>
      </div>
    </div>
  );
}
