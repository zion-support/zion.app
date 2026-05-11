'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Search, BookOpen, AlertCircle, Info, Shield, Zap } from 'lucide-react';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
  rfc: string;
  common: boolean;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: '1xx Informational', rfc: 'RFC 7231 §6.2.1', common: false },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.', category: '1xx Informational', rfc: 'RFC 7231 §6.2.2', common: false },
  { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.', category: '1xx Informational', rfc: 'RFC 2518 §10.1', common: false },
  { code: 103, name: 'Early Hints', description: 'Used to return some response headers before final HTTP message.', category: '1xx Informational', rfc: 'RFC 8297', common: false },

  // 2xx Success
  { code: 200, name: 'OK', description: 'The request succeeded. The meaning depends on the HTTP method: GET (resource fetched), HEAD (headers only), POST (resource created), TRACE (message received).', category: '2xx Success', rfc: 'RFC 7231 §6.3.1', common: true },
  { code: 201, name: 'Created', description: 'The request succeeded and a new resource was created. The new resource is returned in the response body, and its URI in the Location header.', category: '2xx Success', rfc: 'RFC 7231 §6.3.2', common: true },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon.', category: '2xx Success', rfc: 'RFC 7231 §6.3.3', common: true },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request and is not returning any content. Common after successful DELETE or PUT operations.', category: '2xx Success', rfc: 'RFC 7231 §6.3.5', common: true },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client. Used for resumable downloads.', category: '2xx Success', rfc: 'RFC 7233 §4.1', common: true },

  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently. The new URL is given in the Location header. Browsers will redirect automatically.', category: '3xx Redirection', rfc: 'RFC 7231 §6.4.2', common: true },
  { code: 302, name: 'Found', description: 'The URI of requested resource has been changed temporarily. Future requests should still use the original URI. Browsers redirect with the original method.', category: '3xx Redirection', rfc: 'RFC 7231 §6.4.3', common: true },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the version specified by the request headers (If-Modified-Since / If-None-Match). Used for caching.', category: '3xx Redirection', rfc: 'RFC 7232 §4.1', common: true },
  { code: 307, name: 'Temporary Redirect', description: 'The server sends this to direct the client to another URI using the same HTTP method as the original request. Unlike 302, the method must not change.', category: '3xx Redirection', rfc: 'RFC 7231 §6.4.7', common: true },
  { code: 308, name: 'Permanent Redirect', description: 'The resource is now permanently at another URI, specified by the Location header. Like 301, but the HTTP method must not change.', category: '3xx Redirection', rfc: 'RFC 7538 §3', common: true },

  // 4xx Client Errors
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to something perceived to be a client error (malformed syntax, invalid request message framing, or deceptive request routing).', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.1', common: true },
  { code: 401, name: 'Unauthorized', description: 'The client must authenticate itself to get the requested response. The WWW-Authenticate header contains how to authenticate. Despite the name, it means "unauthenticated."', category: '4xx Client Error', rfc: 'RFC 7235 §3.1', common: true },
  { code: 403, name: 'Forbidden', description: 'The client does not have access rights to the content. Unlike 401, the server knows the client\'s identity but refuses to authorize the request.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.3', common: true },
  { code: 404, name: 'Not Found', description: 'The server cannot find the requested resource. This can also mean the resource exists but the server does not want to reveal that information.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.4', common: true },
  { code: 405, name: 'Method Not Allowed', description: 'The request method is known by the server but is not supported by the target resource. The Allow header must list the supported methods.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.5', common: true },
  { code: 408, name: 'Request Timeout', description: 'The server would like to shut down this unused connection. Sent when the server wants to time out a connection that is taking too long.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.7', common: true },
  { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the target resource. Common with PUT when trying to update a resource that has been modified by another request.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.8', common: true },
  { code: 410, name: 'Gone', description: 'The target resource is no longer available and this condition is likely permanent. Unlike 404, this is a permanent condition and search engines will remove the URL from their index.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.9', common: false },
  { code: 413, name: 'Payload Too Large', description: 'The request entity is larger than the server is willing or able to process. The server may close the connection or return a Retry-After header.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.11', common: true },
  { code: 415, name: 'Unsupported Media Type', description: 'The media format of the requested data is not supported by the server. Check the Content-Type header of your request.', category: '4xx Client Error', rfc: 'RFC 7231 §6.5.13', common: true },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors. Common in REST APIs for validation failures.', category: '4xx Client Error', rfc: 'RFC 9110 §15.5.21', common: true },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting). The Retry-After header may indicate when to try again.', category: '4xx Client Error', rfc: 'RFC 6585 §4', common: true },
  { code: 451, name: 'Unavailable For Legal Reasons', description: 'The user requested a resource that is not available for legal reasons, such as a censored page or a government-blocked resource.', category: '4xx Client Error', rfc: 'RFC 7725 §3', common: false },

  // 5xx Server Errors
  { code: 500, name: 'Internal Server Error', description: 'The server has encountered a situation it does not know how to handle. A generic server-side error when no more specific message is suitable.', category: '5xx Server Error', rfc: 'RFC 7231 §6.6.1', common: true },
  { code: 501, name: 'Not Implemented', description: 'The request method is not supported by the server and cannot be handled. Only GET and HEAD are required to be supported by all servers.', category: '5xx Server Error', rfc: 'RFC 7231 §6.6.2', common: true },
  { code: 502, name: 'Bad Gateway', description: 'The server, while working as a gateway or proxy, received an invalid response from the upstream server. Check upstream service health.', category: '5xx Server Error', rfc: 'RFC 7231 §6.6.3', common: true },
  { code: 503, name: 'Service Unavailable', description: 'The server is not ready to handle the request. Common causes: maintenance or overload. The Retry-After header may indicate when to retry.', category: '5xx Server Error', rfc: 'RFC 7231 §6.6.4', common: true },
  { code: 504, name: 'Gateway Timeout', description: 'The server, while working as a gateway or proxy, did not receive a timely response from the upstream server needed to complete the request.', category: '5xx Server Error', rfc: 'RFC 7231 §6.6.5', common: true },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: typeof Zap }> = {
  '1xx Informational': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Info },
  '2xx Success': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Check },
  '3xx Redirection': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Zap },
  '4xx Client Error': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: AlertCircle },
  '5xx Server Error': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: Shield },
};

function getTierColor(code: number): string {
  if (code < 200) return 'from-blue-500 to-blue-600';
  if (code < 300) return 'from-emerald-500 to-emerald-600';
  if (code < 400) return 'from-amber-500 to-amber-600';
  if (code < 500) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

export default function HttpStatusCodeLookup() {
  const [search, setSearch] = useState('');
  const [selectedCode, setSelectedCode] = useState<StatusCode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const categories = ['all', '1xx Informational', '2xx Success', '3xx Redirection', '4xx Client Error', '5xx Server Error'];

  const filteredCodes = STATUS_CODES.filter((sc) => {
    const matchesSearch =
      search === '' ||
      sc.code.toString().includes(search) ||
      sc.name.toLowerCase().includes(search.toLowerCase()) ||
      sc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || sc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const copyStatusCode = useCallback(async (code: number) => {
    await navigator.clipboard.writeText(code.toString());
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">HTTP Status Code Lookup</h1>
            <p className="mt-2 text-slate-600">
              Interactive reference for HTTP status codes with detailed explanations and RFC references
            </p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code, name, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.split(' ').slice(1).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
          {/* Code List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <p className="mb-2 text-sm text-slate-500">
              {filteredCodes.length} code{filteredCodes.length !== 1 ? 's' : ''} found
            </p>
            <div className="max-h-[600px] space-y-2 overflow-y-auto pr-2">
              {filteredCodes.map((sc) => {
                const colors = CATEGORY_COLORS[sc.category];
                const Icon = colors.icon;
                return (
                  <button
                    key={sc.code}
                    onClick={() => setSelectedCode(sc)}
                    className={`w-full rounded-xl border p-4 text-left transition hover:shadow-md ${
                      selectedCode?.code === sc.code
                        ? `${colors.border} ${colors.bg} ring-2 ring-blue-500/20`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${getTierColor(sc.code)} text-sm font-bold text-white shadow-sm`}>
                        {sc.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{sc.name}</span>
                          {sc.common && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              Common
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-slate-500">{sc.description}</p>
                      </div>
                      <Icon className={`h-4 w-4 shrink-0 ${colors.text}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Detail Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:sticky lg:top-24"
          >
            {selectedCode ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${getTierColor(selectedCode.code)} text-lg font-bold text-white shadow-lg`}>
                    {selectedCode.code}
                  </div>
                  <button
                    onClick={() => copyStatusCode(selectedCode.code)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {copiedCode === selectedCode.code ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedCode === selectedCode.code ? 'Copied!' : 'Copy code'}
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedCode.name}</h2>
                <p className="mt-1 text-xs font-medium text-slate-400">{selectedCode.rfc}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{selectedCode.description}</p>
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</h3>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-semibold ${CATEGORY_COLORS[selectedCode.category].bg} ${CATEGORY_COLORS[selectedCode.category].text}`}>
                    {selectedCode.category}
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Usage Tips</h3>
                  <UsageTips code={selectedCode.code} />
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                <p className="text-sm text-slate-400">Select a status code to see details</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 grid gap-4 md:grid-cols-5"
        >
          {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => {
            const count = STATUS_CODES.filter((sc) => sc.category === cat).length;
            const Icon = colors.icon;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-xl border p-4 text-left transition hover:shadow-md ${colors.border} ${colors.bg}`}
              >
                <Icon className={`h-5 w-5 ${colors.text}`} />
                <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
                <p className={`text-xs font-semibold ${colors.text}`}>{cat.split(' ').slice(1).join(' ')}</p>
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function UsageTips({ code }: { code: number }) {
  const tips: Record<number, string[]> = {
    200: ['Default success response for GET requests', 'Should include the requested resource in the body', 'Can include caching headers (ETag, Cache-Control)'],
    201: ['Return the Location header with the new resource URI', 'Include the created resource in the response body', 'Common response to POST requests that create resources'],
    204: ['No response body — set Content-Length to 0', 'Common for successful DELETE operations', 'Use for PUT when you don\'t need to return the updated resource'],
    301: ['Browsers will cache this redirect aggressively', 'Use for permanent URL migrations', 'SEO: link equity transfers to the new URL'],
    302: ['Most browsers redirect using GET regardless of original method', 'Use for temporary redirects during maintenance', 'Consider 307 if method preservation matters'],
    400: ['Always include a descriptive error message in the body', 'Use for validation errors, malformed JSON, missing fields', 'Consider 422 for semantic validation errors'],
    401: ['Must include WWW-Authenticate header', 'The client should re-authenticate and retry', 'Use for missing or invalid authentication credentials'],
    403: ['Don\'t reveal whether the resource exists', 'Use when authentication succeeded but authorization failed', 'Consider rate limiting to prevent enumeration attacks'],
    404: ['Can mean "not found" or "I don\'t want to tell you it exists"', 'Search engines will keep the URL in their index (unlike 410)', 'Include a helpful error message for debugging'],
    429: ['Always include Retry-After header', 'Consider including rate limit headers (X-RateLimit-*)', 'Use exponential backoff on the client side'],
    500: ['Log the actual error server-side for debugging', 'Never expose stack traces or internal details to clients', 'Set up monitoring and alerting for 500 errors'],
    502: ['Check the health of upstream services', 'Common with reverse proxies (nginx, ALB, CloudFront)', 'May indicate deployment issues or upstream crashes'],
    503: ['Include Retry-After header with estimated recovery time', 'Use during planned maintenance windows', 'Load balancers use this for health checks'],
  };

  const codeTips = tips[code] || [
    'Refer to the RFC for complete specification',
    'Test your implementation with various client libraries',
    'Include appropriate headers for this status code',
  ];

  return (
    <ul className="space-y-1.5">
      {codeTips.map((tip, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
          {tip}
        </li>
      ))}
    </ul>
  );
}
