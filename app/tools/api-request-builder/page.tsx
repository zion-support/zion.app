'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Trash2, Copy, ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestState {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  authType: 'none' | 'bearer' | 'basic' | 'apikey';
  authToken: string;
  basicUser: string;
  basicPass: string;
  apiKeyName: string;
  apiKeyValue: string;
  apiKeyIn: 'header' | 'query';
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'from-emerald-500 to-green-600',
  POST: 'from-amber-500 to-orange-600',
  PUT: 'from-blue-500 to-indigo-600',
  PATCH: 'from-violet-500 to-purple-600',
  DELETE: 'from-red-500 to-rose-600',
  HEAD: 'from-slate-500 to-gray-600',
  OPTIONS: 'from-cyan-500 to-teal-600',
};

const SAMPLE_BODY = `{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer"
}`;

export default function APIRequestBuilder() {
  const [req, setReq] = useState<RequestState>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [
      { key: 'Content-Type', value: 'application/json', enabled: true },
      { key: 'Accept', value: 'application/json', enabled: true },
    ],
    body: '',
    authType: 'none',
    authToken: '',
    basicUser: '',
    basicPass: '',
    apiKeyName: 'X-API-Key',
    apiKeyValue: '',
    apiKeyIn: 'header',
  });
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'auth'>('headers');
  const [respTab, setRespTab] = useState<'body' | 'headers' | 'timeline'>('body');
  const [expandedSections, setExpandedSections] = useState({ headers: true, body: true, auth: false });
  const [history, setHistory] = useState<Array<{ method: HttpMethod; url: string; status: number; time: number }>>([]);

  const addHeader = () => {
    setReq(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '', enabled: true }],
    }));
  };

  const removeHeader = (index: number) => {
    setReq(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
    }));
  };

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setReq(prev => ({
      ...prev,
      headers: prev.headers.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    }));
  };

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    req.headers.filter(h => h.enabled && h.key.trim()).forEach(h => {
      headers[h.key.trim()] = h.value;
    });

    if (req.authType === 'bearer' && req.authToken) {
      headers['Authorization'] = `Bearer ${req.authToken}`;
    } else if (req.authType === 'basic' && req.basicUser) {
      headers['Authorization'] = `Basic ${btoa(`${req.basicUser}:${req.basicPass}`)}`;
    } else if (req.authType === 'apikey' && req.apiKeyIn === 'header' && req.apiKeyName) {
      headers[req.apiKeyName] = req.apiKeyValue;
    }

    return headers;
  };

  const sendRequest = useCallback(async () => {
    if (!req.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    const startTime = performance.now();

    try {
      let url = req.url.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      if (req.authType === 'apikey' && req.apiKeyIn === 'query' && req.apiKeyName && req.apiKeyValue) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}${encodeURIComponent(req.apiKeyName)}=${encodeURIComponent(req.apiKeyValue)}`;
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers: buildHeaders(),
        mode: 'cors',
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        fetchOptions.body = req.body;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch {
        bodyText = '(unable to read response body)';
      }

      const responseData: ResponseData = {
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        body: bodyText,
        time: elapsed,
        size: new Blob([bodyText]).size,
      };

      setResponse(responseData);
      setHistory(prev => [
        { method: req.method, url: req.url, status: res.status, time: elapsed },
        ...prev.slice(0, 19),
      ]);
    } catch (err) {
      const endTime = performance.now();
      setError(err instanceof Error ? err.message : 'Request failed');
      setHistory(prev => [
        { method: req.method, url: req.url, status: 0, time: Math.round(endTime - startTime) },
        ...prev.slice(0, 19),
      ]);
    } finally {
      setLoading(false);
    }
  }, [req]);

  const copyResponse = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body);
    }
  };

  const formatBody = () => {
    try {
      const parsed = JSON.parse(req.body);
      setReq(prev => ({ ...prev, body: JSON.stringify(parsed, null, 2) }));
    } catch {
      // not JSON, leave as-is
    }
  };

  const loadSampleBody = () => {
    setReq(prev => ({ ...prev, body: SAMPLE_BODY }));
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 300 && status < 400) return 'text-amber-400';
    if (status >= 400 && status < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatResponse = (body: string) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm mb-4">
            <Send className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            API Request{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Build, test, and debug HTTP requests with full control over headers, body, authentication, and more.
            View formatted responses with timing and size metrics.
          </p>
        </motion.div>

        {/* Request Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden mb-6"
        >
          {/* URL Bar */}
          <div className="p-4 border-b border-slate-700 flex gap-3">
            <select
              value={req.method}
              onChange={e => setReq(prev => ({ ...prev, method: e.target.value as HttpMethod }))}
              className={`bg-gradient-to-r ${METHOD_COLORS[req.method]} text-white font-bold text-sm px-3 py-2.5 rounded-lg border-0 cursor-pointer min-w-[100px]`}
            >
              {METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="text"
              value={req.url}
              onChange={e => setReq(prev => ({ ...prev, url: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && sendRequest()}
              placeholder="Enter request URL..."
              className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
            />
            <button
              onClick={sendRequest}
              disabled={loading}
              className={`bg-gradient-to-r ${METHOD_COLORS[req.method]} text-white font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            {(['headers', 'body', 'auth'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setExpandedSections(prev => ({ ...prev, [tab]: true }));
                }}
                className={`px-5 py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab === 'headers' && `Headers (${req.headers.filter(h => h.enabled).length})`}
                {tab === 'body' && 'Body'}
                {tab === 'auth' && 'Auth'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'headers' && (
              <div className="space-y-2">
                {req.headers.map((header, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={e => updateHeader(i, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={e => updateHeader(i, 'key', e.target.value)}
                      placeholder="Header name"
                      className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={e => updateHeader(i, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                    />
                    <button
                      onClick={() => removeHeader(i)}
                      className="text-slate-500 hover:text-red-400 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addHeader}
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition mt-2"
                >
                  <Plus className="w-4 h-4" /> Add Header
                </button>
              </div>
            )}

            {activeTab === 'body' && (
              <div>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={loadSampleBody}
                    className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-600 transition"
                  >
                    Load Sample JSON
                  </button>
                  <button
                    onClick={formatBody}
                    className="text-xs bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-600 transition"
                  >
                    Format JSON
                  </button>
                </div>
                <textarea
                  value={req.body}
                  onChange={e => setReq(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Request body (JSON, form data, etc.)"
                  className="w-full h-48 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 resize-y"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Body is sent with POST, PUT, and PATCH requests. Size: {new Blob([req.body]).size} bytes
                </p>
              </div>
            )}

            {activeTab === 'auth' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['none', 'bearer', 'basic', 'apikey'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setReq(prev => ({ ...prev, authType: type }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        req.authType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {type === 'none' ? 'No Auth' : type === 'bearer' ? 'Bearer Token' : type === 'basic' ? 'Basic Auth' : 'API Key'}
                    </button>
                  ))}
                </div>

                {req.authType === 'bearer' && (
                  <input
                    type="text"
                    value={req.authToken}
                    onChange={e => setReq(prev => ({ ...prev, authToken: e.target.value }))}
                    placeholder="Enter bearer token..."
                    className="w-full bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  />
                )}

                {req.authType === 'basic' && (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={req.basicUser}
                      onChange={e => setReq(prev => ({ ...prev, basicUser: e.target.value }))}
                      placeholder="Username"
                      className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                    />
                    <input
                      type="password"
                      value={req.basicPass}
                      onChange={e => setReq(prev => ({ ...prev, basicPass: e.target.value }))}
                      placeholder="Password"
                      className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                    />
                  </div>
                )}

                {req.authType === 'apikey' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReq(prev => ({ ...prev, apiKeyIn: 'header' }))}
                        className={`px-3 py-1.5 rounded text-xs font-medium ${
                          req.apiKeyIn === 'header' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        In Header
                      </button>
                      <button
                        onClick={() => setReq(prev => ({ ...prev, apiKeyIn: 'query' }))}
                        className={`px-3 py-1.5 rounded text-xs font-medium ${
                          req.apiKeyIn === 'query' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        In Query String
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={req.apiKeyName}
                        onChange={e => setReq(prev => ({ ...prev, apiKeyName: e.target.value }))}
                        placeholder="Key name"
                        className="flex-1 bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                      />
                      <input
                        type="text"
                        value={req.apiKeyValue}
                        onChange={e => setReq(prev => ({ ...prev, apiKeyValue: e.target.value }))}
                        placeholder="API key value"
                        className="flex-[2] bg-slate-900/50 text-white border border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
            >
              {/* Response Header */}
              <div className="p-4 border-b border-slate-700 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <span className={`text-lg font-bold ${getStatusColor(response.status)}`}>
                    {response.status}
                  </span>
                  <span className="text-slate-400 text-sm">{response.statusText}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {response.time}ms
                </div>
                <div className="text-slate-400 text-sm">
                  {formatSize(response.size)}
                </div>
                <button
                  onClick={copyResponse}
                  className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>

              {/* Response Tabs */}
              <div className="flex border-b border-slate-700">
                {(['body', 'headers'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRespTab(tab)}
                    className={`px-5 py-3 text-sm font-medium transition ${
                      respTab === tab
                        ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {tab === 'body' ? 'Response Body' : `Headers (${Object.keys(response.headers).length})`}
                  </button>
                ))}
              </div>

              {/* Response Content */}
              <div className="p-4">
                {respTab === 'body' && (
                  <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 font-mono overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap break-words">
                    {formatResponse(response.body)}
                  </pre>
                )}
                {respTab === 'headers' && (
                  <div className="space-y-1">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="flex gap-3 py-1.5 border-b border-slate-700/50">
                        <span className="text-sm font-medium text-indigo-300 min-w-[200px]">{key}</span>
                        <span className="text-sm text-slate-400 break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300">Request History</h3>
            </div>
            <div className="divide-y divide-slate-700/50">
              {history.slice(0, 10).map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setReq(prev => ({ ...prev, method: h.method, url: h.url }));
                  }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-700/30 transition"
                >
                  <span className={`text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r ${METHOD_COLORS[h.method]} text-white`}>
                    {h.method}
                  </span>
                  <span className="text-sm text-slate-400 truncate flex-1">{h.url}</span>
                  <span className={`text-xs font-mono ${h.status === 0 ? 'text-red-400' : getStatusColor(h.status)}`}>
                    {h.status || 'ERR'}
                  </span>
                  <span className="text-xs text-slate-500">{h.time}ms</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Keyboard hint */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Press <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-400">Enter</kbd> in the URL bar to send the request
        </p>
      </div>
    </div>
  );
}
