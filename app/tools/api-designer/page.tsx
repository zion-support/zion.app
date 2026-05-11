'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Trash2, Play, Sparkles, Code } from 'lucide-react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  params: { name: string; type: string; required: boolean }[];
  body?: string;
}

interface APIDesign {
  name: string;
  version: string;
  baseUrl: string;
  endpoints: Endpoint[];
}

export default function APIDesigner() {
  const [api, setAPI] = useState<APIDesign>({
    name: 'My API',
    version: '1.0.0',
    baseUrl: 'https://api.example.com',
    endpoints: [
      {
        id: '1',
        method: 'GET',
        path: '/users',
        description: 'Get all users',
        params: [
          { name: 'limit', type: 'number', required: false },
          { name: 'offset', type: 'number', required: false }
        ]
      },
      {
        id: '2',
        method: 'POST',
        path: '/users',
        description: 'Create a new user',
        params: [],
        body: '{\n  "name": "string",\n  "email": "string"\n}'
      }
    ]
  });
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('1');

  const addEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: Date.now().toString(),
      method: 'GET',
      path: '/new-endpoint',
      description: 'New endpoint',
      params: []
    };
    setAPI({ ...api, endpoints: [...api.endpoints, newEndpoint] });
    setSelectedEndpoint(newEndpoint.id);
  };

  const removeEndpoint = (id: string) => {
    setAPI({ ...api, endpoints: api.endpoints.filter(e => e.id !== id) });
    if (selectedEndpoint === id) {
      setSelectedEndpoint(api.endpoints[0]?.id || '');
    }
  };

  const updateEndpoint = (id: string, updates: Partial<Endpoint>) => {
    setAPI({
      ...api,
      endpoints: api.endpoints.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-500/20 text-green-400 border-green-500/30',
      POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
      PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[method] || 'bg-slate-500/20 text-slate-400';
  };

  const selected = api.endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            API{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Designer
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Design, document, and test your APIs visually. 
            Generate OpenAPI specs and test endpoints.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Endpoints List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Endpoints</h3>
              <button
                onClick={addEndpoint}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-400" />
              </button>
            </div>
            <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
              {api.endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className={`flex items-center gap-1 p-2 transition-colors ${
                    selectedEndpoint === endpoint.id
                      ? 'bg-blue-600/20 border-l-2 border-blue-500'
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className="flex-1 p-1 text-left flex items-center gap-3 min-w-0"
                  >
                    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-white text-sm truncate">{endpoint.path}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEndpoint(endpoint.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg shrink-0"
                    aria-label="Remove endpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Endpoint Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            {selected ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <select
                    value={selected.method}
                    onChange={(e) =>
                      updateEndpoint(selected.id, { method: e.target.value as Endpoint['method'] })
                    }
                    className={`px-3 py-2 rounded-lg border ${getMethodColor(selected.method)}`}
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    <option>PATCH</option>
                  </select>
                  <input
                    type="text"
                    value={selected.path}
                    onChange={(e) => updateEndpoint(selected.id, { path: e.target.value })}
                    className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm mb-2 block">Description</label>
                  <input
                    type="text"
                    value={selected.description}
                    onChange={(e) => updateEndpoint(selected.id, { description: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-sm mb-2 block">Parameters</label>
                  <div className="space-y-2">
                    {selected.params.map((param, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={param.name}
                          placeholder="Name"
                          className="flex-1 bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
                        />
                        <select className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm">
                          <option>string</option>
                          <option>number</option>
                          <option>boolean</option>
                        </select>
                        <button className="p-2 text-red-400 hover:bg-slate-700 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Parameter
                    </button>
                  </div>
                </div>

                {selected.method !== 'GET' && (
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Request Body</label>
                    <textarea
                      value={selected.body || ''}
                      onChange={(e) => updateEndpoint(selected.id, { body: e.target.value })}
                      placeholder='{"key": "value"}'
                      className="w-full h-32 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Test Endpoint
                  </button>
                  <button
                    type="button"
                    className="py-2 px-4 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <Code className="w-4 h-4" /> Generate OpenAPI
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an endpoint to edit</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}