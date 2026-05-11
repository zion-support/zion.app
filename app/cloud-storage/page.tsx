import React from 'react';
import Link from 'next/link';
import { Database, ExternalLink } from 'lucide-react';

const cloudStorage = [
  {
    name: 'Google Drive',
    href: 'https://drive.google.com/?ref=ziontech',
    desc: '15GB free storage with Google account.',
    category: 'Personal'
  },
  {
    name: 'Dropbox',
    href: 'https://www.dropbox.com/?ref=ziontech',
    desc: '2GB free storage with referral bonus.',
    category: 'Personal'
  },
  {
    name: 'OneDrive',
    href: 'https://onedrive.live.com/?ref=ziontech',
    desc: '5GB free storage with Microsoft account.',
    category: 'Personal'
  },
  {
    name: 'pCloud',
    href: 'https://www.pcloud.com/?ref=ziontech',
    desc: '10GB free storage with lifetime option.',
    category: 'Personal'
  },
  {
    name: 'MEGA',
    href: 'https://mega.io/?ref=ziontech',
    desc: '20GB free storage with end-to-end encryption.',
    category: 'Personal'
  },
  {
    name: 'Amazon S3 Free Tier',
    href: 'https://aws.amazon.com/s3/?ref=ziontech',
    desc: '5GB free storage monthly for 12 months.',
    category: 'Cloud'
  },
  {
    name: 'Google Cloud Storage',
    href: 'https://cloud.google.com/storage?ref=ziontech',
    desc: '5GB free storage monthly for first 12 months.',
    category: 'Cloud'
  },
  {
    name: 'Backblaze B2',
    href: 'https://www.backblaze.com/b2/cloud-storage.html?ref=ziontech',
    desc: '10GB free storage monthly with referral bonus.',
    category: 'Cloud'
  },
];

// Group by category
const grouped = cloudStorage.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, typeof cloudStorage>);

export const metadata = {
  title: 'Free Cloud Storage Services | Zion Tech Group',
  description: 'Curated free cloud storage providers. Referral links support our open-source work.',
};

export default function CloudStoragePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Cloud Storage Services
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Curated list of free cloud storage providers. Every referral helps keep our open‑source projects free.
          </p>
        </div>

        {/* Grouped Storage */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.desc}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Custom Storage Solutions?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Book a free consultation to discuss the best storage strategy for your workflow.
          </p>
          <a
            href="/consulting"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Free Consultation
          </a>
        </div>

        {/* Back to Support */}
        <div className="mt-12 text-center">
          <a 
            href="/support"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Support Page
          </a>
        </div>
      </div>
    </div>
  );
}
