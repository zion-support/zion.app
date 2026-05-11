'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Pipette } from 'lucide-react';

interface ColorValues {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr:
        h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
        break;
      case gg:
        h = ((bb - rr) / d + 2) / 6;
        break;
      case bb:
        h = ((rr - gg) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hh = h / 360;
  const ss = s / 100;
  const ll = l / 100;
  let r: number;
  let g: number;
  let b: number;
  if (ss === 0) {
    r = g = b = ll;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

type FormatKey = 'hex' | 'rgb' | 'hsl' | 'cmyk';

export default function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [copied, setCopied] = useState<FormatKey | null>(null);
  const [error, setError] = useState('');

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : { c: 0, m: 0, y: 0, k: 0 };

  const updateFromHex = useCallback((value: string) => {
    let v = value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[a-f\d]{6}$/i.test(v)) {
      setHex(v.toLowerCase());
      setError('');
    } else if (/^#[a-f\d]{3}$/i.test(v)) {
      const expanded = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
      setHex(expanded.toLowerCase());
      setError('');
    } else {
      setError('Invalid HEX color');
    }
  }, []);

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    if ([r, g, b].some((v) => v < 0 || v > 255 || isNaN(v))) {
      setError('RGB values must be 0-255');
      return;
    }
    setHex(rgbToHex(r, g, b).toLowerCase());
    setError('');
  }, []);

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
      setError('HSL values: H 0-360, S/L 0-100');
      return;
    }
    const { r, g, b } = hslToRgb(h, s, l);
    setHex(rgbToHex(r, g, b).toLowerCase());
    setError('');
  }, []);

  const copyValue = useCallback((key: FormatKey) => {
    const values: Record<FormatKey, string> = {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    };
    navigator.clipboard.writeText(values[key]);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }, [hex, rgb, hsl, cmyk]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const formats: { key: FormatKey; label: string; value: string }[] = [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0})` },
    { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Color Converter
          </h1>
          <p className="text-gray-400 text-lg">
            Convert colors between HEX, RGB, HSL, and CMYK with live preview
          </p>
        </motion.div>

        {/* Color Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div
            className="w-full h-40 rounded-2xl border border-gray-700/50 flex items-center justify-center text-2xl font-mono font-bold shadow-2xl transition-colors duration-200"
            style={{ backgroundColor: hex, color: mounted ? getContrastColor(hex) : '#fff' }}
          >
            {hex.toUpperCase()}
          </div>
        </motion.div>

        {/* HEX Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">Pick a Color</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-14 h-12 rounded-lg cursor-pointer border-2 border-gray-600 bg-transparent"
            />
            <input
              type="text"
              value={hex.toUpperCase()}
              onChange={(e) => updateFromHex(e.target.value)}
              placeholder="#6366F1"
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => { setHex('#6366f1'); setError(''); }}
              className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </motion.div>

        {/* Format Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {formats.map((fmt, i) => (
            <motion.div
              key={fmt.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{fmt.label}</span>
                <button
                  onClick={() => copyValue(fmt.key)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {copied === fmt.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {fmt.key === 'hex' && (
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500 text-sm">#</span>
                  <input
                    type="text"
                    value={hex.replace('#', '').toUpperCase()}
                    onChange={(e) => updateFromHex('#' + e.target.value)}
                    className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                    maxLength={6}
                  />
                </div>
              )}

              {fmt.key === 'rgb' && rgb && (
                <div className="flex gap-2">
                  {[
                    { label: 'R', value: rgb.r },
                    { label: 'G', value: rgb.g },
                    { label: 'B', value: rgb.b },
                  ].map((ch) => (
                    <div key={ch.label} className="flex-1">
                      <span className="text-xs text-gray-500">{ch.label}</span>
                      <input
                        type="number"
                        min={0}
                        max={255}
                        value={ch.value}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 0;
                          const vals = { r: rgb.r, g: rgb.g, b: rgb.b, [ch.label.toLowerCase()]: v };
                          updateFromRgb(vals.r, vals.g, vals.b);
                        }}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {fmt.key === 'hsl' && (
                <div className="flex gap-2">
                  {[
                    { label: 'H', value: hsl.h, max: 360 },
                    { label: 'S', value: hsl.s, max: 100 },
                    { label: 'L', value: hsl.l, max: 100 },
                  ].map((ch) => (
                    <div key={ch.label} className="flex-1">
                      <span className="text-xs text-gray-500">{ch.label}{ch.label !== 'H' ? '%' : '°'}</span>
                      <input
                        type="number"
                        min={0}
                        max={ch.max}
                        value={ch.value}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 0;
                          const vals = { h: hsl.h, s: hsl.s, l: hsl.l, [ch.label.toLowerCase()]: v };
                          updateFromHsl(vals.h, vals.s, vals.l);
                        }}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {fmt.key === 'cmyk' && (
                <div className="flex gap-2">
                  {[
                    { label: 'C', value: cmyk.c },
                    { label: 'M', value: cmyk.m },
                    { label: 'Y', value: cmyk.y },
                    { label: 'K', value: cmyk.k },
                  ].map((ch) => (
                    <div key={ch.label} className="flex-1">
                      <span className="text-xs text-gray-500">{ch.label}%</span>
                      <div className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm">
                        {ch.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-gray-500 text-xs mt-2 font-mono">{fmt.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Harmony Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Pipette className="w-4 h-4 text-purple-400" />
            Color Harmonies
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Complementary', offsets: [0, 180] },
              { name: 'Triadic', offsets: [0, 120, 240] },
              { name: 'Analogous', offsets: [-30, 0, 30] },
              { name: 'Split Complementary', offsets: [0, 150, 210] },
            ].map((harmony) => (
              <div key={harmony.name}>
                <span className="text-xs text-gray-500 mb-1.5 block">{harmony.name}</span>
                <div className="flex gap-1">
                  {harmony.offsets.map((offset, i) => {
                    const newHue = (hsl.h + offset + 360) % 360;
                    const { r, g, b } = hslToRgb(newHue, hsl.s, hsl.l);
                    const c = rgbToHex(r, g, b);
                    return (
                      <button
                        key={i}
                        onClick={() => setHex(c)}
                        className="flex-1 h-10 rounded-lg border border-gray-700/50 hover:scale-105 transition-transform cursor-pointer"
                        style={{ backgroundColor: c }}
                        title={c.toUpperCase()}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CSS Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-3">CSS Output</h3>
          <pre className="bg-gray-900/50 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
{`.element {
  color: ${hex.toUpperCase()};
  color: rgb(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0});
  color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);
}`}
          </pre>
          <button
            onClick={() => {
              const css = `.element {\n  color: ${hex.toUpperCase()};\n  color: rgb(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0});\n  color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);\n}`;
              navigator.clipboard.writeText(css);
              setCopied('hex');
              setTimeout(() => setCopied(null), 1500);
            }}
            className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {copied === 'hex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === 'hex' ? 'Copied!' : 'Copy CSS'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
