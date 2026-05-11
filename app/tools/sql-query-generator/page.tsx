'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Copy, Download, 
  RefreshCw, Sparkles,
  Table
} from 'lucide-react';

type DatabaseType = 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';

interface QueryOptions {
  database: DatabaseType;
  includeComments: boolean;
  useAliases: boolean;
  addLimit: boolean;
  useCTE: boolean;
}

export default function SQLQueryGenerator() {
  const [description, setDescription] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<QueryOptions>({
    database: 'postgresql',
    includeComments: true,
    useAliases: true,
    addLimit: true,
    useCTE: false,
  });

  const generateQuery = () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI query generation
    setTimeout(() => {
      const queries: Record<string, string> = {
        postgresql: `-- ${description}\nSELECT \n  u.id,\n  u.name,\n  u.email,\n  COUNT(o.id) AS order_count,\n  SUM(o.total) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(o.id) > 0\nORDER BY total_spent DESC\nLIMIT 100;`,
        
        mysql: `-- ${description}\nSELECT \n  u.id,\n  u.name,\n  u.email,\n  COUNT(o.id) AS order_count,\n  SUM(o.total) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(o.id) > 0\nORDER BY total_spent DESC\nLIMIT 100;`,
        
        sqlite: `-- ${description}\nSELECT \n  u.id,\n  u.name,\n  u.email,\n  COUNT(o.id) AS order_count,\n  SUM(o.total) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= DATE('now', '-30 days')\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(o.id) > 0\nORDER BY total_spent DESC\nLIMIT 100;`,
        
        mongodb: `// ${description}\ndb.users.aggregate([\n  {\n    $match: {\n      created_at: {\n        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)\n      }\n    }\n  },\n  {\n    $lookup: {\n      from: "orders",\n      localField: "id",\n      foreignField: "user_id",\n      as: "orders"\n    }\n  },\n  {\n    $addFields: {\n      order_count: { $size: "$orders" },\n      total_spent: { $sum: "$orders.total" }\n    }\n  },\n  {\n    $match: { order_count: { $gt: 0 } }\n  },\n  {\n    $sort: { total_spent: -1 }\n  },\n  {\n    $limit: 100\n  }\n]);`,
      };
      
      setGeneratedQuery(queries[options.database] || queries.postgresql);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQuery);
  };

  const downloadQuery = () => {
    const blob = new Blob([generatedQuery], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-${Date.now()}.sql`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-600/20 text-amber-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            SQL Query{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Describe what you want to get from your database in plain English, 
            and AI will generate the SQL query for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Describe Your Query
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Get all users who placed orders in the last 30 days with their total spending..."
                className="w-full h-48 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-sm"
              />

              <div>
                <label className="text-slate-400 text-sm mb-2 block">Database Type</label>
                <select
                  value={options.database}
                  onChange={(e) => setOptions({ ...options, database: e.target.value as DatabaseType })}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>

              <button
                onClick={generateQuery}
                disabled={!description.trim() || isGenerating}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Query
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Table className="w-5 h-5 text-violet-400" />
                Generated SQL
              </h3>
              {generatedQuery && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadQuery}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              {generatedQuery ? (
                <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                  {generatedQuery}
                </pre>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generated SQL will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Examples */}
            {generatedQuery && (
              <div className="p-4 border-t border-slate-700">
                <h4 className="text-slate-400 text-sm mb-3">Try these examples:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Find top 10 customers by revenue',
                    'Get orders from last week',
                    'List inactive users since 2024',
                    'Count orders by status'
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => { setDescription(example); generateQuery(); }}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}