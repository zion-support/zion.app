import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Lab — Zion Tech Group',
  description: 'In-browser AI experiences and tools.',
};

export default function AILab() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">AI Lab</h1>
        <p className="text-slate-300 mb-8 max-w-3xl">
          Interactive in-browser AI tools, plus autonomous experiences for conversion, revenue, incidents,
          and knowledge workflows.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Autonomous RAG Knowledge Workspace', href: '/ai-lab/autonomous-rag-knowledge-workspace' },
            { title: 'Autonomous Media Prompt Studio', href: '/ai-lab/autonomous-media-prompt-studio' },
            { title: 'Autonomous Conversion Copilot', href: '/ai-lab/autonomous-conversion-copilot' },
            { title: 'Autonomous Revenue Forecast Studio', href: '/ai-lab/autonomous-revenue-forecast-studio' },
            { title: 'Autonomous Incident Commander', href: '/ai-lab/autonomous-incident-commander' },
            { title: 'Autonomous Agent Skill Orchestrator', href: '/ai-lab/autonomous-agent-skill-orchestrator' },
            { title: 'Autonomous Experiment Priority Engine', href: '/ai-lab/autonomous-experiment-priority-engine' },
          ].map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">{tool.title}</h2>
              <p className="mt-2 text-sm text-slate-600">Open tool →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
