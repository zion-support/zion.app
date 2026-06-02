import Link from 'next/link';

export const metadata = {
  title: 'Developer Tool | Zion Tech Group',
  description: 'Free online developer tool by Zion Tech Group.',
};

const toolData: Record<string, { icon: string; title: string; desc: string; placeholder: string }> = {
  'json-formatter': { icon: '📋', title: 'JSON Formatter & Validator', desc: 'Format, validate, and prettify JSON with syntax highlighting', placeholder: 'Paste your JSON here...' },
  'json-to-csv-converter': { icon: '🔄', title: 'JSON to CSV Converter', desc: 'Convert JSON arrays to CSV and vice versa', placeholder: 'Paste JSON array here...' },
  'json-schema-generator': { icon: '📐', title: 'JSON Schema Generator', desc: 'Auto-generate JSON Schema from sample JSON data', placeholder: 'Paste sample JSON here...' },
  'json-diff-viewer': { icon: '⚖️', title: 'JSON Diff Viewer', desc: 'Compare two JSON documents and highlight differences', placeholder: 'Paste first JSON here...' },
  'yaml-json-converter': { icon: '🔁', title: 'YAML ⇄ JSON Converter', desc: 'Convert between YAML and JSON formats instantly', placeholder: 'Paste YAML or JSON here...' },
  'xml-formatter-validator': { icon: '📄', title: 'XML Formatter & Validator', desc: 'Format, validate, and minify XML documents', placeholder: 'Paste XML here...' },
  'css-gradient-generator': { icon: '🌈', title: 'CSS Gradient Generator', desc: 'Visual CSS gradient builder with live preview', placeholder: 'Configure gradient settings...' },
  'css-minifier-beautifier': { icon: '🎨', title: 'CSS Minifier & Beautifier', desc: 'Minify CSS for production or beautify for development', placeholder: 'Paste CSS here...' },
  'html-to-jsx': { icon: '⚛️', title: 'HTML to JSX Converter', desc: 'Convert HTML markup to React JSX syntax', placeholder: 'Paste HTML here...' },
  'html-minifier-beautifier': { icon: '📝', title: 'HTML Minifier & Beautifier', desc: 'Minify HTML for performance or format for readability', placeholder: 'Paste HTML here...' },
  'sql-formatter': { icon: '🗃️', title: 'SQL Formatter', desc: 'Format and beautify SQL queries', placeholder: 'Paste SQL here...' },
  'jwt-decoder': { icon: '🔑', title: 'JWT Decoder', desc: 'Decode and inspect JWT tokens', placeholder: 'Paste JWT token here...' },
  'color-palette-generator': { icon: '🎨', title: 'Color Palette Generator', desc: 'Generate beautiful color palettes', placeholder: 'Enter base color (e.g., #3B82F6)...' },
  'color-contrast-checker': { icon: '👁️', title: 'Color Contrast Checker', desc: 'Check WCAG accessibility contrast ratios', placeholder: 'Enter foreground color...' },
  'color-blindness-simulator': { icon: '🔍', title: 'Color Blindness Simulator', desc: 'Simulate color blindness types', placeholder: 'Enter color to simulate...' },
  'box-shadow-generator': { icon: '📦', title: 'Box Shadow Generator', desc: 'Visual CSS box shadow builder', placeholder: 'Configure shadow settings...' },
  'image-color-extractor': { icon: '🖼️', title: 'Image Color Extractor', desc: 'Extract dominant colors from images', placeholder: 'Upload or paste image URL...' },
  'unit-converter': { icon: '📏', title: 'Unit Converter', desc: 'Convert between units', placeholder: 'Enter value to convert...' },
  'currency-converter': { icon: '💱', title: 'Currency Converter', desc: 'Real-time currency conversion', placeholder: 'Enter amount...' },
  'base64': { icon: '🔐', title: 'Base64 Encoder/Decoder', desc: 'Encode and decode Base64', placeholder: 'Paste text here...' },
  'url-encoder-decoder': { icon: '🔗', title: 'URL Encoder/Decoder', desc: 'Encode and decode URLs', placeholder: 'Paste URL here...' },
  'qr-code-generator': { icon: '📱', title: 'QR Code Generator', desc: 'Generate QR codes', placeholder: 'Enter text or URL...' },
  'password-generator': { icon: '🔒', title: 'Password Generator', desc: 'Generate secure passwords', placeholder: 'Set password length...' },
  'password-strength-checker': { icon: '💪', title: 'Password Strength Checker', desc: 'Analyze password strength', placeholder: 'Enter password...' },
  'regex-tester': { icon: '🔬', title: 'Regex Tester', desc: 'Test regular expressions', placeholder: 'Enter regex pattern...' },
  'timestamp-converter': { icon: '⏰', title: 'Unix Timestamp Converter', desc: 'Convert timestamps to dates', placeholder: 'Enter Unix timestamp...' },
  'uuid-generator': { icon: '🆔', title: 'UUID/GUID Generator', desc: 'Generate UUIDs', placeholder: 'Click generate...' },
  'lorem-ipsum-generator': { icon: '📃', title: 'Lorem Ipsum Generator', desc: 'Generate placeholder text', placeholder: 'Set number of paragraphs...' },
  'word-counter': { icon: '🔢', title: 'Word & Character Counter', desc: 'Count words and characters', placeholder: 'Paste text here...' },
  'string-case-converter': { icon: '🔤', title: 'String Case Converter', desc: 'Convert string cases', placeholder: 'Paste text here...' },
  'markdown-preview': { icon: '📖', title: 'Markdown Preview', desc: 'Live markdown preview', placeholder: 'Write markdown here...' },
  'cron-expression-explainer': { icon: '⏱️', title: 'Cron Expression Explainer', desc: 'Explain cron expressions', placeholder: 'Enter cron expression...' },
  'number-base-converter': { icon: '🔢', title: 'Number Base Converter', desc: 'Convert number bases', placeholder: 'Enter number...' },
  'subnet-calculator': { icon: '🌐', title: 'Subnet Calculator', desc: 'Calculate subnets', placeholder: 'Enter IP/CIDR...' },
  'secure-hash-generator': { icon: '🔐', title: 'Secure Hash Generator', desc: 'Generate secure hashes', placeholder: 'Enter text to hash...' },
};

export async function generateStaticParams() {
  return Object.keys(toolData).map(id => ({ toolId: id }));
}

export default function ToolPage({ params }: { params: { toolId: string } }) {
  const tool = toolData[params.toolId];
  
  if (!tool) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <Link href="/tools" className="text-emerald-400 hover:text-emerald-300">← Back to Tools</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/tools" className="text-emerald-400 hover:text-emerald-300 text-sm mb-8 inline-block">← All Tools</Link>
        
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{tool.icon}</span>
            <h1 className="text-3xl font-bold text-white">{tool.title}</h1>
          </div>
          <p className="text-slate-400">{tool.desc}</p>
        </header>

        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 mb-8">
          <textarea
            className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white font-mono text-sm resize-y focus:outline-none focus:border-emerald-500"
            placeholder={tool.placeholder}
            id="tool-input"
          />
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
              Process
            </button>
            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
              Clear
            </button>
            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
              Copy Output
            </button>
          </div>
          <div className="mt-4">
            <label className="text-slate-400 text-sm mb-2 block">Output:</label>
            <textarea
              className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-emerald-300 font-mono text-sm resize-y focus:outline-none"
              placeholder="Output will appear here..."
              id="tool-output"
              readOnly
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">About This Tool</h2>
          <p className="text-slate-400 mb-4">
            {tool.desc}. This tool runs entirely in your browser — no data is sent to our servers.
            For API access and advanced features, contact our team.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="tel:+130****0950" className="text-emerald-400">📞 +1 302 464 0950</a>
            <a href="mailto:kleber@ziontechgroup.com" className="text-emerald-400">✉️ kleber@ziontechgroup.com</a>
            <Link href="/contact" className="text-emerald-400">Get Custom Tools →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
