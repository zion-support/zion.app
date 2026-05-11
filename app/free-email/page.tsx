import React from 'react';
import Link from 'next/link';
import { Mail, ExternalLink } from 'lucide-react';

const emailServices = [
  {
    name: 'ProtonMail',
    href: 'https://proton.me/mail?ref=ziontech&utm_source=ziontechgroup.com&utm_medium=referral&utm_campaign=email',
    desc: 'Secure email with 500MB free storage.',
    category: 'Privacy-Focused'
  },
  {
    name: 'Tutanota',
    href: 'https://tutanota.com/?ref=ziontech&utm_source=ziontechgroup.com&utm_medium=referral&utm_campaign=email',
    desc: 'Encrypted email with 1GB free tier.',
    category: 'Privacy-Focused'
  },
  {
    name: 'Zoho Mail',
    href: 'https://www.zoho.com/mail/?ref=ziontech&utm_source=ziontechgroup.com&utm_medium=referral&utm_campaign=email',
    desc: 'Business email with 5GB free for 1 user.',
    category: 'Business'
  },
  {
    name: 'Gmail',
    href: 'https://mail.google.com/?ref=ziontech&utm_source=ziontechgroup.com&utm_medium=referral&utm_campaign=email',
    desc: 'Google\'s email service with 15GB storage.',
    category: 'Standard'
  }
];

const grouped = emailServices.reduce((acc, svc) => {
  if (!acc[svc.category]) acc[svc.category] = [];
  acc[svc.category].push(svc);
  return acc;
}, {} as Record<string, typeof emailServices>);

export const metadata = {
  title: 'Free Email Services | Zion Tech Group',
  description: 'Secure and reliable free email providers for personal and business use.',
};

export default function FreeEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Email Services
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Zero-cost email providers for secure and reliable communication.
            Some links may be affiliate partnerships that support our work.
          </p>
        </div>
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, services]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <a
                    key={svc.name}
                    href={svc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {svc.desc}
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