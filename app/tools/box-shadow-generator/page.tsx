'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Layers, Eye } from 'lucide-react';

interface ShadowLayer {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const PRESETS: { name: string; layers: Omit<ShadowLayer, 'id'>[] }[] = [
  {
    name: 'Subtle',
    layers: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false },
    ],
  },
  {
    name: 'Soft',
    layers: [
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 10, inset: false },
    ],
  },
  {
    name: 'Medium',
    layers: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false },
      { offsetX: 0, offsetY: 6, blur: 16, spread: -2, color: '#000000', opacity: 12, inset: false },
    ],
  },
  {
    name: 'Large',
    layers: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 12, blur: 24, spread: -4, color: '#000000', opacity: 10, inset: false },
    ],
  },
  {
    name: 'Glow',
    layers: [
      { offsetX: 0, offsetY: 0, blur: 12, spread: 4, color: '#3b82f6', opacity: 40, inset: false },
    ],
  },
  {
    name: 'Neumorphism',
    layers: [
      { offsetX: 6, offsetY: 6, blur: 12, spread: 0, color: '#bebebe', opacity: 60, inset: false },
      { offsetX: -6, offsetY: -6, blur: 12, spread: 0, color: '#ffffff', opacity: 80, inset: false },
    ],
  },
  {
    name: 'Inner Light',
    layers: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 10, inset: false },
      { offsetX: 0, offsetY: 0, blur: 0, spread: 1, color: '#ffffff', opacity: 10, inset: true },
    ],
  },
  {
    name: 'Elevated',
    layers: [
      { offsetX: 0, offsetY: 1, blur: 1, spread: 0, color: '#000000', opacity: 8, inset: false },
      { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: '#000000', opacity: 8, inset: false },
      { offsetX: 0, offsetY: 12, blur: 32, spread: 0, color: '#000000', opacity: 8, inset: false },
    ],
  },
];

let nextId = 1;

function createLayer(overrides?: Partial<ShadowLayer>): ShadowLayer {
  return {
    id: nextId++,
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    spread: 0,
    color: '#000000',
    opacity: 15,
    inset: false,
    ...overrides,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

export default function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    createLayer({ offsetY: 4, blur: 12, opacity: 15 }),
  ]);
  const [copied, setCopied] = useState(false);
  const [previewBg, setPreviewBg] = useState('#ffffff');
  const [previewRadius, setPreviewRadius] = useState(12);
  const [previewSize, setPreviewSize] = useState(200);

  const boxShadowCSS = useMemo(() => {
    return layers
      .map((l) => {
        const rgba = hexToRgba(l.color, l.opacity);
        const prefix = l.inset ? 'inset ' : '';
        return `${prefix}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${rgba}`;
      })
      .join(',\n    ');
  }, [layers]);

  const cssCode = `box-shadow: ${boxShadowCSS};`;

  const updateLayer = useCallback((id: number, updates: Partial<ShadowLayer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const removeLayer = useCallback((id: number) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addLayer = useCallback(() => {
    setLayers((prev) => [...prev, createLayer()]);
  }, []);

  const loadPreset = useCallback((preset: typeof PRESETS[number]) => {
    setLayers(preset.layers.map((l) => createLayer(l)));
  }, []);

  const resetAll = useCallback(() => {
    setLayers([createLayer()]);
  }, []);

  const copyCSS = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">CSS Box Shadow Generator</h1>
            <p className="mt-2 text-slate-600">
              Create beautiful box shadows with live preview — layer, customize, and export CSS instantly
            </p>
          </div>
        </motion.div>

        {/* Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Presets</h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                {preset.name}
              </button>
            ))}
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {layers.map((layer, index) => (
              <div key={layer.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-xs font-bold text-violet-700">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-700">
                      {layer.inset ? 'Inset Shadow' : 'Drop Shadow'} Layer
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={layer.inset}
                        onChange={(e) => updateLayer(layer.id, { inset: e.target.checked })}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                      Inset
                    </label>
                    {layers.length > 1 && (
                      <button
                        onClick={() => removeLayer(layer.id)}
                        className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Offset X */}
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Offset X</span>
                      <span className="font-mono text-slate-400">{layer.offsetX}px</span>
                    </label>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.offsetX}
                      onChange={(e) => updateLayer(layer.id, { offsetX: parseInt(e.target.value) })}
                      className="w-full accent-violet-600"
                    />
                  </div>

                  {/* Offset Y */}
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Offset Y</span>
                      <span className="font-mono text-slate-400">{layer.offsetY}px</span>
                    </label>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.offsetY}
                      onChange={(e) => updateLayer(layer.id, { offsetY: parseInt(e.target.value) })}
                      className="w-full accent-violet-600"
                    />
                  </div>

                  {/* Blur */}
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Blur Radius</span>
                      <span className="font-mono text-slate-400">{layer.blur}px</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={layer.blur}
                      onChange={(e) => updateLayer(layer.id, { blur: parseInt(e.target.value) })}
                      className="w-full accent-violet-600"
                    />
                  </div>

                  {/* Spread */}
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Spread</span>
                      <span className="font-mono text-slate-400">{layer.spread}px</span>
                    </label>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={layer.spread}
                      onChange={(e) => updateLayer(layer.id, { spread: parseInt(e.target.value) })}
                      className="w-full accent-violet-600"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={layer.color}
                        onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                        className="h-8 w-10 cursor-pointer rounded border border-slate-200"
                      />
                      <input
                        type="text"
                        value={layer.color}
                        onChange={(e) => {
                          if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                            updateLayer(layer.id, { color: e.target.value });
                          }
                        }}
                        className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Opacity</span>
                      <span className="font-mono text-slate-400">{layer.opacity}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={layer.opacity}
                      onChange={(e) => updateLayer(layer.id, { opacity: parseInt(e.target.value) })}
                      className="w-full accent-violet-600"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addLayer}
              className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600"
            >
              + Add Shadow Layer
            </button>
          </motion.div>

          {/* Preview and Output */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Preview Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Eye className="h-4 w-4 text-violet-500" />
                Preview
              </h3>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewBg}
                      onChange={(e) => setPreviewBg(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-200"
                    />
                    <input
                      type="text"
                      value={previewBg}
                      onChange={(e) => setPreviewBg(e.target.value)}
                      className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-xs focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Radius</label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={previewRadius}
                    onChange={(e) => setPreviewRadius(parseInt(e.target.value))}
                    className="w-24 accent-violet-600"
                  />
                  <span className="ml-1 text-xs text-slate-400">{previewRadius}px</span>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Size</label>
                  <input
                    type="range"
                    min={80}
                    max={400}
                    value={previewSize}
                    onChange={(e) => setPreviewSize(parseInt(e.target.value))}
                    className="w-24 accent-violet-600"
                  />
                  <span className="ml-1 text-xs text-slate-400">{previewSize}px</span>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div
                className="mx-auto flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: previewBg,
                  borderRadius: `${previewRadius}px`,
                  width: `${previewSize}px`,
                  height: `${previewSize}px`,
                  boxShadow: boxShadowCSS,
                }}
              >
                <span className="text-sm font-medium text-slate-400">Preview</span>
              </div>
            </div>

            {/* CSS Output */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">CSS Output</span>
                <button
                  onClick={copyCSS}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-slate-800">
                {cssCode}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
