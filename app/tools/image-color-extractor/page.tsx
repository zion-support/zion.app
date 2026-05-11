'use client';

import { useState, useCallback, useRef } from 'react';
import { Copy, Check, Palette, Upload, X, Download, Shuffle } from 'lucide-react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  count: number;
  percentage: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

function extractColors(imageData: ImageData, maxColors: number = 8): ColorInfo[] {
  const pixels: { r: number; g: number; b: number }[] = [];
  const step = Math.max(1, Math.floor(imageData.data.length / 4 / 10000)); // Sample ~10k pixels max

  for (let i = 0; i < imageData.data.length; i += 4 * step) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a < 128) continue; // Skip transparent pixels
    // Quantize to reduce noise
    pixels.push({
      r: Math.round(r / 16) * 16,
      g: Math.round(g / 16) * 16,
      b: Math.round(b / 16) * 16,
    });
  }

  if (pixels.length === 0) return [];

  // K-means-like clustering
  const clusters: { center: { r: number; g: number; b: number }; pixels: { r: number; g: number; b: number }[] }[] = [];

  // Initialize with k-means++ style
  const firstIdx = Math.floor(Math.random() * pixels.length);
  clusters.push({ center: { ...pixels[firstIdx] }, pixels: [] });

  for (let k = 1; k < maxColors; k++) {
    let maxDist = -1;
    let bestPixel = pixels[0];
    for (const pixel of pixels) {
      const minClusterDist = Math.min(...clusters.map(c => colorDistance(pixel, c.center)));
      if (minClusterDist > maxDist) {
        maxDist = minClusterDist;
        bestPixel = pixel;
      }
    }
    clusters.push({ center: { ...bestPixel }, pixels: [] });
  }

  // Run iterations
  for (let iter = 0; iter < 15; iter++) {
    // Assign pixels to nearest cluster
    for (const cluster of clusters) cluster.pixels = [];
    for (const pixel of pixels) {
      let minDist = Infinity;
      let nearest = clusters[0];
      for (const cluster of clusters) {
        const dist = colorDistance(pixel, cluster.center);
        if (dist < minDist) {
          minDist = dist;
          nearest = cluster;
        }
      }
      nearest.pixels.push(pixel);
    }
    // Update centers
    for (const cluster of clusters) {
      if (cluster.pixels.length === 0) continue;
      cluster.center = {
        r: Math.round(cluster.pixels.reduce((s, p) => s + p.r, 0) / cluster.pixels.length),
        g: Math.round(cluster.pixels.reduce((s, p) => s + p.g, 0) / cluster.pixels.length),
        b: Math.round(cluster.pixels.reduce((s, p) => s + p.b, 0) / cluster.pixels.length),
      };
    }
  }

  // Convert to ColorInfo
  return clusters
    .filter(c => c.pixels.length > 0)
    .map(cluster => {
      const { r, g, b } = cluster.center;
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b),
        count: cluster.pixels.length,
        percentage: Math.round((cluster.pixels.length / pixels.length) * 1000) / 10,
      };
    })
    .sort((a, b) => b.count - a.count);
}

function formatColor(color: ColorInfo, format: string): string {
  switch (format) {
    case 'hex': return color.hex;
    case 'rgb': return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'hsl': return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case 'tailwind': return `${color.hex}`;
    default: return color.hex;
  }
}

function downloadPalette(colors: ColorInfo[], format: string) {
  let content = '';
  switch (format) {
    case 'css':
      content = ':root {\n' + colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n') + '\n}';
      break;
    case 'scss':
      content = colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n');
      break;
    case 'json':
      content = JSON.stringify(colors.map(c => ({
        hex: c.hex,
        rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
        hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
        percentage: c.percentage,
      })), null, 2);
      break;
    case 'tailwind':
      content = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        'palette-${i + 1}': '${c.hex}',`).join('\n')}\n      },\n    },\n  },\n};`;
      break;
  }
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `palette.${format === 'json' ? 'json' : format === 'tailwind' ? 'js' : format}`;
  a.click();
  URL.revokeObjectURL(url);
}

const EXAMPLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export default function ImageColorExtractor() {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [colorCount, setColorCount] = useState(8);
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImageUrl(url);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize for performance
        const maxDim = 200;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const extracted = extractColors(imageData, colorCount);
        setColors(extracted);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [colorCount]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  }, [processImage]);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const copyAllColors = useCallback(() => {
    const text = colors.map(c => formatColor(c, colorFormat)).join('\n');
    copyToClipboard(text, 'all');
  }, [colors, colorFormat, copyToClipboard]);

  const generateRandomPalette = useCallback(() => {
    // Generate a synthetic "image" with random colored blocks
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 200;
    canvas.height = 200;
    for (let i = 0; i < 20; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(
        Math.random() * 200,
        Math.random() * 200,
        20 + Math.random() * 60,
        20 + Math.random() * 60
      );
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setColors(extractColors(imageData, colorCount));
    setImageUrl(canvas.toDataURL());
  }, [colorCount]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center text-white">
          <Palette className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Image Color Extractor</h1>
          <p className="text-slate-600">Extract dominant color palettes from any image</p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
          isDragging
            ? 'border-pink-400 bg-pink-50'
            : 'border-slate-300 hover:border-pink-300 hover:bg-pink-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-700 font-medium">Drop an image here or click to upload</p>
        <p className="text-sm text-slate-500 mt-1">PNG, JPG, GIF, WebP — any image format</p>
      </div>

      {/* Options */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Colors:</label>
          <select
            value={colorCount}
            onChange={(e) => setColorCount(parseInt(e.target.value))}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
          >
            {[3, 4, 5, 6, 8, 10, 12].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Format:</label>
          {(['hex', 'rgb', 'hsl'] as const).map(f => (
            <button
              key={f}
              onClick={() => setColorFormat(f)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                colorFormat === f ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={generateRandomPalette}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm transition ml-auto"
        >
          <Shuffle className="w-4 h-4" />
          Random Demo
        </button>
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="mb-6 relative inline-block">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-full max-h-64 rounded-xl border border-slate-200 shadow-sm"
          />
          <button
            onClick={() => { setImageUrl(null); setColors([]); }}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Color Palette Results */}
      {colors.length > 0 && (
        <div className="space-y-4">
          {/* Visual Palette Strip */}
          <div className="flex rounded-xl overflow-hidden h-16 shadow-lg">
            {colors.map((color, i) => (
              <div
                key={i}
                style={{ backgroundColor: color.hex, flex: color.percentage }}
                className="transition-all hover:flex-[2] cursor-pointer relative group"
                title={`${color.hex} — ${color.percentage}%`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                  <span className="text-xs font-bold" style={{ color: getLuminance(color.rgb.r, color.rgb.g, color.rgb.b) > 0.5 ? '#000' : '#fff' }}>
                    {color.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Color Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {colors.map((color, i) => {
              const textColor = getLuminance(color.rgb.r, color.rgb.g, color.rgb.b) > 0.5 ? 'text-slate-900' : 'text-white';
              const formatted = formatColor(color, colorFormat);
              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  <div
                    className="h-20 flex items-end p-3"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className={`text-xs font-mono font-bold ${textColor}`}>{color.hex}</span>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{formatted}</span>
                      <button
                        onClick={() => copyToClipboard(formatted, `color-${i}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                      >
                        {copied === `color-${i}` ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-slate-500">
                      {color.percentage}% of image
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={copyAllColors}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy All ({colorFormat.toUpperCase()})
            </button>
            <button
              onClick={() => downloadPalette(colors, 'css')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm transition"
            >
              <Download className="w-4 h-4" />
              CSS Variables
            </button>
            <button
              onClick={() => downloadPalette(colors, 'scss')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm transition"
            >
              <Download className="w-4 h-4" />
              SCSS
            </button>
            <button
              onClick={() => downloadPalette(colors, 'json')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm transition"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={() => downloadPalette(colors, 'tailwind')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm transition"
            >
              <Download className="w-4 h-4" />
              Tailwind Config
            </button>
          </div>
        </div>
      )}

      {/* Empty state with sample colors */}
      {colors.length === 0 && !imageUrl && (
        <div className="text-center py-8">
          <div className="flex justify-center gap-2 mb-3">
            {EXAMPLE_COLORS.map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">Upload an image to extract its color palette</p>
        </div>
      )}
    </div>
  );
}
