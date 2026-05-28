// Press
'use client';
import Link from 'next/link';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/about/" className="text-purple-400 hover:text-purple-300 text-sm mb-6 inline-block">← About</Link>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Press & Media</h1>
        <p className="text-slate-400 text-lg mb-8">Latest news, press releases, and thought leadership from Zion Tech Group.</p>
        <div className="space-y-6">
          {[
            {date:'2025-05-20',title:'Zion Tech Group Launches Enterprise AI Compliance Platform',outlet:'TechCrunch'},
            {date:'2025-04-15',title:'AI Copilot Framework Open-Sourced Under MIT License',outlet:'GitHub Blog'},
            {date:'2025-03-01',title:'Zion Wins IT Excellence Award for Cloud Automation Suite',outlet:'Silicon Review'},
          ].map((a,i)=>(
            <div key={i} className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 hover:border-purple-500/60 transition">
              <p className="text-purple-400 text-sm mb-1">{a.date} · {a.outlet}</p>
              <h3 className="font-semibold text-lg">{a.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
