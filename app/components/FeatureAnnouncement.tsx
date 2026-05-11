'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink } from 'lucide-react';

const FEATURES = [
  { id: '1', title: '💬 AI Chat Widget', desc: '24/7 AI chat on every page', link: '/', badge: 'New' },
  { id: '2', title: '🧮 Pricing Calculator', desc: 'Custom pricing for your needs', link: '/pricing-calculator', badge: 'New' },
  { id: '3', title: '🎮 Live AI Demos', desc: 'Try AI products in real-time', link: '/live-demo', badge: 'New' },
  { id: '4', title: '🎙️ Voice AI', desc: 'Speak naturally with AI', link: '/ai/voice-assistant', badge: 'Popular' }
];

export default function FeatureAnnouncement() {
  const [expanded, setExpanded] = useState(true);
  const visible = FEATURES;

  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-2xl shadow-2xl border border-violet-500/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-violet-800/50">
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-white font-semibold text-sm">What&apos;s New</span></div>
              <button onClick={() => setExpanded(false)}><X className="w-4 h-4 text-white/60" /></button>
            </div>
            <div className="p-4 space-y-3">
              {visible.map(f => (
                <div key={f.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium text-sm">{f.title}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${f.badge === 'New' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{f.badge}</span>
                      <p className="text-violet-200 text-xs mt-1">{f.desc}</p>
                    </div>
                    {f.link && <a href={f.link} className="ml-2 text-violet-300 hover:text-white"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && visible.length > 0 && <button onClick={() => setExpanded(true)} className="w-12 h-12 bg-violet-600 rounded-full shadow-lg flex items-center justify-center text-white animate-bounce"><Sparkles className="w-5 h-5" /></button>}
    </div>
  );
}
