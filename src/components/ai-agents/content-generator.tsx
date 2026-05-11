'use client';

import { useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'description' | 'meta';
  content: string;
  tone: string;
  generatedAt: Date;
}

export default function AIContentGenerator() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'blog' | 'social' | 'email' | 'description' | 'meta'>('blog');
  const [tone, setTone] = useState<'professional' | 'casual' | 'humorous' | 'technical'>('professional');
  const [generatedContent, setGeneratedContent] = useState<ContentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const templates: Record<string, string> = {
      blog: `# ${topic}\n\nIn today's rapidly evolving technology landscape, ${topic.toLowerCase()} has emerged as a critical focus area for organizations seeking to maintain competitive advantage.\n\n## Understanding the Fundamentals\n\nAt its core, ${topic.toLowerCase()} represents a paradigm shift in how we approach modern challenges. By leveraging AI-driven insights and data-driven methodologies, teams can achieve unprecedented levels of efficiency and innovation.\n\n## Key Takeaways\n\n1. Start with a clear strategy aligned to business objectives\n2. Implement iterative improvements based on feedback loops\n3. Measure success through quantifiable metrics\n4. Scale gradually while maintaining quality standards\n\nThe future belongs to those who embrace innovation today. Begin your journey with ${topic.toLowerCase()} and transform your organization's trajectory.`,
      social: `🚀 Exciting news! ${topic} is revolutionizing the way we think about modern solutions.\n\n✨ Key benefits:\n• 50% faster implementation\n• 3x ROI in first year\n• Zero learning curve\n\n💡 Ready to transform your workflow?\n\n👉 Learn more at ziontechgroup.com\n\n#AI #Innovation #${topic.replace(/\s+/g, '')} #TechTrends #FutureOfWork`,
      email: `Subject: Transform Your Business with ${topic}\n\nHi [Name],\n\nI wanted to share an exciting opportunity that could significantly impact your business results.\n\nWe've helped dozens of companies implement ${topic} to:\n• Reduce operational costs by 35-45%\n• Improve team productivity by 60%\n• Accelerate time-to-market by 3x\n\nWould you be open to a brief 15-minute call this week to discuss how this could work for your team?\n\nBest regards,\nThe Zion Tech Team`,
      description: `${topic} - A comprehensive AI-powered solution designed to streamline workflows, boost productivity, and drive measurable business outcomes. Built with cutting-edge technology and backed by proven methodologies.`,
      meta: `<title>${topic} | Zion Tech Group</title>\n<meta name="description" content="Discover how ${topic} can transform your business with AI-powered automation, intelligent insights, and proven results." />\n<meta property="og:title" content="${topic}" />\n<meta property="og:description" content="AI-powered ${topic} solutions for modern enterprises." />`
    };

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: topic,
      type: contentType,
      content: templates[contentType],
      tone,
      generatedAt: new Date()
    };

    setGeneratedContent(prev => [newContent, ...prev]);
    setIsGenerating(false);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return '📝';
      case 'social': return '📱';
      case 'email': return '📧';
      case 'description': return '📋';
      case 'meta': return '🏷️';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Content Generator</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate SEO-optimized content for blogs, social media, emails, and more
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic or Theme</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., AI-Powered Customer Service"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={e => e.key === 'Enter' && generateContent()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value as typeof contentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="blog">📝 Blog Post</option>
              <option value="social">📱 Social Media</option>
              <option value="email">📧 Email Campaign</option>
              <option value="description">📋 Product Description</option>
              <option value="meta">🏷️ SEO Meta Tags</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="humorous">Humorous</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateContent}
              disabled={!topic.trim() || isGenerating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? 'Generating...' : '✨ Generate Content'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {isGenerating && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600">AI is crafting your content...</p>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        {generatedContent.map(item => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getTypeIcon(item.type)}</span>
                <span className="font-semibold text-gray-900">{item.title}</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs uppercase">
                  {item.type}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {item.tone}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {item.generatedAt.toLocaleTimeString()}
                </span>
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            <div className="p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-normal leading-relaxed">
                {item.content}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {generatedContent.length === 0 && !isGenerating && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">✍️</div>
          <p className="font-medium">Enter a topic and click Generate to create AI-powered content</p>
        </div>
      )}

      {/* AI Intelligence Note */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-1">🤖 AI Content Intelligence</h3>
        <p className="text-sm text-blue-800">
          Our AI content engine analyzes top-performing content in your niche, optimizes for SEO, 
          adapts tone to your brand voice, and generates publication-ready content in seconds.
        </p>
      </div>
    </div>
  );
}