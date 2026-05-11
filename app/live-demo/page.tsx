'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Wand2, Bot, Mic, Eye, Code } from 'lucide-react';

const DEMOS = [
  { id: 'chat', name: 'AI Chat', icon: Bot, description: 'Try our conversational AI', action: 'Start Chat' },
  { id: 'voice', name: 'Voice AI', icon: Mic, description: 'Speak and get voice responses', action: 'Start Listening' },
  { id: 'vision', name: 'Computer Vision', icon: Eye, description: 'Upload an image for AI analysis', action: 'Upload Image' },
  { id: 'code', name: 'Code Assistant', icon: Code, description: 'Get AI help writing code', action: 'Write Code' }
];

export default function LiveDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Wand2 className="w-16 h-16 text-violet-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">Live AI Demos</h1>
          <p className="text-xl text-slate-400">Try our AI products in real-time</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {DEMOS.map((demo, i) => (
            <motion.div key={demo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setActiveDemo(demo.id)} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-violet-500 cursor-pointer transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-violet-900/50 rounded-xl flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                  <demo.icon className="w-7 h-7 text-violet-400 group-hover:text-white transition-colors" />
                </div>
                {activeDemo === demo.id ? <Pause className="w-6 h-6 text-red-400" /> : <Play className="w-6 h-6 text-green-400" />}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{demo.name}</h3>
              <p className="text-slate-400 mb-4">{demo.description}</p>
              <span className="inline-flex items-center gap-2 text-violet-400 font-medium">{activeDemo === demo.id ? 'Stop Demo' : demo.action} <Play className="w-4 h-4" /></span>
            </motion.div>
          ))}
        </div>

        {activeDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 bg-slate-800 rounded-2xl p-8 border border-violet-500">
            <h3 className="text-2xl font-bold text-white mb-4">Demo Active: {DEMOS.find(d => d.id === activeDemo)?.name}</h3>
            <div className="bg-slate-900 rounded-xl p-6 h-64 flex items-center justify-center">
              <p className="text-slate-400">Demo interface would appear here. Connect to AI API to enable live interaction.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
