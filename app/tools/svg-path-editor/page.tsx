'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, PenTool, ZoomIn, ZoomOut, Grid3X3 } from 'lucide-react';

const SAMPLE_PATHS = [
  { label: 'Heart', d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { label: 'Star', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { label: 'Arrow', d: 'M5 12h14M12 5l7 7-7 7' },
  { label: 'Circle', d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
  { label: 'Check', d: 'M20 6L9 17l-5-5' },
  { label: 'Home', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m-4 0h4' },
];

interface PathCommand {
  type: string;
  params: number[];
  raw: string;
}

function parsePathCommands(d: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])\s*([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let match;
  while ((match = regex.exec(d)) !== null) {
    const type = match[1];
    const paramStr = match[2].trim();
    const params = paramStr ? paramStr.split(/[\s,]+/).map(Number).filter(n => !isNaN(n)) : [];
    commands.push({ type, params, raw: match[0].trim() });
  }
  return commands;
}

function getCommandDescription(cmd: PathCommand): string {
  const p = cmd.params;
  switch (cmd.type) {
    case 'M': return `Move to (${p[0]}, ${p[1]})`;
    case 'm': return `Move relative (${p[0]}, ${p[1]})`;
    case 'L': return `Line to (${p[0]}, ${p[1]})`;
    case 'l': return `Line relative (${p[0]}, ${p[1]})`;
    case 'H': return `Horizontal line to x=${p[0]}`;
    case 'h': return `Horizontal line relative ${p[0]}`;
    case 'V': return `Vertical line to y=${p[0]}`;
    case 'v': return `Vertical line relative ${p[0]}`;
    case 'C': return `Cubic Bézier to (${p[4]}, ${p[5]}) via (${p[0]}, ${p[1]}) & (${p[2]}, ${p[3]})`;
    case 'c': return `Cubic Bézier relative (${p[4]}, ${p[5]}) via (${p[0]}, ${p[1]}) & (${p[2]}, ${p[3]})`;
    case 'S': return `Smooth cubic to (${p[2]}, ${p[3]}) via (${p[0]}, ${p[1]})`;
    case 's': return `Smooth cubic relative (${p[2]}, ${p[3]}) via (${p[0]}, ${p[1]})`;
    case 'Q': return `Quadratic Bézier to (${p[2]}, ${p[3]}) via (${p[0]}, ${p[1]})`;
    case 'q': return `Quadratic Bézier relative (${p[2]}, ${p[3]}) via (${p[0]}, ${p[1]})`;
    case 'T': return `Smooth quadratic to (${p[0]}, ${p[1]})`;
    case 't': return `Smooth quadratic relative (${p[0]}, ${p[1]})`;
    case 'A': return `Arc to (${p[5]}, ${p[6]}) rx=${p[0]} ry=${p[1]} rot=${p[2]} large=${p[3]} sweep=${p[4]}`;
    case 'a': return `Arc relative (${p[5]}, ${p[6]}) rx=${p[0]} ry=${p[1]} rot=${p[2]} large=${p[3]} sweep=${p[4]}`;
    case 'Z': case 'z': return 'Close path';
    default: return cmd.raw;
  }
}

function optimizePath(d: string): string {
  return d
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ',')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*([MmLlHhVvCcSsQqTtAaZz])\s*/g, '$1')
    .replace(/(\d)\s*-\s*/g, '$1-')
    .trim();
}

function pathToCss(d: string): string {
  const encoded = d.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23');
  return `background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${encoded}'/></svg>");`;
}

export default function SvgPathEditor() {
  const [pathInput, setPathInput] = useState(SAMPLE_PATHS[0].d);
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [fillColor, setFillColor] = useState('none');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const commands = useMemo(() => parsePathCommands(pathInput), [pathInput]);

  const stats = useMemo(() => {
    const total = pathInput.length;
    const types = new Set(commands.map(c => c.type));
    const points = commands.reduce((acc, c) => acc + Math.floor(c.params.length / 2), 0);
    return { totalChars: total, commandTypes: types.size, pointCount: points, commandCount: commands.length };
  }, [pathInput, commands]);

  const optimized = useMemo(() => optimizePath(pathInput), [pathInput]);
  const savedBytes = pathInput.length - optimized.length;

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const viewBox = useMemo(() => {
    try {
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.setAttribute('d', pathInput);
      tempSvg.appendChild(tempPath);
      tempSvg.style.position = 'absolute';
      tempSvg.style.visibility = 'hidden';
      document.body.appendChild(tempSvg);
      const bbox = tempPath.getBBox();
      document.body.removeChild(tempSvg);
      if (bbox.width === 0 && bbox.height === 0) return '0 0 24 24';
      const pad = Math.max(bbox.width, bbox.height) * 0.15;
      return `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`;
    } catch {
      return '0 0 24 24';
    }
  }, [pathInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <PenTool className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">SVG Path Editor</h1>
            <p className="mt-2 text-slate-600">Edit, validate, and optimize SVG path data with live preview</p>
          </div>
        </motion.div>

        {/* Sample Paths */}
        <div className="mb-6 flex flex-wrap gap-2">
          {SAMPLE_PATHS.map((sp) => (
            <button
              key={sp.label}
              onClick={() => setPathInput(sp.d)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                pathInput === sp.d
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-slate-700">Path Data (d attribute)</label>
              <textarea
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
                className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="Enter SVG path data..."
                spellCheck={false}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => copy(pathInput, 'raw')}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  {copied === 'raw' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Raw
                </button>
                <button
                  onClick={() => copy(optimized, 'optimized')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {copied === 'optimized' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy Optimized
                </button>
                <button
                  onClick={() => setPathInput('')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Style Controls */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-slate-700">Style Controls</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Stroke</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border-0" />
                    <input type="text" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 text-xs font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Fill</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fillColor === 'none' ? '#ffffff' : fillColor} onChange={(e) => setFillColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border-0" />
                    <button onClick={() => setFillColor(fillColor === 'none' ? strokeColor : 'none')} className={`rounded px-2 py-1 text-xs font-medium ${fillColor === 'none' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-700'}`}>
                      {fillColor === 'none' ? 'None' : 'Fill'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Width: {strokeWidth}px</label>
                  <input type="range" min="0.5" max="8" step="0.5" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-slate-700">Path Statistics</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500 text-xs">Characters</div>
                  <div className="text-lg font-bold text-slate-900">{stats.totalChars}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500 text-xs">Commands</div>
                  <div className="text-lg font-bold text-slate-900">{stats.commandCount}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500 text-xs">Points</div>
                  <div className="text-lg font-bold text-slate-900">{stats.pointCount}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500 text-xs">Command Types</div>
                  <div className="text-lg font-bold text-slate-900">{stats.commandTypes}</div>
                </div>
              </div>
              {savedBytes > 0 && (
                <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700">
                  ✅ Optimized saves <strong>{savedBytes} bytes</strong> ({Math.round(savedBytes / stats.totalChars * 100)}% smaller)
                </div>
              )}
            </div>

            {/* CSS Export */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700">CSS Export</h3>
                <button onClick={() => copy(pathToCss(pathInput), 'css')} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
                  {copied === 'css' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </button>
              </div>
              <pre className="rounded-lg bg-slate-900 p-3 text-xs text-emerald-400 overflow-x-auto">{pathToCss(pathInput)}</pre>
            </div>
          </div>

          {/* Preview + Command Breakdown */}
          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700">Live Preview</h3>
                <div className="flex gap-1">
                  <button onClick={() => setShowGrid(!showGrid)} className={`rounded-lg p-1.5 transition-colors ${showGrid ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`} title="Toggle grid">
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))} className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors" title="Zoom in">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.25))} className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors" title="Zoom out">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50" style={{ backgroundImage: showGrid ? 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)' : 'none', backgroundSize: `${20 * zoom}px ${20 * zoom}px` }}>
                <svg viewBox={viewBox} className="h-full w-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                  <path d={pathInput} stroke={strokeColor} fill={fillColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => copy(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg"><path d="${pathInput}" stroke="${strokeColor}" fill="${fillColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'svg')} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors">
                  {copied === 'svg' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy SVG
                </button>
              </div>
            </div>

            {/* Command Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-slate-700">Command Breakdown</h3>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {commands.map((cmd, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-100 font-mono text-xs font-bold text-indigo-700">{cmd.type}</span>
                    <div>
                      <div className="text-slate-700">{getCommandDescription(cmd)}</div>
                      {cmd.params.length > 0 && (
                        <div className="mt-0.5 font-mono text-xs text-slate-400">[{cmd.params.join(', ')}]</div>
                      )}
                    </div>
                  </div>
                ))}
                {commands.length === 0 && (
                  <div className="py-6 text-center text-sm text-slate-400">Enter a path to see command breakdown</div>
                )}
              </div>
            </div>

            {/* Reference */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-slate-700">Path Command Reference</h3>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  ['M/m', 'Move to'],
                  ['L/l', 'Line to'],
                  ['H/h', 'Horizontal line'],
                  ['V/v', 'Vertical line'],
                  ['C/c', 'Cubic Bézier'],
                  ['S/s', 'Smooth cubic'],
                  ['Q/q', 'Quadratic Bézier'],
                  ['T/t', 'Smooth quadratic'],
                  ['A/a', 'Elliptical arc'],
                  ['Z/z', 'Close path'],
                ].map(([cmd, desc]) => (
                  <div key={cmd} className="flex gap-2 rounded bg-slate-50 p-1.5">
                    <span className="font-mono font-bold text-indigo-600">{cmd}</span>
                    <span className="text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
