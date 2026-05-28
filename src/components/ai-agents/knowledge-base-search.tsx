'use client';

import { useState, useEffect, useRef } from 'react';

interface Knowledge {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: string;
}

export default function AIKnowledgeBase() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Knowledge[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const knowledgeBase: Knowledge[] = [
    {
      id: 'kb-001',
      title: 'Getting Started with Zion Tech AI',
      category: 'tutorials',
      content: 'A comprehensive guide to implementing AI solutions from scratch. Includes setup, configuration, and best practices for deploying AI models.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-002',
      title: 'API Reference Complete Guide',
      category: 'api',
      content: 'Full API documentation covering all endpoints, authentication methods, rate limits, and example requests/responses for each service.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-003',
      title: 'Security Best Practices for AI Systems',
      category: 'security',
      content: 'Learn how to secure your AI infrastructure: encryption methods, access control, vulnerability scanning, and compliance frameworks.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-004',
      title: 'Performance Optimization Techniques',
      category: 'performance',
      content: 'Strategies to optimize inference speed, reduce latency, manage resources efficiently, and scale AI workloads.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-005',
      title: 'Deployment Strategies for Machine Learning',
      category: 'deployment',
      content: 'Compare blue-green, canary, and rolling deployments. Set up CI/CD pipelines for AI models with automated testing and rollback.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-006',
      title: 'Cost Optimization in AI Applications',
      category: 'cost',
      content: 'Techniques to reduce infrastructure costs: spot instances, auto-scaling, model quantization, and efficient resource allocation.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-007',
      title: 'Building Autonomous AI Agents',
      category: 'agents',
      content: 'Design and implement self-improving AI agents that can make decisions, learn from feedback, and operate independently.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-008',
      title: 'Data Privacy and Compliance',
      category: 'privacy',
      content: 'Understand GDPR, HIPAA, and other regulations. Implement data anonymization, consent management, and audit trails.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-009',
      title: 'Monitoring and Observability for AI',
      category: 'monitoring',
      content: 'Set up comprehensive monitoring: logs, metrics, traces, alerts, and dashboards to maintain AI system health.',
      lastUpdated: '2024-04-01'
    },
    {
      id: 'kb-010',
      title: 'Edge AI and On-Device Inference',
      category: 'edge',
      content: 'Deploy AI models on edge devices: optimization techniques, hardware considerations, and offline capabilities.',
      lastUpdated: '2024-04-01'
    }
  ];

  const categories = ['all', ...new Set(knowledgeBase.map(k => k.category))];

  useEffect(() => {
    if (search.trim() === '' && selectedCategory === 'all') {
      setResults(knowledgeBase);
    } else {
      performSearch();
    }
  }, [search, selectedCategory]);

  const performSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const filtered = knowledgeBase.filter(item => {
        const matchesSearch = search === '' ||
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.content.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tutorials: 'bg-blue-100 text-blue-800',
      api: 'bg-green-100 text-green-800',
      security: 'bg-red-100 text-red-800',
      performance: 'bg-purple-100 text-purple-800',
      deployment: 'bg-indigo-100 text-indigo-800',
      cost: 'bg-yellow-100 text-yellow-800',
      agents: 'bg-orange-100 text-orange-800',
      privacy: 'bg-pink-100 text-pink-800',
      monitoring: 'bg-teal-100 text-teal-800',
      edge: 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🤖 AI Knowledge Base
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search our comprehensive collection of AI resources, tutorials, documentation, and best practices.
            Everything you need to build and deploy intelligent systems.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the knowledge base..."
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 text-gray-600">
          Found <span className="font-bold text-gray-900">{results.length}</span> resources
          {selectedCategory !== 'all' && (
            <span> in <span className="font-medium capitalize">{selectedCategory}</span></span>
          )}
          {search && (
            <span> matching "<span className="font-medium italic">{search}</span>"</span>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching knowledge base...</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isSearching && results.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">Updated {item.lastUpdated}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {item.content}
              </p>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                  onClick={() => {/* Open full article */}}
                >
                  Read more →
                </button>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    onClick={() => navigator.clipboard.writeText(item.content)}
                  >
                    Copy
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    onClick={() => {/* Save to favorites */}}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isSearching && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse by category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}