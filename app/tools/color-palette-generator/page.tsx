'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1e293b' : '#ffffff';
}

interface PaletteScheme {
  name: string;
  description: string;
  generate: (h: number, s: number, l: number) => string[];
}

const schemes: PaletteScheme[] = [
  {
    name: 'Complementary',
    description: 'Opposite colors on the color wheel',
    generate: (h, s, l) => [
      hslToHex(h, s, l),
      hslToHex(h, s, Math.min(95, l + 20)),
      hslToHex(h, s, Math.max(10, l - 20)),
      hslToHex(h + 180, s, l),
      hslToHex(h + 180, s, Math.min(95, l + 20)),
    ],
  },
  {
    name: 'Analogous',
    description: 'Adjacent colors for harmony',
    generate: (h, s, l) => [
      hslToHex(h - 30, s, l),
      hslToHex(h - 15, s, l),
      hslToHex(h, s, l),
      hslToHex(h + 15, s, l),
      hslToHex(h + 30, s, l),
    ],
  },
  {
    name: 'Triadic',
    description: 'Three evenly spaced colors',
    generate: (h, s, l) => [
      hslToHex(h, s, l),
      hslToHex(h, s, Math.max(15, l - 15)),
      hslToHex(h + 120, s, l),
      hslToHex(h + 240, s, l),
      hslToHex(h + 240, s, Math.min(90, l + 15)),
    ],
  },
  {
    name: 'Split Complementary',
    description: 'Base + two adjacent complements',
    generate: (h, s, l) => [
      hslToHex(h, s, l),
      hslToHex(h, s, Math.min(95, l + 25)),
      hslToHex(h + 150, s, l),
      hslToHex(h + 210, s, l),
      hslToHex(h + 180, s, Math.max(15, l - 20)),
    ],
  },
  {
    name: 'Monochromatic',
    description: 'Single hue with varied lightness',
    generate: (h, s, l) => [
      hslToHex(h, s, 15),
      hslToHex(h, s, 30),
      hslToHex(h, s, 50),
      hslToHex(h, s, 70),
      hslToHex(h, s, 90),
    ],
  },
];

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [activeScheme, setActiveScheme] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const [h, s, l] = useMemo(() => hexToHsl(baseColor), [baseColor]);

  const palette = useMemo(() => schemes[activeScheme].generate(h, s, l), [h, s, l, activeScheme]);

  const copyColor = (color: string, idx: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    const text = palette.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const downloadCss = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}\n`;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const data = {
      baseColor,
      scheme: schemes[activeScheme].name,
      colors: palette.map((hex, i) => {
        const [hh, ss, ll] = hexToHsl(hex);
        return { hex, hsl: `hsl(${hh}, ${ss}%, ${ll}%)`, index: i + 1 };
      }),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const randomColor = () => {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    setBaseColor(`#${r}${g}${b}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/tools" className="text-sm text-blue-600 hover:underline">← Back to Tools</a>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎨</span>
            <h1 className="text-3xl font-bold text-slate-900">Color Palette Generator</h1>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Generate beautiful, harmonious color palettes from any base color. Choose from 5 color theory schemes and export as CSS or JSON.
          </p>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Base Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-16 rounded-xl cursor-pointer border-2 border-slate-200"
                />
                <div>
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBaseColor(v);
                    }}
                    className="font-mono text-lg text-slate-800 border border-slate-300 rounded-lg px-3 py-2 w-32 uppercase"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    HSL({h}°, {s}%, {l}%)
                  </p>
                </div>
                <button
                  onClick={randomColor}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  🎲 Random
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">Color Scheme</label>
              <div className="flex flex-wrap gap-2">
                {schemes.map((scheme, i) => (
                  <button
                    key={scheme.name}
                    onClick={() => setActiveScheme(i)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeScheme === i
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {scheme.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">{schemes[activeScheme].description}</p>
            </div>
          </div>
        </div>

        {/* Palette Display */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">{schemes[activeScheme].name} Palette</h2>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  copiedAll
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                {copiedAll ? '✓ Copied!' : 'Copy All'}
              </button>
              <button
                onClick={downloadCss}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition"
              >
                Export CSS
              </button>
              <button
                onClick={downloadJson}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Export JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 min-h-[240px]">
            {palette.map((color, i) => {
              const [hh, ss, ll] = hexToHsl(color);
              return (
                <button
                  key={`${color}-${i}`}
                  onClick={() => copyColor(color, i)}
                  className="relative group flex flex-col items-center justify-end pb-6 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: color }}
                >
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: getContrastColor(color) }}
                  >
                    {color.toUpperCase()}
                  </span>
                  <span
                    className="font-mono text-[10px] mt-1 opacity-70"
                    style={{ color: getContrastColor(color) }}
                  >
                    HSL({hh},{ss}%,{ll}%)
                  </span>
                  {copiedIdx === i && (
                    <span
                      className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20"
                      style={{ color: getContrastColor(color) }}
                    >
                      ✓ Copied
                    </span>
                  )}
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold opacity-50"
                    style={{ color: getContrastColor(color) }}
                  >
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessibility info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-4">Accessibility Check</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {palette.map((color, i) => {
              const contrastWhite = getContrastRatio(color, '#ffffff');
              const contrastBlack = getContrastRatio(color, '#000000');
              const wcagAA = Math.max(contrastWhite, contrastBlack) >= 4.5;
              const wcagAAA = Math.max(contrastWhite, contrastBlack) >= 7;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-slate-600">{color.toUpperCase()}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        wcagAAA ? 'bg-emerald-100 text-emerald-700' :
                        wcagAA ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {wcagAAA ? 'AAA' : wcagAA ? 'AA' : 'Fail'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        White: {contrastWhite.toFixed(1)}:1 · Black: {contrastBlack.toFixed(1)}:1
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const srgb = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
