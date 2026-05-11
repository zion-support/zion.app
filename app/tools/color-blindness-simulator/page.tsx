"use client";

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

type DeficiencyType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'normal';

interface DeficiencyInfo {
  label: string;
  description: string;
  prevalence: string;
  filter: string;
}

const deficiencies: Record<DeficiencyType, DeficiencyInfo> = {
  normal: {
    label: 'Normal Vision',
    description: 'Full color perception — no simulation applied.',
    prevalence: '~92% of men, ~99.5% of women',
    filter: 'none',
  },
  protanopia: {
    label: 'Protanopia (Red-Blind)',
    description: 'Complete absence of red cone receptors. Reds appear dark/black; greens and yellows shift.',
    prevalence: '~1.3% of men, ~0.02% of women',
    filter: 'url(#protanopia)',
  },
  deuteranopia: {
    label: 'Deuteranopia (Green-Blind)',
    description: 'Complete absence of green cone receptors. Greens and reds appear similar; most common deficiency.',
    prevalence: '~1.2% of men, ~0.01% of women',
    filter: 'url(#deuteranopia)',
  },
  tritanopia: {
    label: 'Tritanopia (Blue-Blind)',
    description: 'Complete absence of blue cone receptors. Blues appear greenish; yellows appear pink.',
    prevalence: '~0.003% of men and women',
    filter: 'url(#tritanopia)',
  },
  achromatopsia: {
    label: 'Achromatopsia (Monochrome)',
    description: 'Complete color blindness — only sees in grayscale. Very rare.',
    prevalence: '~0.003% of people',
    filter: 'url(#achromatopsia)',
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function simulateDeficiency(hex: string, type: DeficiencyType): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  let nr: number, ng: number, nb: number;

  switch (type) {
    case 'protanopia':
      nr = 0.567 * R + 0.433 * G + 0.0 * B;
      ng = 0.558 * R + 0.442 * G + 0.0 * B;
      nb = 0.0 * R + 0.242 * G + 0.758 * B;
      break;
    case 'deuteranopia':
      nr = 0.625 * R + 0.375 * G + 0.0 * B;
      ng = 0.7 * R + 0.3 * G + 0.0 * B;
      nb = 0.0 * R + 0.3 * G + 0.7 * B;
      break;
    case 'tritanopia':
      nr = 0.95 * R + 0.05 * G + 0.0 * B;
      ng = 0.0 * R + 0.433 * G + 0.567 * B;
      nb = 0.0 * R + 0.475 * G + 0.525 * B;
      break;
    case 'achromatopsia': {
      const gray = 0.299 * R + 0.587 * G + 0.114 * B;
      nr = ng = nb = gray;
      break;
    }
    default:
      return hex;
  }

  return rgbToHex(nr * 255, ng * 255, nb * 255);
}

function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const defaultPalette = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#e91e63', '#00bcd4'];

export default function ColorBlindnessSimulator() {
  const [inputColor, setInputColor] = useState('#e74c3c');
  const [palette, setPalette] = useState<string[]>(defaultPalette);
  const [activeDeficiency, setActiveDeficiency] = useState<DeficiencyType>('normal');
  const [customColor, setCustomColor] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToPalette = useCallback(() => {
    const hex = customColor.startsWith('#') ? customColor : `#${customColor}`;
    if (hexToRgb(hex) && !palette.includes(hex)) {
      setPalette((prev) => [...prev, hex]);
      setCustomColor('');
    }
  }, [customColor, palette]);

  const removeFromPalette = useCallback((idx: number) => {
    setPalette((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const copyColor = useCallback((color: string, idx: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const resetPalette = useCallback(() => {
    setPalette(defaultPalette);
  }, []);

  const contrast = contrastRatio(inputColor, simulateDeficiency(inputColor, activeDeficiency));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* SVG Filters for simulation */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-flex items-center gap-1">
            ← Back to Home
          </a>
          <h1 className="text-3xl font-bold mt-2 mb-2">Color Blindness Simulator</h1>
          <p className="text-gray-400 max-w-2xl">
            Preview how your designs look to people with color vision deficiencies. Simulate protanopia, deuteranopia,
            tritanopia, and achromatopsia. Check WCAG contrast ratios to ensure accessibility.
          </p>
        </div>

        {/* Deficiency Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {(Object.keys(deficiencies) as DeficiencyType[]).map((type) => {
            const info = deficiencies[type];
            const isActive = activeDeficiency === type;
            return (
              <button
                key={type}
                onClick={() => setActiveDeficiency(type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">{info.label}</div>
                <div className="text-xs text-gray-500 mt-1">{info.prevalence}</div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Single Color Preview */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Single Color Preview</h2>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="color"
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-600 bg-transparent"
                />
                <div>
                  <div className="font-mono text-lg">{inputColor.toUpperCase()}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Simulated: <span className="font-mono">{simulateDeficiency(inputColor, activeDeficiency).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Original</div>
                  <div className="h-24 rounded-lg" style={{ backgroundColor: inputColor }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">{deficiencies[activeDeficiency].label}</div>
                  <div className="h-24 rounded-lg" style={{ backgroundColor: simulateDeficiency(inputColor, activeDeficiency) }} />
                </div>
              </div>

              {/* Contrast info */}
              {activeDeficiency !== 'normal' && (
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400">
                    Contrast shift: <span className={`font-semibold ${contrast >= 4.5 ? 'text-green-400' : contrast >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {contrast.toFixed(2)}:1
                    </span>
                    {contrast < 3 && <span className="text-red-400 ml-2">⚠ Fails WCAG AA</span>}
                    {contrast >= 3 && contrast < 4.5 && <span className="text-yellow-400 ml-2">⚠ Large text only</span>}
                    {contrast >= 4.5 && <span className="text-green-400 ml-2">✓ Passes WCAG AA</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-2">{deficiencies[activeDeficiency].label}</h3>
              <p className="text-sm text-gray-400 mb-3">{deficiencies[activeDeficiency].description}</p>
              <div className="text-xs text-gray-500">
                <strong>Prevalence:</strong> {deficiencies[activeDeficiency].prevalence}
              </div>
              {activeDeficiency !== 'normal' && (
                <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm text-cyan-300">
                  💡 <strong>Accessibility tip:</strong> Don&apos;t rely on color alone to convey information.
                  Use icons, patterns, text labels, or position to supplement color coding.
                </div>
              )}
            </div>
          </div>

          {/* Right: Palette Simulation */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Palette Simulation</h2>
                <button onClick={resetPalette} className="text-xs text-gray-500 hover:text-gray-300">
                  Reset palette
                </button>
              </div>

              {/* Add custom color */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#ff6600 or ff6600"
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm font-mono focus:outline-none focus:border-cyan-500"
                  onKeyDown={(e) => e.key === 'Enter' && addToPalette()}
                />
                <button
                  onClick={addToPalette}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Palette grid */}
              <div className="space-y-3">
                {palette.map((color, idx) => {
                  const simulated = simulateDeficiency(color, activeDeficiency);
                  return (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600 relative"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color, idx)}
                        title="Click to copy"
                      >
                        {copiedIdx === idx && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2 items-center">
                        <div className="text-xs font-mono text-gray-400">{color.toUpperCase()}</div>
                        {activeDeficiency !== 'normal' && (
                          <>
                            <div
                              className="w-full h-8 rounded border border-gray-600"
                              style={{ backgroundColor: simulated }}
                            />
                          </>
                        )}
                      </div>
                      {activeDeficiency !== 'normal' && (
                        <div className="text-xs font-mono text-gray-500 w-20 text-right">
                          {simulated.toUpperCase()}
                        </div>
                      )}
                      <button
                        onClick={() => removeFromPalette(idx)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Visual strip comparison */}
              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-500">Original palette</div>
                <div className="flex h-12 rounded-lg overflow-hidden">
                  {palette.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                {activeDeficiency !== 'normal' && (
                  <>
                    <div className="text-xs text-gray-500">{deficiencies[activeDeficiency].label}</div>
                    <div className="flex h-12 rounded-lg overflow-hidden">
                      {palette.map((color, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: simulateDeficiency(color, activeDeficiency) }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* All deficiencies at once */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-4">All Simulations at Once</h3>
              <div className="space-y-3">
                {(['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as DeficiencyType[]).map((type) => (
                  <div key={type}>
                    <div className="text-xs text-gray-500 mb-1">{deficiencies[type].label}</div>
                    <div className="flex h-8 rounded overflow-hidden">
                      {palette.map((color, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: simulateDeficiency(color, type) }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Color vision deficient', value: '~8% of men', detail: 'globally' },
            { label: 'Most common', value: 'Deuteranopia', detail: 'green-blindness' },
            { label: 'WCAG AA threshold', value: '4.5:1', detail: 'normal text' },
            { label: 'WCAG AA large text', value: '3:1', detail: '18pt+ or 14pt bold' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-800/30 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
