'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Binary, RotateCcw, ArrowRightLeft } from 'lucide-react';

const BASES = [
  { label: 'Binary', base: 2, prefix: '0b', placeholder: '1010' },
  { label: 'Octal', base: 8, prefix: '0o', placeholder: '755' },
  { label: 'Decimal', base: 10, prefix: '', placeholder: '255' },
  { label: 'Hexadecimal', base: 16, prefix: '0x', placeholder: 'FF' },
  { label: 'Base-36', base: 36, prefix: '', placeholder: 'zz' },
] as const;

type BaseId = (typeof BASES)[number]['base'];

function convertFromDecimal(dec: bigint, targetBase: BaseId): string {
  if (dec === 0n) return '0';
  const negative = dec < 0n;
  const abs = negative ? -dec : dec;
  const result = abs.toString(targetBase);
  return negative ? `-${result}` : result;
}

function parseToDecimal(value: string, fromBase: BaseId): bigint | null {
  const cleaned = value.trim().toLowerCase().replace(/^0x/, '').replace(/^0b/, '').replace(/^0o/, '');
  if (!cleaned) return null;
  try {
    const negative = cleaned.startsWith('-');
    const digits = negative ? cleaned.slice(1) : cleaned;
    if (!/^[0-9a-z]+$/.test(digits)) return null;
    const result = BigInt(parseInt(digits, fromBase));
    return negative ? -result : result;
  } catch {
    return null;
  }
}

function toBits(value: bigint, bits: number): string {
  if (value < 0n) value = (1n << BigInt(bits)) + value;
  const bin = value.toString(2).padStart(bits, '0');
  return bin.match(/.{1,4}/g)?.join(' ') ?? bin;
}

function getMinBits(value: bigint): number {
  const abs = value < 0n ? -value : value;
  if (abs === 0n) return 8;
  const bits = abs.toString(2).length;
  if (bits <= 8) return 8;
  if (bits <= 16) return 16;
  if (bits <= 32) return 32;
  if (bits <= 64) return 64;
  return Math.ceil(bits / 8) * 8;
}

export default function NumberBaseConverter() {
  const [sourceBase, setSourceBase] = useState<BaseId>(10);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const decimalValue = parseToDecimal(inputValue, sourceBase);

  const conversions = BASES.map((b) => ({
    ...b,
    value: decimalValue !== null ? convertFromDecimal(decimalValue, b.base) : '—',
  }));

  const bits = decimalValue !== null ? getMinBits(decimalValue) : 8;
  const bitDisplay = decimalValue !== null ? toBits(decimalValue, bits) : null;
  const isValid = decimalValue !== null && inputValue.trim().length > 0;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleSwap = (targetBase: BaseId) => {
    if (decimalValue !== null) {
      setSourceBase(targetBase);
      setInputValue(convertFromDecimal(decimalValue, targetBase));
    }
  };

  const handleBaseChange = (newBase: BaseId) => {
    if (decimalValue !== null && inputValue.trim()) {
      setInputValue(convertFromDecimal(decimalValue, newBase));
    }
    setSourceBase(newBase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Number Base Converter</h1>
              <p className="text-slate-400">Convert between Binary, Octal, Decimal, Hex & Base-36</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="text-sm text-slate-400">Source base:</label>
            <div className="flex flex-wrap gap-2">
              {BASES.map((b) => (
                <button
                  key={b.base}
                  onClick={() => handleBaseChange(b.base)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sourceBase === b.base
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter a ${BASES.find((b) => b.base === sourceBase)?.label.toLowerCase()} number...`}
              className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-lg font-mono focus:outline-none focus:ring-2 transition-all ${
                inputValue && !isValid
                  ? 'border-red-500/50 focus:ring-red-500/50'
                  : 'border-slate-600/50 focus:ring-emerald-500/50'
              }`}
              spellCheck={false}
              autoComplete="off"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
          {inputValue && !isValid && (
            <p className="mt-2 text-sm text-red-400">Invalid {BASES.find((b) => b.base === sourceBase)?.label.toLowerCase()} number</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {conversions.map((conv, i) => (
            <motion.div
              key={conv.base}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 flex items-center justify-between gap-4 transition-all ${
                conv.base === sourceBase
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-slate-400 w-24 shrink-0">{conv.label}</span>
                <code className="text-lg font-mono truncate">
                  {conv.prefix && <span className="text-slate-500">{conv.prefix}</span>}
                  <span className={isValid ? 'text-emerald-300' : 'text-slate-600'}>{conv.value}</span>
                </code>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {conv.base !== sourceBase && isValid && (
                  <button
                    onClick={() => handleSwap(conv.base)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Use as source"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                )}
                {isValid && (
                  <button
                    onClick={() => copy(conv.prefix + conv.value, `conv-${conv.base}`)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Copy"
                  >
                    {copied === `conv-${conv.base}` ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {bitDisplay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-400">Bit Representation ({bits}-bit)</h3>
              <button
                onClick={() => copy(bitDisplay, 'bits')}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Copy bits"
              >
                {copied === 'bits' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <code className="block text-sm font-mono text-emerald-300/80 break-all leading-relaxed bg-slate-900/50 p-3 rounded-lg">
              {bitDisplay}
            </code>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500">
              <div>Unsigned: {decimalValue! >= 0n ? decimalValue!.toString() : (BigInt(2 ** bits) + decimalValue!).toString()}</div>
              <div>Signed: {decimalValue!.toString()}</div>
              <div>Bytes: {(bits / 8).toFixed(0)}</div>
              <div>Octets: {bitDisplay.split(' ').length}</div>
            </div>
          </motion.div>
        )}

        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
          >
            <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">Decimal</div>
                <div className="font-mono text-white">{decimalValue!.toString()}</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">Scientific</div>
                <div className="font-mono text-white">
                  {Number(decimalValue!).toExponential(4)}
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">Magnitude</div>
                <div className="font-mono text-white">
                  {decimalValue! === 0n ? '0' : `${decimalValue!.toString().length - 1} digits`}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
