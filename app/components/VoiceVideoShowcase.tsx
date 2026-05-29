'use client';

import { useState } from 'react';

export default function VoiceVideoShowcase() {
  const [activeTab, setActiveTab] = useState<'voice' | 'video' | 'analytics'>('voice');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<any>(null);

  const voiceMessages = [
    {
      id: 'voice_001',
      sender: 'John Smith',
      duration: '0:45',
      sentiment: 'neutral',
      transcript: 'Hi team, I wanted to quickly discuss the project timeline. Can we schedule a meeting for tomorrow at 2 PM? Please let me know your availability.',
      actionItems: ['Schedule meeting for tomorrow 2 PM', 'Check availability'],
      language: 'English'
    },
    {
      id: 'voice_002',
      sender: 'Sarah Johnson',
      duration: '1:23',
      sentiment: 'urgent',
      transcript: 'Urgent update needed on the client proposal. We need to revise the pricing section ASAP and send it out by end of day. This is critical for closing the deal.',
      actionItems: ['Revise pricing section', 'Send proposal by EOD', 'Close deal'],
      language: 'English'
    },
    {
      id: 'voice_003',
      sender: 'Mike Chen',
      duration: '0:32',
      sentiment: 'positive',
      transcript: 'Great news! The client loved our presentation and wants to move forward. Happy to discuss next steps whenever you\'re available.',
      actionItems: ['Discuss next steps'],
      language: 'English'
    }
  ];

  const videoMessages = [
    {
      id: 'video_001',
      sender: 'Emily Davis',
      duration: '3:15',
      sentiment: 'positive',
      transcript: 'I\'ve created a quick walkthrough of the new feature implementation. As you can see in the demo, the workflow is now streamlined...',
      visualElements: ['presentation slides', 'screen recording', 'demonstration'],
      keyFrames: 18,
      language: 'English'
    },
    {
      id: 'video_002',
      sender: 'Alex Rodriguez',
      duration: '5:42',
      sentiment: 'neutral',
      transcript: 'Let me show you how to configure the integration. First, navigate to settings, then select the API tab...',
      visualElements: ['tutorial', 'screen recording', 'code examples'],
      keyFrames: 34,
      language: 'English'
    }
  ];

  const analytics = {
    totalMessages: 47,
    voiceMessages: 28,
    videoMessages: 19,
    totalVoiceDuration: '2h 15m',
    totalVideoDuration: '1h 47m',
    languagesDetected: 5,
    actionItemsExtracted: 89,
    sentimentBreakdown: {
      positive: 65,
      neutral: 25,
      negative: 7,
      urgent: 3
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-4">
            🎙️ V88: Voice & Video Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Voice & Video
            <span className="block text-purple-400 mt-2">Email Intelligence</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Transcribe voice messages, process video emails, generate voice responses, 
            and get unified analytics across all communication modalities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.totalMessages}</div>
            <div className="text-white font-semibold mb-1">Total Messages</div>
            <div className="text-slate-400 text-sm">Voice + Video</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.totalVoiceDuration}</div>
            <div className="text-white font-semibold mb-1">Voice Duration</div>
            <div className="text-slate-400 text-sm">{analytics.voiceMessages} messages</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.totalVideoDuration}</div>
            <div className="text-white font-semibold mb-1">Video Duration</div>
            <div className="text-slate-400 text-sm">{analytics.videoMessages} messages</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.actionItemsExtracted}</div>
            <div className="text-white font-semibold mb-1">Action Items</div>
            <div className="text-slate-400 text-sm">Auto-extracted</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: 'voice', label: '🎙️ Voice Messages', count: voiceMessages.length },
            { id: 'video', label: '🎥 Video Messages', count: videoMessages.length },
            { id: 'analytics', label: '📊 Analytics', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
              {tab.count !== null && <span className="ml-2 text-xs opacity-75">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Voice Messages Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            {voiceMessages.map((msg, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-bold">{msg.sender}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.sentiment === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        msg.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {msg.sentiment}
                      </span>
                      <span className="text-slate-400 text-sm">{msg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => { setIsPlaying(!isPlaying); setCurrentMessage(msg); }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                      </button>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" 
                             style={{ width: isPlaying ? '60%' : '0%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                  <div className="text-purple-400 text-sm font-semibold mb-2">📝 Transcript:</div>
                  <p className="text-slate-300 text-sm">{msg.transcript}</p>
                </div>

                {msg.actionItems.length > 0 && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-sm font-semibold mb-2">✅ Action Items:</div>
                    <ul className="space-y-1">
                      {msg.actionItems.map((item, j) => (
                        <li key={j} className="text-slate-300 text-sm flex items-center gap-2">
                          <span className="text-green-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Video Messages Tab */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            {videoMessages.map((msg, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-bold">{msg.sender}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {msg.sentiment}
                      </span>
                      <span className="text-slate-400 text-sm">{msg.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-4 mb-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎥</div>
                    <div className="text-slate-400 text-sm">Video preview</div>
                    <div className="text-purple-400 text-xs mt-2">{msg.keyFrames} key frames extracted</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                  <div className="text-purple-400 text-sm font-semibold mb-2">📝 Transcript:</div>
                  <p className="text-slate-300 text-sm">{msg.transcript}</p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-blue-400 text-sm font-semibold mb-2">👁️ Visual Elements:</div>
                  <div className="flex flex-wrap gap-2">
                    {msg.visualElements.map((element, j) => (
                      <span key={j} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-4">📊 Sentiment Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.sentimentBreakdown).map(([sentiment, percentage]) => (
                    <div key={sentiment}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 capitalize">{sentiment}</span>
                        <span className="text-purple-400 font-semibold">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            sentiment === 'positive' ? 'bg-green-500' :
                            sentiment === 'urgent' ? 'bg-red-500' :
                            sentiment === 'negative' ? 'bg-orange-500' :
                            'bg-slate-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-4">🌍 Language Support</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Portuguese', 'Italian', 'Arabic', 'Hindi'].map((lang, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-2xl">
                        {lang === 'English' ? '🇺🇸' :
                         lang === 'Spanish' ? '🇪🇸' :
                         lang === 'French' ? '🇫🇷' :
                         lang === 'German' ? '🇩🇪' :
                         lang === 'Chinese' ? '🇨🇳' :
                         lang === 'Japanese' ? '🇯🇵' :
                         lang === 'Portuguese' ? '🇵🇹' :
                         lang === 'Italian' ? '🇮🇹' :
                         lang === 'Arabic' ? '🇸🇦' :
                         lang === 'Hindi' ? '🇮🇳' : '🌐'}
                      </span>
                      <span className="text-slate-300 text-sm">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">♿ Accessibility Features</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-white font-semibold mb-1">Transcripts</div>
                  <div className="text-slate-400 text-sm">Full text transcripts for all voice and video messages</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl mb-2">💬</div>
                  <div className="text-white font-semibold mb-1">Captions</div>
                  <div className="text-slate-400 text-sm">Auto-generated captions in SRT format</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl mb-2">🔊</div>
                  <div className="text-white font-semibold mb-1">Audio Descriptions</div>
                  <div className="text-slate-400 text-sm">Visual content descriptions for visually impaired users</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Process Voice & Video Emails?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get AI-powered transcription, analysis, and accessibility features for all your multimedia communications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:kleber@ziontechgroup.com?subject=V88%20Voice%20%26%20Video%20Intelligence%20Demo"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30"
              >
                🎙️ Request Demo
              </a>
              <a
                href="tel:+130****0950"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all border border-slate-700"
              >
                📞 Call +1 302 464 0950
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
