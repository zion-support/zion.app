'use client';

import { useState, useEffect } from 'react';

interface InnovationIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'proposed' | 'selected' | 'implemented' | 'completed';
  impact: 'high' | 'medium' | 'low';
  aiRecommendation: string;
}

export default function AutonomousInnovationEngine() {
  const [ideas, setIdeas] = useState<InnovationIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Predefined pool of innovative ideas
  const ideaPool: InnovationIdea[] = [
    {
      id: '1',
      title: 'AI Content Idea Generator',
      description: 'Automated generation of SEO-optimized content ideas based on trending topics and audience behavior.',
      category: 'content',
      status: 'implemented',
      impact: 'high',
      aiRecommendation: 'Implement with personalized content strategies tailored to user segments.'
    },
    {
      id: '2',
      title: 'Real-time Analytics Dashboard',
      description: 'Live visualization of user interactions, conversion metrics, and engagement patterns.',
      category: 'analytics',
      status: 'implemented',
      impact: 'high',
      aiRecommendation: 'Enhance with predictive churn modeling and personalized recommendations.'
    },
    {
      id: '3',
      title: 'Automated SEO Optimizer',
      description: 'Continuous analysis and optimization of page SEO elements based on search engine algorithm updates.',
      category: 'seo',
      status: 'proposed',
      impact: 'medium',
      aiRecommendation: 'Integrate with AI-driven keyword clustering and semantic relevance scoring.'
    },
    {
      id: '4',
      title: 'AI-Powered Personalization Engine',
      description: 'Dynamic content personalization using user behavior patterns and machine learning.',
      category: 'personalization',
      status: 'proposed',
      impact: 'high',
      aiRecommendation: 'Implement phased rollout starting with high-traffic pages.'
    },
    {
      id: '5',
      title: 'Automated Testing Pipeline',
      description: 'Self-healing test generation and execution for web applications.',
      category: 'testing',
      status: 'proposed',
      impact: 'high',
      aiRecommendation: 'Integrate with CI/CD to auto-generate regression tests based on code changes.'
    },
    {
      id: '6',
      title: 'Smart Design System Generator',
      description: 'AI-guided creation of design tokens, components, and accessibility standards.',
      category: 'design',
      status: 'proposed',
      impact: 'medium',
      aiRecommendation: 'Build with accessibility-first principles and documentation.'
    }
  ];

  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  const analyzeIdea = async (ideaId: string) => {
    if (!ideaId) return;
    
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      const responses = [
        `AI Analysis: ${idea.title} stands to deliver significant value through ${idea.category} enhancements.`,
        `Recommendation: Prioritize implementation of ${idea.title} as it aligns with strategic goals.`,
        `${idea.aiRecommendation} This could increase engagement by 15-25% according to our models.`,
        `Impact Assessment: High potential for user satisfaction improvement.`
      ];
      
      setAISuggestions(responses);
    }
    
    setLoading(false);
  };

  const markAsImplemented = (ideaId: string) => {
    setIdeas(prev => prev.map(i => 
      i.id === ideaId ? {...i, status: 'implemented'} : i
    ));
    setAISuggestions([]);
  };

  const filteredIdeas = ideas.filter(idea => 
    searchTerm === '' || 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select a random idea weekly (simulated)
  useEffect(() => {
    const intervals = [7, 14, 21, 28, 30, 45, 60, 90];
    let nextCheck = Date.now();
    
    intervals.forEach(interval => {
      nextCheck += interval * 24 * 60 * 60 * 1000;
      setTimeout(() => {
        if (Math.random() > 0.3) {
          const remaining = ideas.filter(i => i.status === 'proposed');
          const nextIdea = remaining[Math.floor(Math.random() * remaining.length)];
          if (nextIdea) {
            proposeIdea(nextIdea.id);
          }
        }
      }, nextCheck - Date.now());
    });
  }, []);

  const proposeIdea = async (ideaId: string) => {
    // Simulate selection process
    const idea = ideas.find(i => i.id === ideaId);
    if (idea && idea.status === 'proposed') {
      const updatedIdeas = [...ideas, {...idea, status: 'selected'}];
      setIdeas(updatedIdeas);
      analyzeIdea(ideaId);
    }
  };

  const getPriorityColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Innovation Engine</h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous generation and selection of high-impact product innovations
          </p>
        </div>
        <div className="text-right flex items-center space-x-2">
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
              disabled={!searchTerm}
            >
              Clear
            </button>
          </div>
          <button
            onClick={() => loading ? '' : 'Auto-select idea'
            }
            disabled={loading || !searchTerm}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            onClick={() => Math.random() > 0.5 ? proposeIdea(ideaPool[Math.floor(Math.random() * ideaPool.length)].id) : proposeIdea(selectedIdeaId || ideaPool[0].id)}
          >
            {loading ? '🤖 Analyzing...' : '🚀 Auto-Select Idea'}
          </button>
        </div>
      </div>

      {/* Idea Selection & Analysis */}
      {loading ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🤖</span>
              <div>
                <div className="text-blue-600 font-medium">AI is thinking...</div>
                <div className="text-xs text-blue-500 mt-1">Suggesting innovations... {'.'.repeat(Math.floor(Date.now() / 200) % 4)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {selectedIdeaId && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="flex flex-col space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Analyzing: {ideaPool.find(i => i.id === selectedIdeaId)?.title || 'Selected Idea'}</p>
                  <p className="text-sm text-blue-600">{aiSuggestions.slice(0, 1)[0]}</p>
                </div>
              </div>
            </div>
          )}

          {ideas.map(idea => (
            <div
              key={idea.id}
              className="border rounded-lg p-4 mb-2 hover:shadow-md transition"
              onClick={() => selectedIdeaId === idea.id ? setSelectedIdeaId(null) : setSelectedIdeaId(idea.id)}
              className="cursor-pointer"
            >
              <div className="flex flex-col space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{idea.title}</h3>
                <p className="text-sm text-slate-700 italic">{idea.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(idea.impact)} uppercase text-xs`}>
                    {idea.impact.toUpperCase()}
                  </span>
                  <span className="text-sm opacity-70">· {idea.category}</span>
                </div>
                <span className="flex items-center items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {idea.status === 'proposed' ? '⏳ Proposed' : idea.status === 'selected' ? '🎯 Selected' : idea.status === 'implemented' ? '✅ Implemented' : '✔️ Completed'}
                </span>
              </div>
            </div>
          ))}

          {ideas.some(i => i.status === 'selected') && selectedIdeaId && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800">AI-Powered Innovation Recommendation</h3>
                  <div className="mt-1 text-sm text-blue-700">{aiSuggestions?.join('\n') || 'Waiting for analysis...'}</div>
                  <button
                    onClick={() => markAsImplemented(selectedIdeaId!)}
                    className="mt-2 text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Implement Now
                  </button>
                </div>
              </div>
            </div>
          }))
        </>
      )}

      {/* Predefined Idea Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
        {ideaPool.slice(0, 9).map((idea, index) => (
          <div key={idea.id} className="rounded-xl border border-slate-200 hover:shadow-lg transition">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-2">
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mt-2">{idea.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{idea.description}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-medium ${getPriorityColor(idea.impact)}`}>
              Impact: {idea.impact}
            </span>
          </div>
        ))}
      </div>

      {/* AI Intelligence Panel */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 animate-pulse">
        <div className="flex just-between">
          <h3 className="font-semibold text-indigo-900 mb-1">🤖 AI Innovation Intelligence</h3>
          <span className="text-sm text-indigo-700">{loading ? 'Analyzing ideas...' : 'Ready for implementation'} </span>
        </div>
        <p className="text-sm text-indigo-800">
          Our AI continuously scans the product landscape, identifies emerging opportunities, 
          and autonomously suggests high-impact innovations aligned with strategic goals.
        </p>
      </div>

      {/* Implementation Progress Metrics */}
      <div className="mt-6 rounding-lg bg-gradient-to-r from-green-50 to-emerald-50 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-green-700">
              📊 Progress Summary
            </p>
            <p className="text-2xl font-bold text-green-800 mt-1">{Math.round((ideas.filter(i => i.status === 'implemented').length / ideaPool.length) * 100)}%</p>
            <p className="text-sm text-green-600">Features Implemented Out of Total</p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="rounded-full h-6 bg-gray-200">
              <div className="rounded-full h-6 bg-green-500" style={{ width: `${Math.round((ideas.filter(i => i.status === 'implemented').length / ideaPool.length) * 100)}%` }}></div>
            </div>
            <p className="text-xs text-green-600">Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}