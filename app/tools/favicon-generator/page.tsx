'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type FaviconMode = 'text' | 'emoji' | 'image';

interface SizeOption {
  size: number;
  label: string;
  use: string;
}

const SIZES: SizeOption[] = [
  { size: 16, label: '16×16', use: 'Favicon (classic)' },
  { size: 32, label: '32×32', use: 'Favicon (standard)' },
  { size: 48, label: '48×48', use: 'Favicon (Windows)' },
  { size: 64, label: '64×64', use: 'Desktop shortcut' },
  { size: 128, label: '128×128', use: 'Chrome Web Store' },
  { size: 180, label: '180×180', use: 'Apple Touch Icon' },
  { size: 192, label: '192×192', use: 'Android Chrome' },
  { size: 512, label: '512×512', use: 'PWA / Splash' },
];

const PRESET_BG_COLORS = [
  '#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981',
  '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

const PRESET_TEXT_COLORS = [
  '#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981',
  '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

const FONTS = [
  'Arial, sans-serif',
  'Georgia, serif',
  '"Courier New", monospace',
  '"Times New Roman", serif',
  'Verdana, sans-serif',
  'Impact, sans-serif',
  '"Comic Sans MS", cursive',
];

export default function FaviconGeneratorPage() {
  const [mode, setMode] = useState<FaviconMode>('text');
  const [text, setText] = useState('Z');
  const [emoji, setEmoji] = useState('🚀');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [font, setFont] = useState(FONTS[0]);
  const [borderRadius, setBorderRadius] = useState(0);
  const [bold, setBold] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawFavicon = useCallback((size: number): string | null => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (borderRadius > 0) {
      const r = (size * borderRadius) / 100;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.clip();
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }

    if (mode === 'image' && uploadedImage) {
      const img = new window.Image();
      img.onload = () => {
        const margin = size * 0.05;
        ctx.drawImage(img, margin, margin, size - margin * 2, size - margin * 2);
      };
      img.onerror = () => {};
      img.src = uploadedImage;
    }

    ctx.fillStyle = textColor;
    ctx.font = `${bold ? 'bold' : 'normal'} ${Math.floor(size * 0.55)}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const content = mode === 'emoji' ? emoji : text;
    ctx.fillText(content, size / 2, size / 2 + size * 0.02);

    return canvas.toDataURL('image/png');
  }, [mode, uploadedImage, bgColor, textColor, font, borderRadius, bold]);

  useEffect(() => {
    if (!mounted) return;
    if (mode === 'image' && uploadedImage) {
      setPreviewUrl(null);
      return;
    }
    const url = drawFavicon(256);
    setPreviewUrl(url);
  }, [mounted, mode, uploadedImage, text, emoji, bgColor, textColor, font, borderRadius, bold]);

  const downloadFavicon = async (size: number) => {
    const dataUrl = drawFavicon(size);
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = async () => {
    for (const s of SIZES) {
      const dataUrl = drawFavicon(s.size);
      if (!dataUrl) continue;
      const link = document.createElement('a');
      link.download = `favicon-${s.size}x${s.size}.png`;
      link.href = dataUrl;
      link.click();
      await new Promise(r => setTimeout(r, 200));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`;

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Favicon Generator</h1>
          <p className="mt-2 text-slate-600">Create favicons from text, emoji, or images — all sizes included</p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Create from</label>
          <div className="flex gap-3 mb-4">
            {([
              { key: 'text' as FaviconMode, label: 'Text' },
              { key: 'emoji' as FaviconMode, label: 'Emoji' },
              { key: 'image' as FaviconMode, label: 'Image' },
            ]).map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  mode === m.key
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'text' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Text (1-3 characters)</label>
              <input
                type="text"
                value={text}
                maxLength={3}
                onChange={e => setText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-2xl font-bold text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}

          {mode === 'emoji' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-4xl text-center focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {['🚀', '⚡', '🔥', '💎', '🎯', '🌟', '🧪', '🛠️', '📊', '🔐'].map(e => (
                  <button key={e} onClick={() => setEmoji(e)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-lg hover:bg-violet-50 transition">
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'image' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700"
              />
              {uploadedImage && (
                <img src={uploadedImage} alt="Uploaded" className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-200" />
              )}
            </div>
          )}

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className="h-9 w-14 rounded-lg cursor-pointer border border-slate-200"
              />
              {PRESET_BG_COLORS.map(c => (
                <button key={c} onClick={() => setBgColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition ${bgColor === c ? 'border-violet-500 scale-110' : 'border-slate-200'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                className="h-9 w-14 rounded-lg cursor-pointer border border-slate-200"
              />
              {PRESET_TEXT_COLORS.map(c => (
                <button key={c} onClick={() => setTextColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition ${textColor === c ? 'border-violet-500 scale-110' : 'border-slate-200'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Font</label>
              <select
                value={font}
                onChange={e => setFont(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {FONTS.map(f => (
                  <option key={f} value={f}>{f.split(',')[0]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Border Radius: {borderRadius}%</label>
              <input
                type="range"
                min={0}
                max={50}
                value={borderRadius}
                onChange={e => setBorderRadius(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={e => setBold(e.target.checked)}
                  className="h-4 w-4 rounded accent-violet-600"
                />
                <span className="text-sm font-medium text-slate-700">Bold text</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h2>
          <div className="flex items-center justify-center gap-6 py-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjFmMWYxIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMWYxZjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] rounded-xl p-6">
            {mode === 'image' && uploadedImage ? (
              [64, 48, 32, 16].map(s => (
                <div key={s} className="text-center">
                  <img src={uploadedImage} alt="preview" style={{ width: s, height: s }} className="rounded-lg border border-slate-300" />
                  <p className="mt-1 text-xs text-slate-500">{s}px</p>
                </div>
              ))
            ) : previewUrl ? (
              [128, 64, 48, 32, 16].map(s => (
                <div key={s} className="text-center">
                  <img src={previewUrl} alt="preview" style={{ width: s, height: s }} className="rounded-lg border border-slate-300" />
                  <p className="mt-1 text-xs text-slate-500">{s}px</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Enter text, emoji, or upload an image</p>
            )}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Download Sizes</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {SIZES.map(s => (
              <button
                key={s.size}
                onClick={() => downloadFavicon(s.size)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-violet-300 hover:bg-violet-50 transition group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-mono text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-600">
                  {s.size}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500">{s.use}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">HTML Snippet</h2>
            <button onClick={copyHtml}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition">
              {copiedHtml ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="rounded-xl bg-slate-900 p-4 text-sm text-slate-100 overflow-x-auto"><code>{htmlSnippet}</code></pre>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}