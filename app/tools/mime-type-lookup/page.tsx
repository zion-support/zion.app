'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Search, FileText, Filter } from 'lucide-react';

interface MimeEntry {
  type: string;
  extensions: string[];
  category: string;
  description: string;
}

const MIME_TYPES: MimeEntry[] = [
  { type: 'text/html', extensions: ['.html', '.htm'], category: 'Text', description: 'HTML document' },
  { type: 'text/css', extensions: ['.css'], category: 'Text', description: 'Cascading Style Sheets' },
  { type: 'text/javascript', extensions: ['.js', '.mjs'], category: 'Text', description: 'JavaScript module' },
  { type: 'text/plain', extensions: ['.txt', '.log'], category: 'Text', description: 'Plain text' },
  { type: 'text/csv', extensions: ['.csv'], category: 'Text', description: 'Comma-separated values' },
  { type: 'text/xml', extensions: ['.xml'], category: 'Text', description: 'XML document' },
  { type: 'text/markdown', extensions: ['.md', '.markdown'], category: 'Text', description: 'Markdown document' },
  { type: 'text/rtf', extensions: ['.rtf'], category: 'Text', description: 'Rich Text Format' },
  { type: 'text/calendar', extensions: ['.ics'], category: 'Text', description: 'iCalendar format' },
  { type: 'text/vcard', extensions: ['.vcf', '.vcard'], category: 'Text', description: 'vCard contact info' },
  { type: 'application/json', extensions: ['.json'], category: 'Application', description: 'JSON data' },
  { type: 'application/xml', extensions: ['.xml'], category: 'Application', description: 'XML data' },
  { type: 'application/pdf', extensions: ['.pdf'], category: 'Application', description: 'PDF document' },
  { type: 'application/zip', extensions: ['.zip'], category: 'Application', description: 'ZIP archive' },
  { type: 'application/gzip', extensions: ['.gz', '.gzip'], category: 'Application', description: 'GZIP compressed archive' },
  { type: 'application/x-tar', extensions: ['.tar'], category: 'Application', description: 'TAR archive' },
  { type: 'application/x-7z-compressed', extensions: ['.7z'], category: 'Application', description: '7-Zip archive' },
  { type: 'application/x-rar-compressed', extensions: ['.rar'], category: 'Application', description: 'RAR archive' },
  { type: 'application/octet-stream', extensions: ['.bin', '.exe', '.dll'], category: 'Application', description: 'Binary data / generic download' },
  { type: 'application/wasm', extensions: ['.wasm'], category: 'Application', description: 'WebAssembly binary' },
  { type: 'application/sql', extensions: ['.sql'], category: 'Application', description: 'SQL database file' },
  { type: 'application/graphql', extensions: ['.graphql', '.gql'], category: 'Application', description: 'GraphQL query language' },
  { type: 'application/x-www-form-urlencoded', extensions: [], category: 'Application', description: 'HTML form data encoding' },
  { type: 'application/ld+json', extensions: ['.jsonld'], category: 'Application', description: 'Linked Data JSON' },
  { type: 'application/x-sh', extensions: ['.sh'], category: 'Application', description: 'Shell script' },
  { type: 'application/x-python', extensions: ['.py'], category: 'Application', description: 'Python script' },
  { type: 'application/typescript', extensions: ['.ts', '.tsx'], category: 'Application', description: 'TypeScript source' },
  { type: 'application/x-yaml', extensions: ['.yaml', '.yml'], category: 'Application', description: 'YAML data' },
  { type: 'application/x-toml', extensions: ['.toml'], category: 'Application', description: 'TOML configuration' },
  { type: 'application/x-httpd-php', extensions: ['.php'], category: 'Application', description: 'PHP script' },
  { type: 'application/java-archive', extensions: ['.jar'], category: 'Application', description: 'Java archive' },
  { type: 'application/x-msdownload', extensions: ['.exe', '.msi'], category: 'Application', description: 'Windows executable' },
  { type: 'application/x-deb', extensions: ['.deb'], category: 'Application', description: 'Debian package' },
  { type: 'application/x-rpm', extensions: ['.rpm'], category: 'Application', description: 'RPM package' },
  { type: 'application/vnd.ms-excel', extensions: ['.xls'], category: 'Application', description: 'Microsoft Excel (legacy)' },
  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extensions: ['.xlsx'], category: 'Application', description: 'Microsoft Excel (OOXML)' },
  { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extensions: ['.docx'], category: 'Application', description: 'Microsoft Word (OOXML)' },
  { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extensions: ['.pptx'], category: 'Application', description: 'Microsoft PowerPoint (OOXML)' },
  { type: 'application/x-apple-diskimage', extensions: ['.dmg'], category: 'Application', description: 'Apple disk image' },
  { type: 'image/png', extensions: ['.png'], category: 'Image', description: 'PNG image' },
  { type: 'image/jpeg', extensions: ['.jpg', '.jpeg'], category: 'Image', description: 'JPEG image' },
  { type: 'image/gif', extensions: ['.gif'], category: 'Image', description: 'GIF image' },
  { type: 'image/svg+xml', extensions: ['.svg'], category: 'Image', description: 'SVG vector image' },
  { type: 'image/webp', extensions: ['.webp'], category: 'Image', description: 'WebP image' },
  { type: 'image/avif', extensions: ['.avif'], category: 'Image', description: 'AVIF image' },
  { type: 'image/apng', extensions: ['.apng'], category: 'Image', description: 'Animated PNG' },
  { type: 'image/bmp', extensions: ['.bmp'], category: 'Image', description: 'Bitmap image' },
  { type: 'image/tiff', extensions: ['.tiff', '.tif'], category: 'Image', description: 'TIFF image' },
  { type: 'image/x-icon', extensions: ['.ico'], category: 'Image', description: 'Icon image' },
  { type: 'image/heic', extensions: ['.heic', '.heif'], category: 'Image', description: 'HEIC/HEIF image' },
  { type: 'audio/mpeg', extensions: ['.mp3'], category: 'Audio', description: 'MPEG audio' },
  { type: 'audio/ogg', extensions: ['.ogg', '.oga'], category: 'Audio', description: 'OGG audio' },
  { type: 'audio/wav', extensions: ['.wav'], category: 'Audio', description: 'WAV audio' },
  { type: 'audio/webm', extensions: ['.weba'], category: 'Audio', description: 'WebM audio' },
  { type: 'audio/aac', extensions: ['.aac'], category: 'Audio', description: 'AAC audio' },
  { type: 'audio/flac', extensions: ['.flac'], category: 'Audio', description: 'FLAC audio' },
  { type: 'audio/mp4', extensions: ['.m4a'], category: 'Audio', description: 'MPEG-4 audio' },
  { type: 'video/mp4', extensions: ['.mp4', '.m4v'], category: 'Video', description: 'MPEG-4 video' },
  { type: 'video/webm', extensions: ['.webm'], category: 'Video', description: 'WebM video' },
  { type: 'video/ogg', extensions: ['.ogv'], category: 'Video', description: 'OGG video' },
  { type: 'video/mpeg', extensions: ['.mpeg', '.mpg'], category: 'Video', description: 'MPEG video' },
  { type: 'video/quicktime', extensions: ['.mov'], category: 'Video', description: 'QuickTime video' },
  { type: 'video/x-msvideo', extensions: ['.avi'], category: 'Video', description: 'AVI video' },
  { type: 'video/x-matroska', extensions: ['.mkv'], category: 'Video', description: 'Matroska video' },
  { type: 'font/woff', extensions: ['.woff'], category: 'Font', description: 'WOFF font' },
  { type: 'font/woff2', extensions: ['.woff2'], category: 'Font', description: 'WOFF2 font' },
  { type: 'font/ttf', extensions: ['.ttf'], category: 'Font', description: 'TrueType font' },
  { type: 'font/otf', extensions: ['.otf'], category: 'Font', description: 'OpenType font' },
  { type: 'multipart/form-data', extensions: [], category: 'Multipart', description: 'Form data with file uploads' },
  { type: 'multipart/byteranges', extensions: [], category: 'Multipart', description: 'Byte range request/response' },
];

const CATEGORIES = ['All', ...Array.from(new Set(MIME_TYPES.map(m => m.category)))];

const categoryColors: Record<string, string> = {
  Text: 'bg-blue-500/20 text-blue-400',
  Application: 'bg-purple-500/20 text-purple-400',
  Image: 'bg-green-500/20 text-green-400',
  Audio: 'bg-yellow-500/20 text-yellow-400',
  Video: 'bg-red-500/20 text-red-400',
  Font: 'bg-pink-500/20 text-pink-400',
  Multipart: 'bg-orange-500/20 text-orange-400',
};

export default function MimeTypeLookup() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MIME_TYPES.filter(entry => {
      const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        entry.type.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.extensions.some(ext => ext.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">MIME Type Lookup</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Look up MIME types by extension, content type, or description. Search through {MIME_TYPES.length} entries across {CATEGORIES.length - 1} categories.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by MIME type, extension (.json), or description..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedCategory === cat ? 'bg-cyan-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="overflow-x-auto rounded-xl border border-gray-700/50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/60 border-b border-gray-700/50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-300">MIME Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-300">Extensions</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-300">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-300">Description</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-300 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, idx) => (
                <tr key={`${entry.type}-${idx}`} className="border-b border-gray-700/30 hover:bg-gray-800/40 transition">
                  <td className="px-4 py-3"><code className="text-cyan-400 text-sm font-mono">{entry.type}</code></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {entry.extensions.length > 0 ? entry.extensions.map(ext => (
                        <span key={ext} className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300 font-mono">{ext}</span>
                      )) : <span className="text-gray-600 text-xs">&mdash;</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[entry.category] || 'bg-gray-700/50 text-gray-300'}`}>{entry.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{entry.description}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => copyToClipboard(entry.type, `${entry.type}-${idx}`)} className="p-1.5 rounded-lg hover:bg-gray-700/50 transition text-gray-400 hover:text-white" title="Copy MIME type">
                      {copiedId === `${entry.type}-${idx}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No MIME types found matching your search.</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
            <h3 className="font-semibold text-cyan-400 mb-2">What is a MIME type?</h3>
            <p className="text-sm text-gray-400">MIME (Multipurpose Internet Mail Extensions) types tell browsers and servers how to handle files. They&apos;re essential for correct Content-Type headers, file uploads, and API responses.</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
            <h3 className="font-semibold text-cyan-400 mb-2">Common use cases</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>&bull; Setting <code className="text-cyan-300">Content-Type</code> headers</li>
              <li>&bull; File upload validation</li>
              <li>&bull; Configuring web servers</li>
              <li>&bull; API response formatting</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
            <h3 className="font-semibold text-cyan-400 mb-2">Pro tip</h3>
            <p className="text-sm text-gray-400">Use <code className="text-cyan-300">application/octet-stream</code> as a fallback for unknown binary types. For API responses, always prefer <code className="text-cyan-300">application/json</code>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
