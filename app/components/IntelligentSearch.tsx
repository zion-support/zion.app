'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, TrendingUp, Clock, Sparkles, 
  ArrowRight, Zap, FileText, Calculator, MessageCircle 
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: string;
  trending?: boolean;
}

const searchData: SearchResult[] = [
  { id: '1', title: 'AI Voice Assistant', description: 'Voice-enabled AI interactions', category: 'AI', href: '/ai-voice-assistant', icon: 'mic', trending: true },
  { id: '2', title: 'AI Chatbot Builder', description: 'Create custom chatbots', category: 'Development', href: '/ai-chatbot-builder', icon: 'chat', trending: true },
  { id: '3', title: 'ROI Calculator', description: 'Calculate AI investment returns', category: 'Tools', href: '/ai-tools', icon: 'calculator', trending: true },
  { id: '4', title: 'AI Analytics', description: 'Predictive analytics platform', category: 'Analytics', href: '/analytics-dashboard', icon: 'chart' },
  { id: '5', title: 'AI Security', description: 'Real-time threat detection', category: 'Security', href: '/ai-security-monitor', icon: 'shield' },
  { id: '6', title: 'AI Content Generator', description: 'Generate marketing content', category: 'Marketing', href: '/ai-content-generator', icon: 'sparkles' },
  { id: '7', title: 'Machine Learning', description: 'ML platform and tools', category: 'AI', href: '/ai-ml-platform', icon: 'brain' },
  { id: '8', title: 'Document Analyzer', description: 'AI document analysis', category: 'Tools', href: '/ai-tools', icon: 'file' },
  { id: '9', title: 'Smart Recommendations', description: 'Personalized suggestions', category: 'AI', href: '/ai-experiences', icon: 'star' },
  { id: '10', title: 'Workflow Automation', description: 'Automate business processes', category: 'Automation', href: '/ai-workflow-automation', icon: 'zap' },
];

const trendingSearches = ['voice AI', 'document analyzer', 'ROI calculator', 'chatbot builder'];

export default function IntelligentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('zion_recent_searches');
    if (stored) {
      setRecent(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const filtered = searchData.filter(
        item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered.slice(0, 8));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const saveSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('zion_recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      if (results.length > 0) {
        window.location.href = results[0].href;
      }
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      mic: <Search className="w-4 h-4" />,
      chat: <MessageCircle className="w-4 h-4" />,
      calculator: <Calculator className="w-4 h-4" />,
      chart: <TrendingUp className="w-4 h-4" />,
      shield: <Zap className="w-4 h-4" />,
      sparkles: <Sparkles className="w-4 h-4" />,
      brain: <Sparkles className="w-4 h-4" />,
      file: <FileText className="w-4 h-4" />,
      star: <TrendingUp className="w-4 h-4" />,
      zap: <Zap className="w-4 h-4" />,
    };
    return icons[iconName] || <Search className="w-4 h-4" />;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search AI services, tools, and more..."
          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {query.trim() ? (
              // Search Results
              <div className="max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  <>
                    <div className="p-2">
                      <p className="text-xs text-slate-500 px-3 py-1">Results</p>
                      {results.map((result, index) => (
                        <a
                          key={result.id}
                          href={result.href}
                          onClick={() => saveSearch(query)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            index === selectedIndex
                              ? 'bg-violet-600/20 text-white'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-violet-400">
                            {getIcon(result.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{result.title}</span>
                              {result.trending && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> Hot
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{result.category}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-slate-800 p-2">
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full text-left px-3 py-2 text-violet-400 hover:text-violet-300 text-sm flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Search for "{query}"
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">No results found for "{query}"</p>
                  </div>
                )}
              </div>
            ) : (
              // Empty State - Show Recent & Trending
              <div className="p-3">
                {recent.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 px-2 py-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent
                    </p>
                    {recent.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(search)}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 px-2 py-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </p>
                  {trendingSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
