'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, RotateCcw, Upload, FileText, X, Download } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processText = useCallback(
    (text: string, currentMode: Mode) => {
      setError('');
      if (!text.trim()) {
        setOutput('');
        return;
      }
      try {
        if (currentMode === 'encode') {
          setOutput(btoa(unescape(encodeURIComponent(text))));
        } else {
          setOutput(decodeURIComponent(escape(atob(text))));
        }
      } catch {
        setError(
          currentMode === 'decode'
            ? 'Invalid Base64 string. Make sure the input is valid Base64 encoded text.'
            : 'Failed to encode the input text.',
        );
        setOutput('');
      }
    },
    [],
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    setError('');
    processText(value, mode);
  };

  const handleModeToggle = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setError('');
    if (output) {
      setInput(output);
      processText(output, newMode);
    } else {
      processText(input, newMode);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopied(false);
    setFileName(null);
    setFileSize(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = output;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    if (mode === 'encode') {
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1] ?? '';
        setInput(file.name);
        setOutput(base64);
        setError('');
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const text = reader.result as string;
        handleInputChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const inputCharCount = input.length;
  const outputCharCount = output.length;
  const expansionRatio = inputCharCount > 0 ? ((outputCharCount / inputCharCount) * 100).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Base64 Encoder / Decoder</h1>
          <p className="mt-2 text-lg text-slate-600">
            Encode or decode text and files to/from Base64 instantly
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Mode toggle */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => { setMode('encode'); setError(''); processText(input, 'encode'); }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'encode'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => { setMode('decode'); setError(''); processText(input, 'decode'); }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'decode'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Decode
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleModeToggle}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Swap input and output"
              >
                <ArrowDownUp className="h-4 w-4" />
                Swap
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          {/* File upload zone */}
          <div
            className="mb-4 cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-amber-400 hover:bg-amber-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Upload className="mx-auto mb-2 h-6 w-6 text-slate-400" />
            <p className="text-sm text-slate-600">
              Drop a file here or <span className="font-semibold text-amber-600">click to upload</span>
            </p>
            {fileName && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                <FileText className="h-3 w-3" />
                {fileName} {fileSize !== null && `(${formatBytes(fileSize)})`}
                <button
                  onClick={(e) => { e.stopPropagation(); setFileName(null); setFileSize(null); }}
                  className="text-amber-600 hover:text-amber-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Input / Output */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
              </label>
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
                className="h-64 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">{inputCharCount.toLocaleString()} characters</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder={mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded text will appear here...'}
                className="h-64 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                {outputCharCount.toLocaleString()} characters
                {inputCharCount > 0 && mode === 'encode' && (
                  <span className="ml-2 text-slate-500">({expansionRatio}% of input)</span>
                )}
              </p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Info section */}
          <div className="mt-6 rounded-xl bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-900">About Base64 Encoding</h3>
            <p className="mt-1 text-sm text-amber-800">
              Base64 is a binary-to-text encoding scheme that represents binary data as ASCII strings.
              Common uses: embedding images in HTML/CSS, encoding email attachments, API authentication
              tokens, and data URIs. Base64 output is ~33% larger than the input.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
