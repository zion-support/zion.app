// app/portal/kb/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Knowledge Base — Client Portal',
  description: 'Documentation, guides, how-tos, and technical resources.',
};

export default function KnowledgeBasePage() {
  const articles = [
    { title: 'Getting Started Guide',       desc: 'Set up your account, configure integrations, and run your first AI workflow.', emoji: '\u{1F680}' },
    { title: 'API Reference',               desc: 'Complete API documentation with examples and authentication details.', emoji: '\u{1F4D6}' },
    { title: 'Best Practices',              desc: 'Recommended patterns for security, performance, and cost optimization.', emoji: '\u{2705}' },
    { title: 'Troubleshooting',             desc: 'Common issues, log analysis, and how to escalate to our support team.', emoji: '\u{1F527}' },
    { title: 'Release Notes',               desc: 'Latest feature releases, bug fixes, and deprecation notices.', emoji: '\u{1F4CB}' },
  ];

  return (
    <div className="container-page py-16">
      <Link href="/portal/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">&larr; Back to Client Portal</Link>
      <div className="glass-card max-w-2xl">
        <div className="text-5xl mb-4">&#x1F4DA;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Knowledge Base</h1>
        <p className="text-slate-400 mb-8">Documentation, guides, how-tos, and technical resources to get the most from your Zion Tech solutions.</p>
        <div className="space-y-3">
          {articles.map((art, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-purple-500/30 transition">
              <div className="text-2xl mb-2">{art.emoji}</div>
              <h3 className="text-white font-semibold mb-1">{art.title}</h3>
              <p className="text-slate-400 text-sm">{art.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-blue-950/30 rounded-xl border border-blue-500/20">
          <p className="text-blue-300 text-sm">Can&apos;t find what you need? <a href="/contact/" className="underline hover:text-blue-200">Submit a support ticket</a> or <a href="/contact/" className="underline hover:text-blue-200">ask our team</a> directly.</p>
        </div>
      </div>
    </div>
  );
}
