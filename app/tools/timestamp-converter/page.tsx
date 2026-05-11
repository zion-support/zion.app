'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, RefreshCw, ArrowRight } from 'lucide-react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [humanReadable, setHumanReadable] = useState('');
  const [mode, setMode] = useState<'toHuman' | 'toTimestamp'>('toHuman');
  const [copied, setCopied] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertToHuman = () => {
    if (!timestamp) return;
    try {
      const ts = parseInt(timestamp);
      const date = new Date(ts * 1000);
      setHumanReadable(date.toISOString());
    } catch {
      setHumanReadable('Invalid timestamp');
    }
  };

  const convertToTimestamp = () => {
    if (!humanReadable) return;
    try {
      const date = new Date(humanReadable);
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch {
      setTimestamp('Invalid date');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useCurrentTimestamp = () => {
    setTimestamp(currentTimestamp.toString());
    const date = new Date(currentTimestamp * 1000);
    setHumanReadable(date.toISOString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-600/20 text-cyan-300 px-4 py-2 rounded-full text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Timestamp{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Converter
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Convert Unix timestamps to human-readable dates and vice versa.
          </p>
        </motion.div>

        {/* Current Timestamp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-6 text-center"
        >
          <p className="text-slate-400 text-sm">Current Unix Timestamp</p>
          <p className="text-3xl font-mono text-cyan-400 font-bold">{currentTimestamp}</p>
          <p className="text-slate-500 text-xs mt-1">
            {new Date().toLocaleString()}
          </p>
        </motion.div>

        {/* Converter */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                {mode === 'toHuman' ? 'Unix Timestamp to Human Readable' : 'Human Readable to Unix Timestamp'}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  {mode === 'toHuman' ? 'Unix Timestamp (seconds)' : 'Date/Time String'}
                </label>
                <input
                  type="text"
                  value={mode === 'toHuman' ? timestamp : humanReadable}
                  onChange={(e) => mode === 'toHuman' ? setTimestamp(e.target.value) : setHumanReadable(e.target.value)}
                  placeholder={mode === 'toHuman' ? '1711564800' : '2024-03-27T12:00:00.000Z'}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={mode === 'toHuman' ? convertToHuman : convertToTimestamp}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Convert
                </button>
                <button
                  onClick={useCurrentTimestamp}
                  className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  {mode === 'toHuman' ? 'Human Readable' : 'Unix Timestamp'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mode === 'toHuman' ? humanReadable : timestamp}
                    readOnly
                    className="flex-1 bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(mode === 'toHuman' ? humanReadable : timestamp)}
                    className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                  >
                    {copied ? '✓' : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMode(mode === 'toHuman' ? 'toTimestamp' : 'toHuman')}
                className="w-full py-2 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Switch to {mode === 'toHuman' ? 'Date → Timestamp' : 'Timestamp → Date'}
              </button>
            </div>
          </motion.div>

          {/* Quick Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
          >
            <h4 className="text-white font-semibold mb-3">Quick Examples</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '1 hour ago', ts: Math.floor(Date.now() / 1000) - 3600 },
                { label: '1 day ago', ts: Math.floor(Date.now() / 1000) - 86400 },
                { label: '1 week ago', ts: Math.floor(Date.now() / 1000) - 604800 },
                { label: '1 month ago', ts: Math.floor(Date.now() / 1000) - 2592000 },
              ].map((example) => (
                <button
                  key={example.label}
                  onClick={() => {
                    setTimestamp(example.ts.toString());
                    setHumanReadable(new Date(example.ts * 1000).toISOString());
                  }}
                  className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}