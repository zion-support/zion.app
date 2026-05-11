'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Box, Layers, Paintbrush } from 'lucide-react';

interface BoxModel {
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  content: { width: number; height: number };
}

const DEFAULT_MODEL: BoxModel = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  border: { top: 2, right: 2, bottom: 2, left: 2 },
  padding: { top: 16, right: 16, bottom: 16, left: 16 },
  content: { width: 200, height: 120 },
};

const PRESETS = [
  { label: 'Card', model: { margin: { top: 16, right: 16, bottom: 16, left: 16 }, border: { top: 1, right: 1, bottom: 1, left: 1 }, padding: { top: 24, right: 24, bottom: 24, left: 24 }, content: { width: 280, height: 160 } } },
  { label: 'Button', model: { margin: { top: 8, right: 8, bottom: 8, left: 8 }, border: { top: 2, right: 2, bottom: 2, left: 2 }, padding: { top: 12, right: 32, bottom: 12, left: 32 }, content: { width: 80, height: 20 } } },
  { label: 'Sidebar', model: { margin: { top: 0, right: 0, bottom: 0, left: 0 }, border: { top: 0, right: 1, bottom: 0, left: 0 }, padding: { top: 20, right: 20, bottom: 20, left: 20 }, content: { width: 250, height: 400 } } },
  { label: 'Hero', model: { margin: { top: 0, right: 0, bottom: 32, left: 0 }, border: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: 80, right: 60, bottom: 80, left: 60 }, content: { width: 600, height: 200 } } },
];

type Side = 'top' | 'right' | 'bottom' | 'left';
type Layer = 'margin' | 'border' | 'padding';

function generateCSS(model: BoxModel): string {
  const m = model.margin;
  const b = model.border;
  const p = model.padding;
  const c = model.content;

  const parts: string[] = [];

  if (c.width) parts.push(`width: ${c.width}px;`);
  if (c.height) parts.push(`height: ${c.height}px;`);

  const shorthand = (v: { top: number; right: number; bottom: number; left: number }) => {
    if (v.top === v.right && v.right === v.bottom && v.bottom === v.left) return `${v.top}px`;
    if (v.top === v.bottom && v.right === v.left) return `${v.top}px ${v.right}px`;
    if (v.right === v.left) return `${v.top}px ${v.right}px ${v.bottom}px`;
    return `${v.top}px ${v.right}px ${v.bottom}px ${v.left}px`;
  };

  parts.push(`margin: ${shorthand(m)};`);
  parts.push(`border: ${shorthand(b)} solid currentColor;`);
  parts.push(`padding: ${shorthand(p)};`);

  return parts.join('\n');
}

function generateTailwind(model: BoxModel): string {
  const pxToTw: Record<number, string> = {
    0: '0', 1: '[1px]', 2: '[2px]', 3: '[3px]', 4: '1', 5: '[5px]', 6: '1.5', 8: '2', 10: '2.5', 12: '3',
    14: '[14px]', 16: '4', 18: '[18px]', 20: '5', 24: '6', 28: '[28px]', 32: '8', 36: '9', 40: '10',
    44: '11', 48: '12', 52: '13', 56: '14', 60: '15', 64: '16', 72: '18', 80: '20', 96: '24',
  };

  const toTw = (v: number) => pxToTw[v] ?? `[${v}px]`;
  const allSame = (v: { top: number; right: number; bottom: number; left: number }) =>
    v.top === v.right && v.right === v.bottom && v.bottom === v.left;

  const classes: string[] = [];

  if (model.content.width) classes.push(`w-[${model.content.width}px]`);
  if (model.content.height) classes.push(`h-[${model.content.height}px]`);

  if (allSame(model.margin)) {
    classes.push(`m-${toTw(model.margin.top)}`);
  } else {
    if (model.margin.top) classes.push(`mt-${toTw(model.margin.top)}`);
    if (model.margin.right) classes.push(`mr-${toTw(model.margin.right)}`);
    if (model.margin.bottom) classes.push(`mb-${toTw(model.margin.bottom)}`);
    if (model.margin.left) classes.push(`ml-${toTw(model.margin.left)}`);
  }

  if (allSame(model.border)) {
    classes.push(`border-${toTw(model.border.top)}`);
  } else {
    if (model.border.top) classes.push(`border-t-${toTw(model.border.top)}`);
    if (model.border.right) classes.push(`border-r-${toTw(model.border.right)}`);
    if (model.border.bottom) classes.push(`border-b-${toTw(model.border.bottom)}`);
    if (model.border.left) classes.push(`border-l-${toTw(model.border.left)}`);
  }

  if (allSame(model.padding)) {
    classes.push(`p-${toTw(model.padding.top)}`);
  } else {
    if (model.padding.top) classes.push(`pt-${toTw(model.padding.top)}`);
    if (model.padding.right) classes.push(`pr-${toTw(model.padding.right)}`);
    if (model.padding.bottom) classes.push(`pb-${toTw(model.padding.bottom)}`);
    if (model.padding.left) classes.push(`pl-${toTw(model.padding.left)}`);
  }

  classes.push('border-solid');

  return classes.join(' ');
}

export default function CSSBoxModelVisualizer() {
  const [model, setModel] = useState<BoxModel>(DEFAULT_MODEL);
  const [copied, setCopied] = useState<string | null>(null);
  const [linkAll, setLinkAll] = useState({ margin: true, border: true, padding: true });
  const [outputFormat, setOutputFormat] = useState<'css' | 'tailwind'>('css');

  const updateValue = useCallback((layer: Layer | 'content', side: Side | 'width' | 'height', value: number) => {
    setModel((prev) => {
      const next = structuredClone(prev);
      if (layer === 'content') {
        (next.content as Record<string, number>)[side] = Math.max(0, value);
        return next;
      }
      if (linkAll[layer]) {
        next[layer].top = Math.max(0, value);
        next[layer].right = Math.max(0, value);
        next[layer].bottom = Math.max(0, value);
        next[layer].left = Math.max(0, value);
      } else {
        next[layer][side as Side] = Math.max(0, value);
      }
      return next;
    });
  }, [linkAll]);

  const copyCSS = async (fmt: 'css' | 'tailwind') => {
    const code = fmt === 'css' ? generateCSS(model) : generateTailwind(model);
    await navigator.clipboard.writeText(code);
    setCopied(fmt);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setModel(DEFAULT_MODEL);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setModel(preset.model);
  };

  // Dimensions for visualization
  const scale = 0.35;
  const mT = model.margin.top * scale;
  const mR = model.margin.right * scale;
  const mB = model.margin.bottom * scale;
  const mL = model.margin.left * scale;
  const bT = model.border.top * scale;
  const bR = model.border.right * scale;
  const bB = model.border.bottom * scale;
  const bL = model.border.left * scale;
  const pT = model.padding.top * scale;
  const pR = model.padding.right * scale;
  const pB = model.padding.bottom * scale;
  const pL = model.padding.left * scale;
  const cW = model.content.width * scale;
  const cH = model.content.height * scale;

  const totalW = mL + bL + pL + cW + pR + bR + mR;
  const totalH = mT + bT + pT + cH + pB + bB + mB;

  const offsetX = mL;
  const offsetY = mT;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <Box className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">CSS Tool</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CSS Box Model Visualizer
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interactively explore and tweak the CSS box model — margin, border, padding, and content.
            Generate CSS or Tailwind code instantly.
          </p>
        </motion.div>

        {/* Presets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/60 hover:border-indigo-500/30 transition-all"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:text-gray-200 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 w-full">
              <svg
                viewBox={`0 0 ${totalW + 40} ${totalH + 40}`}
                className="w-full"
                style={{ maxHeight: '480px' }}
              >
                {/* Margin layer */}
                <rect
                  x={20}
                  y={20}
                  width={totalW}
                  height={totalH}
                  fill="#fbbf24"
                  fillOpacity={0.15}
                  stroke="#fbbf24"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  rx={4}
                />
                {/* Border layer */}
                <rect
                  x={offsetX + 20}
                  y={offsetY + 20}
                  width={bL + pL + cW + pR + bR}
                  height={bT + pT + cH + pB + bB}
                  fill="#a78bfa"
                  fillOpacity={0.2}
                  stroke="#a78bfa"
                  strokeWidth={1}
                  rx={3}
                />
                {/* Padding layer */}
                <rect
                  x={offsetX + bL + 20}
                  y={offsetY + bT + 20}
                  width={pL + cW + pR}
                  height={pT + cH + pB}
                  fill="#34d399"
                  fillOpacity={0.15}
                  stroke="#34d399"
                  strokeWidth={1}
                  rx={2}
                />
                {/* Content */}
                <rect
                  x={offsetX + bL + pL + 20}
                  y={offsetY + bT + pT + 20}
                  width={cW}
                  height={cH}
                  fill="#60a5fa"
                  fillOpacity={0.2}
                  stroke="#60a5fa"
                  strokeWidth={1}
                  rx={2}
                />

                {/* Labels */}
                <text x={20 + totalW / 2} y={14} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">
                  margin: {model.margin.top}px
                </text>
                <text x={offsetX + 20 + (bL + pL + cW + pR + bR) / 2} y={offsetY + 16} textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="500">
                  border: {model.border.top}px
                </text>
                <text x={offsetX + bL + 20 + (pL + cW + pR) / 2} y={offsetY + bT + 16} textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="500">
                  padding: {model.padding.top}px
                </text>
                <text x={offsetX + bL + pL + 20 + cW / 2} y={offsetY + bT + pT + 20 + cH / 2 + 4} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="600">
                  {model.content.width} × {model.content.height}
                </text>

                {/* Side labels */}
                <text x={8} y={20 + totalH / 2} textAnchor="middle" fill="#fbbf24" fontSize="7" transform={`rotate(-90, 8, ${20 + totalH / 2})`}>
                  {model.margin.left}px
                </text>
                <text x={totalW + 32} y={20 + totalH / 2} textAnchor="middle" fill="#fbbf24" fontSize="7" transform={`rotate(90, ${totalW + 32}, ${20 + totalH / 2})`}>
                  {model.margin.right}px
                </text>
                <text x={20 + totalW / 2} y={totalH + 34} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="500">
                  margin: {model.margin.bottom}px
                </text>
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {[
                  { color: '#fbbf24', label: 'Margin' },
                  { color: '#a78bfa', label: 'Border' },
                  { color: '#34d399', label: 'Padding' },
                  { color: '#60a5fa', label: 'Content' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color, opacity: 0.6 }} />
                    <span className="text-xs text-gray-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Content size */}
            <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Content
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(['width', 'height'] as const).map((side) => (
                  <div key={side}>
                    <label className="text-xs text-gray-500 capitalize block mb-1">{side}</label>
                    <input
                      type="number"
                      value={model.content[side]}
                      onChange={(e) => updateValue('content', side, parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-800/60 border border-gray-700/40 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Padding, Border, Margin controls */}
            {([
              { key: 'padding' as Layer, label: 'Padding', color: 'emerald' },
              { key: 'border' as Layer, label: 'Border', color: 'purple' },
              { key: 'margin' as Layer, label: 'Margin', color: 'yellow' },
            ]).map(({ key, label, color }) => (
              <div key={key} className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                color === 'emerald' ? 'text-emerald-400' : color === 'purple' ? 'text-purple-400' : 'text-yellow-400'
              }`}>
                    <Layers className="w-4 h-4" />
                    {label}
                  </h3>
                  <button
                    onClick={() => setLinkAll((p) => ({ ...p, [key]: !p[key] }))}
                    className={`text-xs px-2 py-0.5 rounded-md transition-all ${
                      linkAll[key]
                        ? `${key === 'padding' ? 'bg-emerald-500/20 text-emerald-300' : key === 'border' ? 'bg-purple-500/20 text-purple-300' : 'bg-yellow-500/20 text-yellow-300'}`
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {linkAll[key] ? '🔗 Linked' : '🔓 Independent'}
                  </button>
                </div>
                {linkAll[key] ? (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">All sides</label>
                    <input
                      type="number"
                      value={model[key].top}
                      onChange={(e) => updateValue(key, 'top', parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-800/60 border border-gray-700/40 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {(['top', 'right', 'bottom', 'left'] as Side[]).map((side) => (
                      <div key={side}>
                        <label className="text-xs text-gray-500 capitalize block mb-1">{side}</label>
                        <input
                          type="number"
                          value={model[key][side]}
                          onChange={(e) => updateValue(key, side, parseInt(e.target.value) || 0)}
                          className="w-full bg-gray-800/60 border border-gray-700/40 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setOutputFormat('css')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  outputFormat === 'css'
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'bg-gray-800/40 border border-gray-700/40 text-gray-400 hover:bg-gray-700/40'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                CSS
              </button>
              <button
                onClick={() => setOutputFormat('tailwind')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  outputFormat === 'tailwind'
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'bg-gray-800/40 border border-gray-700/40 text-gray-400 hover:bg-gray-700/40'
                }`}
              >
                🏷️ Tailwind
              </button>
            </div>
            <button
              onClick={() => copyCSS(outputFormat)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {copied === outputFormat ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 font-mono text-sm text-indigo-300/90 overflow-x-auto">
            {outputFormat === 'css' ? generateCSS(model) : generateTailwind(model)}
          </pre>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: '🎨', title: 'Visual + Code', desc: 'See changes update in real-time on the diagram and in generated code' },
            { icon: '🔗', title: 'Linked Values', desc: 'Toggle linked mode to set all sides at once or control each independently' },
            { icon: '🏷️', title: 'Tailwind Ready', desc: 'Get Tailwind CSS classes alongside standard CSS output' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
