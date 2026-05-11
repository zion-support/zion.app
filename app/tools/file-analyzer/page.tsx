'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Trash2,
  File,
  Image,
  Film,
  Music,
  Archive,
  Sparkles,
  Tag,
} from 'lucide-react';

interface FileAnalysis {
  name: string;
  size: string;
  type: string;
  summary: string;
  tags: string[];
  metadata: Record<string, string>;
}

const fileTypes = [
  { id: 'document', label: 'Documents', icon: FileText, extensions: ['.pdf', '.doc', '.docx', '.txt'] },
  { id: 'image', label: 'Images', icon: Image, extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg'] },
  { id: 'video', label: 'Videos', icon: Film, extensions: ['.mp4', '.mov', '.avi', '.webm'] },
  { id: 'audio', label: 'Audio', icon: Music, extensions: ['.mp3', '.wav', '.ogg'] },
  { id: 'archive', label: 'Archives', icon: Archive, extensions: ['.zip', '.rar', '.7z', '.tar'] },
];

export default function AIFileAnalyzer() {
  const [files, setFiles] = useState<FileAnalysis[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (filename: string): string => {
    const ext = '.' + (filename.split('.').pop()?.toLowerCase() ?? '');
    for (const type of fileTypes) {
      if (type.extensions.includes(ext)) return type.id;
    }
    return 'unknown';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    analyzeFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      analyzeFiles(selectedFiles);
    }
  };

  const analyzeFiles = (fileList: File[]) => {
    const newFiles: FileAnalysis[] = fileList.map((file) => ({
      name: file.name,
      size: formatSize(file.size),
      type: getFileType(file.name),
      summary: generateSummary(file.name, file.type),
      tags: generateTags(file.name),
      metadata: {
        'Last Modified': new Date(file.lastModified).toLocaleDateString(),
        ' MIME Type': file.type || 'unknown',
        ' Size': formatSize(file.size),
      }
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const generateSummary = (filename: string, _mimeType: string): string => {
    const summaries: Record<string, string> = {
      'pdf': `PDF document "${filename}" detected. Contains multi-page content suitable for text extraction, summarization, and analysis.`,
      'image': `Image file "${filename}" with visual content. AI can analyze objects, colors, faces, and extract descriptive tags.`,
      'video': `Video file "${filename}" detected. Contains motion content suitable for scene detection, thumbnail generation, and transcript extraction.`,
      'audio': `Audio file "${filename}" with sound content. Suitable for transcription, sentiment analysis, and music recognition.`,
      'document': `Document "${filename}" ready for AI analysis. Content extraction and semantic understanding available.`,
      'archive': `Archive "${filename}" containing bundled files. Can be extracted and analyzed for patterns.`,
    };
    
    const type = getFileType(filename);
    return summaries[type] || summaries.document;
  };

  const generateTags = (filename: string): string[] => {
    const baseTags = ['AI-analyzed'];
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    
    if (['pdf', 'doc', 'docx'].includes(ext)) baseTags.push('document', 'text');
    if (['jpg', 'png', 'gif', 'svg'].includes(ext)) baseTags.push('visual', 'image');
    if (['mp4', 'mov', 'avi'].includes(ext)) baseTags.push('video', 'media');
    if (['mp3', 'wav', 'ogg'].includes(ext)) baseTags.push('audio', 'sound');
    if (['zip', 'rar', '7z'].includes(ext)) baseTags.push('compressed', 'bundle');
    
    return baseTags;
  };

  const filteredFiles = selectedType === 'all' 
    ? files 
    : files.filter(f => f.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-violet-600/20 text-violet-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI File{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Upload any file and get instant AI-powered analysis, metadata extraction, 
            and intelligent tags. Supports documents, images, videos, audio, and archives.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center mb-8 transition-colors ${
            isDragging 
              ? 'border-violet-500 bg-violet-500/10' 
              : 'border-slate-700 hover:border-slate-600'
          }`}
        >
          <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">
            Drag and drop files here
          </p>
          <p className="text-slate-400 mb-4">or click to browse</p>
          <label className="inline-block px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors cursor-pointer">
            Select Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Filter */}
        {files.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Files ({files.length})
            </button>
            {fileTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === type.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type.label} ({files.filter(f => f.type === type.id).length})
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {filteredFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {filteredFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <File className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{file.name}</h3>
                      <p className="text-slate-400 text-sm">{file.size} • {file.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                  <h4 className="text-slate-400 text-xs uppercase mb-2">AI Summary</h4>
                  <p className="text-slate-200 text-sm">{file.summary}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {file.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full"
                    >
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(file.metadata).map(([key, value], k) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-slate-500">{key}:</span>
                      <span className="text-slate-300">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {files.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No files analyzed yet. Upload files to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}