'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Plus, Trash2, RotateCcw, Palette, ArrowRight, Shuffle } from 'lucide-react';

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';
type RadialShape = 'circle' | 'ellipse';
type RadialPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const PRESETS: { name: string; css: string; stops: ColorStop[]; type: GradientType; angle: number }[] = [
  { name: 'Sunset', css: '', stops: [{ id: 1, color: '#f97316', position: 0 }, { id: 2, color: '#ec4899', position: 50 }, { id: 3, color: '#8b5cf6', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Ocean', css: '', stops: [{ id: 1, color: '#06b6d4', position: 0 }, { id: 2, color: '#3b82f6', position: 50 }, { id: 3, color: '#6366f1', position: 100 }], type: 'linear', angle: 180 },
  { name: 'Forest', css: '', stops: [{ id: 1, color: '#059669', position: 0 }, { id: 2, color: '#10b981', position: 50 }, { id: 3, color: '#34d399', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Aurora', css: '', stops: [{ id: 1, color: '#06b6d4', position: 0 }, { id: 2, color: '#8b5cf6', position: 40 }, { id: 3, color: '#ec4899', position: 70 }, { id: 4, color: '#f97316', position: 100 }], type: 'linear', angle: 90 },
  { name: 'Midnight', css: '', stops: [{ id: 1, color: '#1e1b4b', position: 0 }, { id: 2, color: '#312e81', position: 50 }, { id: 3, color: '#4338ca', position: 100 }], type: 'linear', angle: 180 },
  { name: 'Peach', css: '', stops: [{ id: 1, color: '#fbbf24', position: 0 }, { id: 2, color: '#fb923c', position: 50 }, { id: 3, color: '#f87171', position: 100 }], type: 'radial', angle: 0 },
  { name: 'Neon', css: '', stops: [{ id: 1, color: '#22d3ee', position: 0 }, { id: 2, color: '#a78bfa', position: 50 }, { id: 3, color: '#f472b6', position: 100 }], type: 'conic', angle: 0 },
  { name: 'Earth', css: '', stops: [{ id: 1, color: '#78350f', position: 0 }, { id: 2, color: '#a16207', position: 33 }, { id: 3, color: '#ca8a04', position: 66 }, { id: 4, color: '#eab308', position: 100 }], type: 'linear', angle: 45 },
];

function buildGradientCSS(
  type: GradientType,
  angle: number,
  stops: ColorStop[],
  radialShape: RadialShape,
  radialPosition: RadialPosition,
): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

  const posMap: Record<RadialPosition, string> = {
    center: 'center',
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right',
    'top-left': 'top left',
    'top-right': 'top right',
    'bottom-left': 'bottom left',
    'bottom-right': 'bottom right',
  };

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    case 'radial':
      return `radial-gradient(${radialShape} at ${posMap[radialPosition]}, ${stopsStr})`;
    case 'conic':
      return `conic-gradient(from ${angle}deg at center, ${stopsStr})`;
    default:
      return `linear-gradient(${angle}deg, ${stopsStr})`;
  }
}

export default function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState<RadialShape>('circle');
  const [radialPosition, setRadialPosition] = useState<RadialPosition>('center');
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: '#6366f1', position: 0 },
    { id: 2, color: '#ec4899', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);
  const [nextId, setNextId] = useState(3);

  const gradientCSS = buildGradientCSS(gradientType, angle, stops, radialShape, radialPosition);

  const handleCopy = useCallback(async () => {
    const code = `background: ${gradientCSS};`;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [gradientCSS]);

  const addStop = useCallback(() => {
    const maxPos = Math.max(...stops.map((s) => s.position));
    const minPos = Math.min(...stops.map((s) => s.position));
    const newPos = Math.min(100, Math.round((maxPos + minPos) / 2));
    setStops((prev) => [...prev, { id: nextId, color: '#a78bfa', position: newPos }]);
    setNextId((prev) => prev + 1);
  }, [stops, nextId]);

  const removeStop = useCallback(
    (id: number) => {
      if (stops.length <= 2) return;
      setStops((prev) => prev.filter((s) => s.id !== id));
    },
    [stops.length],
  );

  const updateStop = useCallback((id: number, updates: Partial<ColorStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[0]) => {
      setGradientType(preset.type);
      setAngle(preset.angle);
      setStops(preset.stops.map((s, i) => ({ ...s, id: i + 1 })));
      setNextId(preset.stops.length + 1);
    },
    [],
  );

  const reset = useCallback(() => {
    setGradientType('linear');
    setAngle(135);
    setRadialShape('circle');
    setRadialPosition('center');
    setStops([
      { id: 1, color: '#6366f1', position: 0 },
      { id: 2, color: '#ec4899', position: 100 },
    ]);
    setNextId(3);
  }, []);

  const randomGradient = useCallback(() => {
    const randHex = () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
    const numStops = 2 + Math.floor(Math.random() * 3);
    const newStops: ColorStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        id: i + 1,
        color: randHex(),
        position: Math.round((i / (numStops - 1)) * 100),
      });
    }
    setStops(newStops);
    setNextId(numStops + 1);
    setAngle(Math.floor(Math.random() * 360));
    const types: GradientType[] = ['linear', 'radial', 'conic'];
    setGradientType(types[Math.floor(Math.random() * types.length)]);
  }, []);

  const positions: RadialPosition[] = ['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg flex items-center justify-center text-white">
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">CSS Gradient Generator</h1>
          </div>
          <p className="text-slate-600">
            Create beautiful CSS gradients with live preview. Supports linear, radial, and conic gradients with multiple color stops.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">Live Preview</h2>
              </div>
              <div
                className="aspect-square w-full transition-all duration-300"
                style={{ background: gradientCSS }}
              />
              <div className="p-4 bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">CSS Output</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="block text-sm text-emerald-300 font-mono break-all">
                  background: {gradientCSS};
                </code>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            {/* Gradient Type */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gradient Type</label>
              <div className="mt-2 flex gap-2">
                {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                      gradientType === type
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle / Shape / Position */}
            {gradientType === 'linear' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Angle</label>
                  <span className="text-sm font-mono font-semibold text-violet-600">{angle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="mt-2 w-full accent-violet-600"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAngle(a)}
                      className={`rounded-md px-2 py-1 text-xs font-mono font-semibold transition ${
                        angle === a ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {a}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gradientType === 'radial' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Shape</label>
                  <div className="mt-2 flex gap-2">
                    {(['circle', 'ellipse'] as RadialShape[]).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setRadialShape(shape)}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                          radialShape === shape
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Position</label>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {positions.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setRadialPosition(pos)}
                        className={`rounded-md px-2 py-1.5 text-xs font-semibold capitalize transition ${
                          radialPosition === pos
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {pos.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gradientType === 'conic' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Angle</label>
                  <span className="text-sm font-mono font-semibold text-violet-600">{angle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="mt-2 w-full accent-violet-600"
                />
              </div>
            )}

            {/* Color Stops */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Color Stops</label>
                <button
                  onClick={addStop}
                  className="flex items-center gap-1 rounded-md bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {stops
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div key={stop.id} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <div className="flex-1">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={stop.position}
                          onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                          className="w-full accent-violet-600"
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-mono text-slate-500">{stop.position}%</span>
                      <button
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length <= 2}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
              {/* Gradient bar preview */}
              <div
                className="mt-3 h-4 rounded-full border border-slate-200"
                style={{ background: `linear-gradient(90deg, ${[...stops].sort((a, b) => a.position - b.position).map((s) => `${s.color} ${s.position}%`).join(', ')})` }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={randomGradient}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <Shuffle className="w-4 h-4" /> Random
              </button>
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </motion.div>
        </div>

        {/* Presets Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Preset Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map((preset) => {
              const css = buildGradientCSS(preset.type, preset.angle, preset.stops, 'circle', 'center');
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div
                    className="aspect-video w-full"
                    style={{ background: css }}
                  />
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{preset.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CSS Snippets */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Reference</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Linear Gradient</h3>
              <code className="block text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg break-all">
                background: linear-gradient(135deg, #6366f1, #ec4899);
              </code>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Radial Gradient</h3>
              <code className="block text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg break-all">
                background: radial-gradient(circle at center, #6366f1, #ec4899);
              </code>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Conic Gradient</h3>
              <code className="block text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg break-all">
                background: conic-gradient(from 0deg, #6366f1, #ec4899);
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
