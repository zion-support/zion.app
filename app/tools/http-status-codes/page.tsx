'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, AlertTriangle, XCircle, Info, Copy } from 'lucide-react';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

const statusCodes: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: '1xx' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.', category: '1xx' },
  { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.', category: '1xx' },
  // 2xx Success
  { code: 200, name: 'OK', description: 'The request has succeeded.', category: '2xx' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and resulted in a new resource being created.', category: '2xx' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.', category: '2xx' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request and is not returning any content.', category: '2xx' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.', category: '2xx' },
  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.', category: '3xx' },
  { code: 302, name: 'Found', description: 'The URI of the requested resource has been changed temporarily.', category: '3xx' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the version specified by the request headers.', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', description: 'The request should be repeated with another URI but future requests should still use the original URI.', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI.', category: '3xx' },
  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'The server cannot or will not process the request due to something perceived to be a client error.', category: '4xx' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not yet been provided.', category: '4xx' },
  { code: 403, name: 'Forbidden', description: 'The request was valid, but the server is refusing action. The user might not have permissions.', category: '4xx' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found but may be available in the future.', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.', category: '4xx' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', category: '4xx' },
  { code: 409, name: 'Conflict', description: 'The request could not be processed because of conflict in the current state of the resource.', category: '4xx' },
  { code: 413, name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process.', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type which the server or resource does not support.', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.', category: '4xx' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time ("rate limiting").', category: '4xx' },
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'A generic error message, given when an unexpected condition was encountered.', category: '5xx' },
  { code: 501, name: 'Not Implemented', description: 'The server either does not recognize the request method, or it lacks the ability to fulfil the request.', category: '5xx' },
  { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.', category: '5xx' },
  { code: 503, name: 'Service Unavailable', description: 'The server cannot handle the request (because it is overloaded or down for maintenance).', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.', category: '5xx' },
];

export default function HttpStatusCodes() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const filteredCodes = statusCodes.filter(code => {
    const matchesSearch = search === '' || 
      code.code.toString().includes(search) || 
      code.name.toLowerCase().includes(search.toLowerCase()) ||
      code.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '1xx': return 'bg-blue-500/20 text-blue-400';
      case '2xx': return 'bg-green-500/20 text-green-400';
      case '3xx': return 'bg-yellow-500/20 text-yellow-400';
      case '4xx': return 'bg-orange-500/20 text-orange-400';
      case '5xx': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '1xx': return <Info className="w-4 h-4" />;
      case '2xx': return <CheckCircle className="w-4 h-4" />;
      case '3xx': return <Info className="w-4 h-4" />;
      case '4xx': return <AlertTriangle className="w-4 h-4" />;
      case '5xx': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const copyCode = (code: number) => {
    navigator.clipboard.writeText(code.toString());
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
            <Info className="w-4 h-4" />
            <span>Free Reference</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            HTTP Status{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Code Reference
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Complete reference guide for HTTP status codes. Quick lookup with descriptions and explanations.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, name, or description..."
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', '1xx', '2xx', '3xx', '4xx', '5xx'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Codes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Codes Grid */}
        <div className="grid gap-3">
          {filteredCodes.map((code) => (
            <motion.div
              key={code.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(code.category)}`}>
                    {getCategoryIcon(code.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">{code.code}</span>
                      <span className="text-white font-medium">{code.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(code.category)}`}>
                        {code.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{code.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyCode(code.code)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {copiedCode === code.code ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No status codes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}