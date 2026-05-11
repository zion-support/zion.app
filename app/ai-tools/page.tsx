import React from 'react';
import Link from 'next/link';
import { Server, ExternalLink } from 'lucide-react';

const aiTools = [
  {
    name: 'Hugging Face Inference API',
    href: 'https://huggingface.co/inference-api?ref=ziontech',
    desc: 'Free tier for deploying and using machine learning models.',
    category: 'AI Models'
  },
  {
    name: 'Google Vertex AI',
    href: 'https://cloud.google.com/vertex-ai?ref=ziontech',
    desc: 'Free credits and sandbox for experimenting with AI services.',
    category: 'AI Platforms'
  },
  {
    name: 'RunPod',
    href: 'https://runpod.io/?ref=ziontech',
    desc: 'Free GPU pods for running AI workloads.',
    category: 'Compute'
  },
  {
    name: 'Replicate',
    href: 'https://replicate.com/?ref=ziontech',
    desc: 'Free inference credits for testing models.',
    category: 'AI Models'
  },
  {
    name: 'Stability AI',
    href: 'https://api.stability.ai/?ref=ziontech',
    desc: 'Free generative image API tier.',
    category: 'Image Generation'
  },
  {
    name: 'ElevenLabs',
    href: 'https://elevenlabs.io/?ref=ziontech',
    desc: 'Free AI voice generation and cloning API tier.',
    category: 'Text-to-Speech'
  },
  {
    name: 'OpenAI Playground',
    href: 'https://beta.openai.com/playground?ref=ziontech',
    desc: 'Free access to GPT model with usage limits.',
    category: 'Chat AI'
  },
  {
    name: 'Cohere',
    href: 'https://cohere.com/api?ref=ziontech',
    desc: 'Free credits for language model APIs.',
    category: 'Chat AI'
  },
];

// Group by category
const grouped = aiTools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof aiTools>);

export const metadata = {
  title: 'Free AI Tools Directory | Zion Tech Group',
  description: 'Curated free AI tools with referral links. Every referral helps keep our open-source work alive.',
};

export default function AITechToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free AI Tools Directory
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Discover high-quality free AI services and platforms. Referral links support our continuous innovation.
          </p>
        </div>

        {/* Grouped AI Tools */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, tools]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {tool.desc}
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
          <h3 className="text-2xl font-bold text-white mb-4">Need Expert Guidance?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Book a free consultation to explore how AI can boost your projects.
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
