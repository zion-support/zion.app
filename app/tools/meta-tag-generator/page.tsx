'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Globe, MessageSquare, Share2, Briefcase, RotateCcw, Sparkles } from 'lucide-react';

interface MetaTags {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  twitterSite: string;
  themeColor: string;
  author: string;
  keywords: string;
}

const DEFAULT_TAGS: MetaTags = {
  title: 'Zion — AI-Powered App Platform',
  description: 'Build, deploy, and scale AI-powered applications with Zion. The modern platform for intelligent software.',
  url: 'https://zion.app',
  image: 'https://zion.app/og-image.png',
  siteName: 'Zion',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '@zionapp',
  themeColor: '#3b82f6',
  author: 'Zion',
  keywords: 'AI, app platform, software, development',
};

const PRESETS = [
  { label: 'Landing Page', tags: { ...DEFAULT_TAGS } },
  {
    label: 'Blog Post', tags: {
      ...DEFAULT_TAGS, title: 'How AI Is Transforming Development', description: 'A deep dive into how artificial intelligence is changing the way we build software, from code generation to automated testing.',
      type: 'article', url: 'https://zion.app/blog/ai-transforming-development', image: 'https://zion.app/blog/ai-dev-hero.jpg',
    },
  },
  {
    label: 'Product Page', tags: {
      ...DEFAULT_TAGS, title: 'Zion AI Assistant — Your Coding Copilot', description: 'Meet Zion AI Assistant: intelligent code completion, refactoring, and documentation generation powered by advanced language models.',
      type: 'product', url: 'https://zion.app/products/ai-assistant', image: 'https://zion.app/products/ai-assistant-hero.png',
    },
  },
];

function generateMetaTags(tags: MetaTags): string {
  const lines: string[] = ['<!-- Primary Meta Tags -->'];
  lines.push(`<title>${escapeHtml(tags.title)}</title>`);
  lines.push(`<meta name="title" content="${escapeHtml(tags.title)}" />`);
  lines.push(`<meta name="description" content="${escapeHtml(tags.description)}" />`);
  if (tags.keywords) lines.push(`<meta name="keywords" content="${escapeHtml(tags.keywords)}" />`);
  if (tags.author) lines.push(`<meta name="author" content="${escapeHtml(tags.author)}" />`);
  if (tags.themeColor) lines.push(`<meta name="theme-color" content="${tags.themeColor}" />`);

  lines.push('\n<!-- Open Graph / Facebook -->');
  lines.push(`<meta property="og:type" content="${tags.type}" />`);
  lines.push(`<meta property="og:url" content="${escapeHtml(tags.url)}" />`);
  lines.push(`<meta property="og:title" content="${escapeHtml(tags.title)}" />`);
  lines.push(`<meta property="og:description" content="${escapeHtml(tags.description)}" />`);
  lines.push(`<meta property="og:image" content="${escapeHtml(tags.image)}" />`);
  if (tags.siteName) lines.push(`<meta property="og:site_name" content="${escapeHtml(tags.siteName)}" />`);
  if (tags.locale) lines.push(`<meta property="og:locale" content="${tags.locale}" />`);

  lines.push('\n<!-- Twitter / X -->');
  lines.push(`<meta property="twitter:card" content="${tags.twitterCard}" />`);
  lines.push(`<meta property="twitter:url" content="${escapeHtml(tags.url)}" />`);
  lines.push(`<meta property="twitter:title" content="${escapeHtml(tags.title)}" />`);
  lines.push(`<meta property="twitter:description" content="${escapeHtml(tags.description)}" />`);
  lines.push(`<meta property="twitter:image" content="${escapeHtml(tags.image)}" />`);
  if (tags.twitterSite) lines.push(`<meta property="twitter:site" content="${escapeHtml(tags.twitterSite)}" />`);

  return lines.join('\n');
}

function generateJsonLd(tags: MetaTags): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': tags.type === 'article' ? 'Article' : 'WebPage',
    headline: tags.title,
    description: tags.description,
    url: tags.url,
    image: tags.image,
  };
  if (tags.author) schema.author = { '@type': 'Person', name: tags.author };
  if (tags.siteName) schema.publisher = { '@type': 'Organization', name: tags.siteName };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function analyzeTags(tags: MetaTags): { score: number; issues: string[]; good: string[] } {
  const issues: string[] = [];
  const good: string[] = [];

  if (!tags.title) issues.push('Missing title tag');
  else if (tags.title.length > 60) issues.push(`Title too long (${tags.title.length} chars, recommended ≤60)`);
  else good.push('Title length is optimal');

  if (!tags.description) issues.push('Missing description');
  else if (tags.description.length > 160) issues.push(`Description too long (${tags.description.length} chars, recommended ≤160)`);
  else if (tags.description.length < 50) issues.push('Description is too short (aim for 50-160 chars)');
  else good.push('Description length is optimal');

  if (!tags.url) issues.push('Missing URL');
  else good.push('URL is set');

  if (!tags.image) issues.push('Missing OG image — social shares will look plain');
  else good.push('OG image is set');

  if (!tags.title || !tags.description || !tags.image || !tags.url) {
    issues.push('Missing required OG tags');
  } else {
    good.push('All required OG tags present');
  }

  const score = Math.max(0, Math.round(100 - issues.length * 15));
  return { score, issues, good };
}

export default function MetaTagGenerator() {
  const [tags, setTags] = useState<MetaTags>(DEFAULT_TAGS);
  const [copied, setCopied] = useState<string | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState<'twitter' | 'facebook' | 'linkedin'>('twitter');

  const update = (key: keyof MetaTags, value: string) => setTags((prev) => ({ ...prev, [key]: value }));

  const metaOutput = useMemo(() => generateMetaTags(tags), [tags]);
  const jsonLdOutput = useMemo(() => generateJsonLd(tags), [tags]);
  const analysis = useMemo(() => analyzeTags(tags), [tags]);

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (preset: typeof PRESETS[number]) => setTags({ ...preset.tags });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Meta Tag Generator</h1>
            <p className="mt-2 text-slate-600">Generate Open Graph, Twitter Card, and SEO meta tags with live preview</p>
          </div>
        </motion.div>

        {/* Presets */}
        <div className="mb-6 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <Sparkles className="mr-1 inline h-3 w-3" /> {p.label}
            </button>
          ))}
          <button
            onClick={() => setTags(DEFAULT_TAGS)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="mr-1 inline h-3 w-3" /> Reset
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">Basic Meta Tags</h3>
              <div className="space-y-3">
                {([
                  ['title', 'Title', 'text', 'Page title (≤60 chars)'],
                  ['description', 'Description', 'textarea', 'Page description (≤160 chars)'],
                  ['url', 'URL', 'url', 'Canonical URL'],
                  ['image', 'Image URL', 'url', 'OG image URL (1200×630 recommended)'],
                  ['siteName', 'Site Name', 'text', 'Your site name'],
                  ['keywords', 'Keywords', 'text', 'Comma-separated keywords'],
                  ['author', 'Author', 'text', 'Content author'],
                  ['themeColor', 'Theme Color', 'color', 'Browser theme color'],
                ] as const).map(([key, label, type, placeholder]) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        value={tags[key]}
                        onChange={(e) => update(key, e.target.value)}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                      />
                    ) : type === 'color' ? (
                      <div className="flex items-center gap-2">
                        <input type="color" value={tags[key]} onChange={(e) => update(key, e.target.value)} className="h-8 w-10 cursor-pointer rounded border-0" />
                        <input type="text" value={tags[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                      </div>
                    ) : (
                      <input type={type} value={tags[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    )}
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
                  <select value={tags.type} onChange={(e) => update('type', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                    {['website', 'article', 'product', 'profile', 'video', 'music'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Twitter Card</label>
                  <select value={tags.twitterCard} onChange={(e) => update('twitterCard', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                    {['summary_large_image', 'summary', 'app', 'player'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SEO Score */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">SEO Score</h3>
                <div className={`text-2xl font-bold ${analysis.score >= 80 ? 'text-emerald-600' : analysis.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {analysis.score}/100
                </div>
              </div>
              <div className="mb-3 h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${analysis.score >= 80 ? 'bg-emerald-500' : analysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
              {analysis.issues.length > 0 && (
                <div className="mb-2 space-y-1">
                  {analysis.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm text-red-600">
                      <span>⚠️</span> {issue}
                    </div>
                  ))}
                </div>
              )}
              {analysis.good.length > 0 && (
                <div className="space-y-1">
                  {analysis.good.map((g, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm text-emerald-600">
                      <span>✅</span> {g}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview + Output */}
          <div className="space-y-4">
            {/* Social Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-slate-700">Social Preview</h3>
                <div className="flex gap-1 ml-auto">
                  {[
                    { id: 'twitter' as const, icon: MessageSquare, label: 'X' },
                    { id: 'facebook' as const, icon: Share2, label: 'Facebook' },
                    { id: 'linkedin' as const, icon: Briefcase, label: 'LinkedIn' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setPreviewPlatform(id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        previewPlatform === id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="mr-1 inline h-3 w-3" />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="aspect-[1.91/1] w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  {tags.image ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-500">
                      <div className="text-center text-white">
                        <div className="text-lg font-bold">{tags.siteName || 'Preview'}</div>
                        <div className="text-xs opacity-75 mt-1">OG Image</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">No image set</span>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                    {new URL(tags.url || 'https://example.com').hostname}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">{tags.title || 'Untitled'}</div>
                  <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{tags.description || 'No description'}</div>
                </div>
              </div>
            </div>

            {/* Meta Tags Output */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">HTML Meta Tags</h3>
                <button onClick={() => copy(metaOutput, 'meta')} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                  {copied === 'meta' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy All
                </button>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-400 whitespace-pre-wrap">{metaOutput}</pre>
            </div>

            {/* JSON-LD Output */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">JSON-LD Structured Data</h3>
                <button onClick={() => copy(jsonLdOutput, 'jsonld')} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                  {copied === 'jsonld' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </button>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-400 whitespace-pre-wrap">{jsonLdOutput}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
