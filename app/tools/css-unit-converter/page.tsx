'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRightLeft, Ruler, RotateCcw } from 'lucide-react';

type UnitType = 'px' | 'rem' | 'em' | 'pt' | 'vw' | 'vh' | 'vmin' | 'vmax' | '%' | 'cm' | 'mm' | 'in';

interface UnitInfo {
  label: string;
  fullName: string;
  description: string;
}

const UNIT_INFO: Record<UnitType, UnitInfo> = {
  px: { label: 'px', fullName: 'Pixels', description: 'Absolute unit — 1 CSS pixel' },
  rem: { label: 'rem', fullName: 'Root EM', description: 'Relative to root font-size (usually 16px)' },
  em: { label: 'em', fullName: 'EM', description: 'Relative to parent font-size' },
  pt: { label: 'pt', fullName: 'Points', description: '1/72 of an inch (print)' },
  vw: { label: 'vw', fullName: 'Viewport Width', description: '1% of viewport width' },
  vh: { label: 'vh', fullName: 'Viewport Height', description: '1% of viewport height' },
  vmin: { label: 'vmin', fullName: 'Viewport Min', description: '1% of smaller viewport dimension' },
  vmax: { label: 'vmax', fullName: 'Viewport Max', description: '1% of larger viewport dimension' },
  '%': { label: '%', fullName: 'Percentage', description: 'Relative to parent element' },
  cm: { label: 'cm', fullName: 'Centimeters', description: 'Absolute unit (print)' },
  mm: { label: 'mm', fullName: 'Millimeters', description: 'Absolute unit (print)' },
  in: { label: 'in', fullName: 'Inches', description: 'Absolute unit (print, 1in = 96px)' },
};

const UNITS: UnitType[] = ['px', 'rem', 'em', 'pt', 'vw', 'vh', 'vmin', 'vmax', '%', 'cm', 'mm', 'in'];

// All conversions go through px as the base unit
function toPx(value: number, unit: UnitType, rootFontSize: number, parentFontSize: number, viewportWidth: number, viewportHeight: number): number {
  switch (unit) {
    case 'px': return value;
    case 'rem': return value * rootFontSize;
    case 'em': return value * parentFontSize;
    case 'pt': return value * (96 / 72);
    case 'vw': return (value / 100) * viewportWidth;
    case 'vh': return (value / 100) * viewportHeight;
    case 'vmin': return (value / 100) * Math.min(viewportWidth, viewportHeight);
    case 'vmax': return (value / 100) * Math.max(viewportWidth, viewportHeight);
    case '%': return (value / 100) * parentFontSize;
    case 'cm': return value * (96 / 2.54);
    case 'mm': return value * (96 / 25.4);
    case 'in': return value * 96;
    default: return value;
  }
}

function fromPx(px: number, unit: UnitType, rootFontSize: number, parentFontSize: number, viewportWidth: number, viewportHeight: number): number {
  switch (unit) {
    case 'px': return px;
    case 'rem': return px / rootFontSize;
    case 'em': return px / parentFontSize;
    case 'pt': return px * (72 / 96);
    case 'vw': return (px / viewportWidth) * 100;
    case 'vh': return (px / viewportHeight) * 100;
    case 'vmin': return (px / Math.min(viewportWidth, viewportHeight)) * 100;
    case 'vmax': return (px / Math.max(viewportWidth, viewportHeight)) * 100;
    case '%': return (px / parentFontSize) * 100;
    case 'cm': return px * (2.54 / 96);
    case 'mm': return px * (25.4 / 96);
    case 'in': return px / 96;
    default: return px;
  }
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  // Round to 4 decimal places max, strip trailing zeros
  const s = n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

const PRESETS = [
  { label: '16px body font', value: 16, unit: 'px' as UnitType },
  { label: '1rem', value: 1, unit: 'rem' as UnitType },
  { label: '100vh (full screen)', value: 100, unit: 'vh' as UnitType },
  { label: '50vw (half width)', value: 50, unit: 'vw' as UnitType },
  { label: '12pt (standard print)', value: 12, unit: 'pt' as UnitType },
  { label: '1 inch', value: 1, unit: 'in' as UnitType },
];

export default function CssUnitConverter() {
  const [inputValue, setInputValue] = useState('16');
  const [fromUnit, setFromUnit] = useState<UnitType>('px');
  const [rootFontSize, setRootFontSize] = useState(16);
  const [parentFontSize, setParentFontSize] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const [copiedUnit, setCopiedUnit] = useState<UnitType | null>(null);

  const value = parseFloat(inputValue) || 0;

  const conversions = useCallback(() => {
    const pxValue = toPx(value, fromUnit, rootFontSize, parentFontSize, viewportWidth, viewportHeight);
    return UNITS.map((unit) => ({
      unit,
      value: fromPx(pxValue, unit, rootFontSize, parentFontSize, viewportWidth, viewportHeight),
    }));
  }, [value, fromUnit, rootFontSize, parentFontSize, viewportWidth, viewportHeight]);

  const results = conversions();

  const copyValue = async (unit: UnitType, val: number) => {
    const text = `${formatNumber(val)}${unit === '%' ? '%' : unit}`;
    await navigator.clipboard.writeText(text);
    setCopiedUnit(unit);
    setTimeout(() => setCopiedUnit(null), 1500);
  };

  const swapWith = (unit: UnitType) => {
    const result = results.find((r) => r.unit === unit);
    if (result) {
      setInputValue(formatNumber(result.value));
      setFromUnit(unit);
    }
  };

  const loadPreset = (val: number, unit: UnitType) => {
    setInputValue(val.toString());
    setFromUnit(unit);
  };

  // Compute CSS output
  const cssDeclaration = (() => {
    const pxResult = results.find((r) => r.unit === 'px');
    if (!pxResult) return '';
    const remResult = results.find((r) => r.unit === 'rem');
    const px = formatNumber(pxResult.value);
    const rem = remResult ? formatNumber(remResult.value) : '';
    return rem && parseFloat(rem) !== 0
      ? `font-size: ${px}px; /* ${rem}rem */`
      : `font-size: ${px}px;`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <Ruler className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">CSS Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">CSS Unit Converter</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Convert between px, rem, em, vw, vh, pt, and more. Configure root font size
            and viewport dimensions for accurate conversions.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                placeholder="Enter value..."
                step="any"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-slate-300 mb-2">From Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as UnitType)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {UNIT_INFO[u].label} — {UNIT_INFO[u].fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Root font-size (px)</label>
              <input
                type="number"
                value={rootFontSize}
                onChange={(e) => setRootFontSize(Number(e.target.value) || 16)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Parent font-size (px)</label>
              <input
                type="number"
                value={parentFontSize}
                onChange={(e) => setParentFontSize(Number(e.target.value) || 16)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Viewport width (px)</label>
              <input
                type="number"
                value={viewportWidth}
                onChange={(e) => setViewportWidth(Number(e.target.value) || 1920)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Viewport height (px)</label>
              <input
                type="number"
                value={viewportHeight}
                onChange={(e) => setViewportHeight(Number(e.target.value) || 1080)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-6 justify-center"
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p.value, p.unit)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {p.label}
            </button>
          ))}
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
        >
          {results.map(({ unit, value: val }) => {
            const isCurrent = unit === fromUnit;
            return (
              <motion.div
                key={unit}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer group ${
                  isCurrent
                    ? 'bg-violet-600/20 border-violet-500/40 ring-1 ring-violet-500/30'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
                onClick={() => copyValue(unit, val)}
                title={`Click to copy`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${isCurrent ? 'text-violet-300' : 'text-slate-400'}`}>
                    {UNIT_INFO[unit].fullName}
                  </span>
                  {copiedUnit === unit ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                </div>
                <div className={`font-mono text-xl font-bold ${isCurrent ? 'text-violet-200' : 'text-white'}`}>
                  {formatNumber(val)}
                  <span className={`text-sm ml-1 ${isCurrent ? 'text-violet-400' : 'text-slate-400'}`}>
                    {unit === '%' ? '%' : unit}
                  </span>
                </div>
                {!isCurrent && (
                  <button
                    onClick={(e) => { e.stopPropagation(); swapWith(unit); }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-violet-400"
                    title="Use as input"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {isCurrent && (
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] text-violet-400 bg-violet-500/20 rounded px-1.5 py-0.5">input</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* CSS Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-sm font-medium text-slate-300 mb-3">Quick CSS Copy</h2>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-emerald-300 font-mono text-sm">
              {cssDeclaration}
            </code>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(cssDeclaration);
                setCopiedUnit('px');
                setTimeout(() => setCopiedUnit(null), 1500);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
            >
              {copiedUnit === 'px' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedUnit === 'px' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>

        {/* Unit Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Unit Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UNITS.map((u) => (
              <div key={u} className="flex items-start gap-3">
                <code className="bg-slate-700 text-violet-300 rounded px-2 py-0.5 text-sm font-mono shrink-0">
                  {u}
                </code>
                <div>
                  <div className="text-sm text-white font-medium">{UNIT_INFO[u].fullName}</div>
                  <div className="text-xs text-slate-500">{UNIT_INFO[u].description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
