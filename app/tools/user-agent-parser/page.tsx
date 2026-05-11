'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Copy, Check, Search, Info, Globe, Cpu, Eye } from 'lucide-react';

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
  cpu: { architecture: string };
  isBot: boolean;
  botName: string | null;
  raw: string;
}

const EXAMPLE_USER_AGENTS = [
  {
    label: 'Chrome on Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  },
  {
    label: 'Safari on iPhone',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'Firefox on Linux',
    ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  },
  {
    label: 'Googlebot',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
  {
    label: 'Chrome on Android',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.39 Mobile Safari/537.36',
  },
  {
    label: 'Edge on Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.2903.63',
  },
  {
    label: 'Mac Safari',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  },
  {
    label: 'iPad tablet',
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  },
];

function parseUserAgent(uaString: string): ParsedUA {
  const ua = uaString.trim();

  const result: ParsedUA = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { type: 'Desktop', vendor: '', model: '' },
    engine: { name: 'Unknown', version: '' },
    cpu: { architecture: '' },
    isBot: false,
    botName: null,
    raw: ua,
  };

  if (!ua) return result;

  // Bot detection
  const botPatterns = [
    { pattern: /Googlebot/i, name: 'Googlebot' },
    { pattern: /bingbot/i, name: 'Bingbot' },
    { pattern: /Slurp/i, name: 'Yahoo Slurp' },
    { pattern: /DuckDuckBot/i, name: 'DuckDuckBot' },
    { pattern: /Baiduspider/i, name: 'Baiduspider' },
    { pattern: /YandexBot/i, name: 'YandexBot' },
    { pattern: /Sogou/i, name: 'Sogou Spider' },
    { pattern: /facebookexternalhit/i, name: 'Facebook Bot' },
    { pattern: /Twitterbot/i, name: 'Twitter Bot' },
    { pattern: /LinkedInBot/i, name: 'LinkedIn Bot' },
    { pattern: /GPTBot/i, name: 'GPTBot (OpenAI)' },
    { pattern: /ChatGPT-User/i, name: 'ChatGPT User Agent' },
    { pattern: /Claude-Web/i, name: 'Claude Web (Anthropic)' },
    { pattern: /Bytespider/i, name: 'ByteDance Spider' },
    { pattern: /SemrushBot/i, name: 'SemrushBot' },
    { pattern: /AhrefsBot/i, name: 'AhrefsBot' },
    { pattern: /MJ12bot/i, name: 'Majestic MJ12bot' },
    { pattern: /CCBot/i, name: 'CCBot (Common Crawl)' },
    { pattern: /rogerbot/i, name: 'Rogerbot (Moz)' },
    { pattern: /bot[\/\s]/i, name: 'Generic Bot' },
    { pattern: /spider/i, name: 'Generic Spider' },
    { pattern: /crawler/i, name: 'Generic Crawler' },
  ];

  for (const { pattern, name } of botPatterns) {
    if (pattern.test(ua)) {
      result.isBot = true;
      result.botName = name;
      break;
    }
  }

  // OS detection
  const osPatterns: Array<{ pattern: RegExp; name: string; versionGroup?: number }> = [
    { pattern: /Windows NT 10\.0/i, name: 'Windows', versionGroup: 0 },
    { pattern: /Windows NT 6\.3/i, name: 'Windows', versionGroup: 0 },
    { pattern: /Windows NT 6\.2/i, 'name': 'Windows', versionGroup: 0 },
    { pattern: /Windows NT 6\.1/i, name: 'Windows', versionGroup: 0 },
    { pattern: /Mac OS X ([\d_.]+)/i, name: 'macOS' },
    { pattern: /iPhone OS ([\d_]+)/i, name: 'iOS' },
    { pattern: /iPad;.*OS ([\d_]+)/i, name: 'iPadOS' },
    { pattern: /Android ([\d.]+)/i, name: 'Android' },
    { pattern: /Linux/i, name: 'Linux' },
    { pattern: /CrOS/i, name: 'Chrome OS' },
  ];

  for (const { pattern, name } of osPatterns) {
    const match = ua.match(pattern);
    if (match) {
      result.os.name = name;
      if (name === 'Windows') {
        const winVersions: Record<string, string> = {
          'Windows NT 10.0': '10/11',
          'Windows NT 6.3': '8.1',
          'Windows NT 6.2': '8',
          'Windows NT 6.1': '7',
        };
        result.os.version = winVersions[match[0]] || '';
      } else if (match[1]) {
        result.os.version = match[1].replace(/_/g, '.');
      }
      break;
    }
  }

  // Browser detection (order matters - check specific browsers before generic ones)
  const browserPatterns: Array<{ pattern: RegExp; name: string; versionIdx?: number }> = [
    { pattern: /Edg(?:e|A|iOS)?\/([\d.]+)/i, name: 'Microsoft Edge', versionIdx: 1 },
    { pattern: /OPR\/([\d.]+)/i, name: 'Opera', versionIdx: 1 },
    { pattern: /SamsungBrowser\/([\d.]+)/i, name: 'Samsung Internet', versionIdx: 1 },
    { pattern: /UCBrowser\/([\d.]+)/i, name: 'UC Browser', versionIdx: 1 },
    { pattern: /Firefox\/([\d.]+)/i, name: 'Firefox', versionIdx: 1 },
    { pattern: /Chrome\/([\d.]+)/i, name: 'Chrome', versionIdx: 1 },
    { pattern: /CriOS\/([\d.]+)/i, name: 'Chrome (iOS)', versionIdx: 1 },
    { pattern: /FxiOS\/([\d.]+)/i, name: 'Firefox (iOS)', versionIdx: 1 },
    { pattern: /Version\/([\d.]+).*Safari/i, name: 'Safari', versionIdx: 1 },
    { pattern: /Safari\/([\d.]+)/i, name: 'Safari' },
  ];

  for (const { pattern, name, versionIdx } of browserPatterns) {
    const match = ua.match(pattern);
    if (match) {
      result.browser.name = name;
      result.browser.version = versionIdx && match[versionIdx] ? match[versionIdx] : '';
      break;
    }
  }

  // Engine detection
  if (/Blink|Chrome/i.test(ua)) {
    result.engine.name = 'Blink';
    const chromeMatch = ua.match(/Chrome\/([\d.]+)/);
    result.engine.version = chromeMatch?.[1] || '';
  } else if (/Gecko.*Firefox/i.test(ua)) {
    result.engine.name = 'Gecko';
    const rvMatch = ua.match(/rv:([\d.]+)/);
    result.engine.version = rvMatch?.[1] || '';
  } else if (/WebKit/i.test(ua) && !/Chrome/i.test(ua)) {
    result.engine.name = 'WebKit';
    const webkitMatch = ua.match(/AppleWebKit\/([\d.]+)/);
    result.engine.version = webkitMatch?.[1] || '';
  }

  // Device type
  if (/Mobile|iPhone|iPod/i.test(ua)) {
    result.device.type = 'Mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    result.device.type = 'Tablet';
  } else if (/Smart-?TV|SmartTV|GoogleTV|AppleTV|Roku|FireTV/i.test(ua)) {
    result.device.type = 'Smart TV';
  } else if (/Bot|Spider|Crawler/i.test(ua)) {
    result.device.type = 'Bot';
  }

  // Device vendor/model (mobile)
  const vendorModels = [
    { pattern: /iPhone/i, vendor: 'Apple', model: 'iPhone' },
    { pattern: /iPad/i, vendor: 'Apple', model: 'iPad' },
    { pattern: /Macintosh/i, vendor: 'Apple', model: 'Mac' },
    { pattern: /Pixel (\d)/i, vendor: 'Google', model: 'Pixel' },
    { pattern: /Samsung[- ]/i, vendor: 'Samsung', model: '' },
    { pattern: /SM-[A-Z]/i, vendor: 'Samsung', model: '' },
    { pattern: /Huawei/i, vendor: 'Huawei', model: '' },
    { pattern: /Xiaomi|Redmi|Mi (\d)/i, vendor: 'Xiaomi', model: '' },
    { pattern: /OnePlus/i, vendor: 'OnePlus', model: '' },
  ];

  for (const { pattern, vendor, model } of vendorModels) {
    if (pattern.test(ua)) {
      result.device.vendor = vendor;
      result.device.model = model || vendor;
      break;
    }
  }

  // CPU architecture
  if (/x86_64|Win64|WOW64|x64|amd64/i.test(ua)) {
    result.cpu.architecture = 'x86-64 (64-bit)';
  } else if (/i686|x86|i386/i.test(ua) && !/x86_64/i.test(ua)) {
    result.cpu.architecture = 'x86 (32-bit)';
  } else if (/arm64|aarch64/i.test(ua)) {
    result.cpu.architecture = 'ARM64';
  } else if (/arm/i.test(ua)) {
    result.cpu.architecture = 'ARM';
  }

  return result;
}

function DeviceIcon({ type }: { type: string }) {
  if (type === 'Mobile') return <Smartphone className="w-6 h-6" />;
  if (type === 'Tablet') return <Tablet className="w-6 h-6" />;
  return <Monitor className="w-6 h-6" />;
}

function getBrowserColor(name: string): string {
  if (name.includes('Chrome')) return 'from-amber-500 to-yellow-500';
  if (name.includes('Firefox')) return 'from-orange-500 to-red-500';
  if (name.includes('Safari')) return 'from-blue-500 to-cyan-500';
  if (name.includes('Edge')) return 'from-sky-500 to-blue-600';
  if (name.includes('Opera')) return 'from-red-500 to-pink-500';
  return 'from-slate-500 to-gray-500';
}

export default function UserAgentParser() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedUA | null>(null);
  const [copied, setCopied] = useState(false);

  const parse = useCallback((uaString?: string) => {
    const ua = uaString || input;
    if (!ua.trim()) return;
    const result = parseUserAgent(ua);
    setParsed(result);
    if (uaString) setInput(uaString);
    setCopied(false);
  }, [input]);

  const copyJson = useCallback(() => {
    if (!parsed) return;
    const { raw, ...rest } = parsed;
    navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [parsed]);

  const useCurrentUA = useCallback(() => {
    const ua = navigator.userAgent;
    setInput(ua);
    const result = parseUserAgent(ua);
    setParsed(result);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-500/25">
            <Eye className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">User-Agent Parser</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Parse any User-Agent string to detect browser, operating system, device type, engine, and bot status. Instant, accurate, 100% client-side.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">User-Agent string</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a User-Agent string here..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 font-mono text-sm resize-y"
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => parse()}
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Parse
            </button>
            <button
              onClick={useCurrentUA}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Use My Browser
            </button>
          </div>

          {/* Example UAs */}
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_USER_AGENTS.map((example) => (
                <button
                  key={example.label}
                  onClick={() => parse(example.ua)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${
                    parsed?.raw === example.ua
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {parsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Bot Warning */}
            {parsed.isBot && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Bot Detected</h3>
                  <p className="text-sm text-amber-700">
                    This User-Agent belongs to <strong>{parsed.botName}</strong>. It&apos;s likely a search engine crawler, AI bot, or automated scanner.
                  </p>
                </div>
              </div>
            )}

            {/* Main Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Browser */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className={`w-10 h-10 bg-gradient-to-br ${getBrowserColor(parsed.browser.name)} rounded-lg flex items-center justify-center text-white mb-3`}>
                  <Globe className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Browser</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{parsed.browser.name}</p>
                {parsed.browser.version && (
                  <p className="text-sm text-slate-500">v{parsed.browser.version}</p>
                )}
              </div>

              {/* OS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <Monitor className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Operating System</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{parsed.os.name}</p>
                {parsed.os.version && (
                  <p className="text-sm text-slate-500">{parsed.os.version}</p>
                )}
              </div>

              {/* Device */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <DeviceIcon type={parsed.device.type} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Device</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{parsed.device.type}</p>
                {parsed.device.vendor && (
                  <p className="text-sm text-slate-500">{parsed.device.vendor} {parsed.device.model}</p>
                )}
              </div>

              {/* Engine */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Engine</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{parsed.engine.name}</p>
                {parsed.engine.version && (
                  <p className="text-sm text-slate-500">v{parsed.engine.version}</p>
                )}
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Full Breakdown</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Browser" value={`${parsed.browser.name} ${parsed.browser.version}`} />
                <DetailRow label="Engine" value={`${parsed.engine.name} ${parsed.engine.version}`} />
                <DetailRow label="OS" value={`${parsed.os.name} ${parsed.os.version}`} />
                <DetailRow label="Device Type" value={parsed.device.type} />
                <DetailRow label="Device Vendor" value={parsed.device.vendor || 'Unknown'} />
                <DetailRow label="Device Model" value={parsed.device.model || 'Unknown'} />
                <DetailRow label="CPU Architecture" value={parsed.cpu.architecture || 'Not specified'} />
                <DetailRow label="Is Bot" value={parsed.isBot ? `Yes (${parsed.botName})` : 'No'} />
              </div>
            </div>

            {/* Raw UA */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Raw User-Agent</h3>
                <button
                  onClick={copyJson}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <code className="block text-xs text-slate-600 bg-slate-50 rounded-lg p-3 break-all font-mono">
                {parsed.raw}
              </code>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-indigo-50 rounded-2xl border border-indigo-200 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-indigo-900">About User-Agent Parsing</h3>
          </div>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>The User-Agent header is sent by every browser and HTTP client to identify itself to servers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>Bot detection covers major search engines (Google, Bing, Yandex), AI bots (GPTBot, Claude), and SEO crawlers (Ahrefs, Semrush)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>100% client-side — no data leaves your browser. Useful for analytics, debugging, and bot detection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span>Note: User-Agent strings can be spoofed. Use as one signal among many for identifying clients</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}
