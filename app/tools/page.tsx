import Link from 'next/link';

export const metadata = {
  title: 'Free Developer Tools & Utilities | Zion Tech Group',
  description: '50+ free online developer tools: JSON formatter, JWT decoder, regex tester, SQL formatter, color palette generator, QR code generator, and more.',
};

const tools = [
  { id: 'json-formatter', icon: '📋', title: 'JSON Formatter & Validator', desc: 'Format, validate, and prettify JSON with syntax highlighting', category: 'Data' },
  { id: 'json-to-csv-converter', icon: '🔄', title: 'JSON to CSV Converter', desc: 'Convert JSON arrays to CSV and vice versa', category: 'Data' },
  { id: 'json-schema-generator', icon: '📐', title: 'JSON Schema Generator', desc: 'Auto-generate JSON Schema from sample JSON data', category: 'Data' },
  { id: 'json-diff-viewer', icon: '⚖️', title: 'JSON Diff Viewer', desc: 'Compare two JSON documents and highlight differences', category: 'Data' },
  { id: 'yaml-json-converter', icon: '🔁', title: 'YAML ⇄ JSON Converter', desc: 'Convert between YAML and JSON formats instantly', category: 'Data' },
  { id: 'xml-formatter-validator', icon: '📄', title: 'XML Formatter & Validator', desc: 'Format, validate, and minify XML documents', category: 'Data' },
  { id: 'css-gradient-generator', icon: '🌈', title: 'CSS Gradient Generator', desc: 'Visual CSS gradient builder with live preview', category: 'CSS' },
  { id: 'css-minifier-beautifier', icon: '🎨', title: 'CSS Minifier & Beautifier', desc: 'Minify CSS for production or beautify for development', category: 'CSS' },
  { id: 'html-to-jsx', icon: '⚛️', title: 'HTML to JSX Converter', desc: 'Convert HTML markup to React JSX syntax', category: 'HTML' },
  { id: 'html-minifier-beautifier', icon: '📝', title: 'HTML Minifier & Beautifier', desc: 'Minify HTML for performance or format for readability', category: 'HTML' },
  { id: 'sql-formatter', icon: '🗃️', title: 'SQL Formatter', desc: 'Format and beautify SQL queries with syntax highlighting', category: 'Data' },
  { id: 'jwt-decoder', icon: '🔑', title: 'JWT Decoder', desc: 'Decode and inspect JWT tokens with claims visualization', category: 'Security' },
  { id: 'color-palette-generator', icon: '🎨', title: 'Color Palette Generator', desc: 'Generate beautiful color palettes for your designs', category: 'Design' },
  { id: 'color-contrast-checker', icon: '👁️', title: 'Color Contrast Checker', desc: 'Check WCAG accessibility contrast ratios', category: 'Design' },
  { id: 'color-blindness-simulator', icon: '🔍', title: 'Color Blindness Simulator', desc: 'Simulate how designs look for different types of color blindness', category: 'Design' },
  { id: 'box-shadow-generator', icon: '📦', title: 'Box Shadow Generator', desc: 'Visual CSS box shadow builder with live preview', category: 'CSS' },
  { id: 'image-color-extractor', icon: '🖼️', title: 'Image Color Extractor', desc: 'Extract dominant colors from any image', category: 'Design' },
  { id: 'unit-converter', icon: '📏', title: 'Unit Converter', desc: 'Convert between length, weight, temperature, and data units', category: 'Utilities' },
  { id: 'currency-converter', icon: '💱', title: 'Currency Converter', desc: 'Real-time currency conversion for 150+ currencies', category: 'Utilities' },
  { id: 'base64', icon: '🔐', title: 'Base64 Encoder/Decoder', desc: 'Encode and decode Base64 strings and files', category: 'Encoding' },
  { id: 'url-encoder-decoder', icon: '🔗', title: 'URL Encoder/Decoder', desc: 'Encode and decode URL parameters safely', category: 'Encoding' },
  { id: 'qr-code-generator', icon: '📱', title: 'QR Code Generator', desc: 'Generate customizable QR codes for URLs, text, and more', category: 'Utilities' },
  { id: 'password-generator', icon: '🔒', title: 'Password Generator', desc: 'Generate secure random passwords with custom rules', category: 'Security' },
  { id: 'password-strength-checker', icon: '💪', title: 'Password Strength Checker', desc: 'Analyze password strength and get improvement tips', category: 'Security' },
  { id: 'regex-tester', icon: '🔬', title: 'Regex Tester', desc: 'Test and debug regular expressions with live matching', category: 'Text' },
  { id: 'timestamp-converter', icon: '⏰', title: 'Unix Timestamp Converter', desc: 'Convert between Unix timestamps and human-readable dates', category: 'Utilities' },
  { id: 'uuid-generator', icon: '🆔', title: 'UUID/GUID Generator', desc: 'Generate RFC 4122 compliant UUIDs (v1, v4, v5)', category: 'Utilities' },
  { id: 'lorem-ipsum-generator', icon: '📃', title: 'Lorem Ipsum Generator', desc: 'Generate placeholder text for designs and mockups', category: 'Text' },
  { id: 'word-counter', icon: '🔢', title: 'Word & Character Counter', desc: 'Count words, characters, sentences, and paragraphs', category: 'Text' },
  { id: 'string-case-converter', icon: '🔤', title: 'String Case Converter', desc: 'Convert between camelCase, snake_case, kebab-case, and more', category: 'Text' },
  { id: 'markdown-preview', icon: '📖', title: 'Markdown Preview', desc: 'Live markdown preview with GitHub Flavored Markdown', category: 'Text' },
  { id: 'cron-expression-explainer', icon: '⏱️', title: 'Cron Expression Explainer', desc: 'Parse and explain cron expressions in plain English', category: 'Utilities' },
  { id: 'number-base-converter', icon: '🔢', title: 'Number Base Converter', desc: 'Convert between binary, octal, decimal, and hexadecimal', category: 'Utilities' },
  { id: 'subnet-calculator', icon: '🌐', title: 'Subnet Calculator', desc: 'Calculate subnet ranges, CIDR, and network addresses', category: 'Network' },
  { id: 'secure-hash-generator', icon: '🔐', title: 'Secure Hash Generator', desc: 'Generate SHA-256, SHA-512, MD5, and other hashes', category: 'Security' },
];

export default function ToolsPage() {
  const categories = [...new Set(tools.map(t => t.category))];
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🛠️ Free Developer Tools</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            35+ free online tools for developers, designers, and data professionals.
            No signup required, no data stored.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500">
            <span>📞 +1 302 464 0950</span>
            <span>✉️ kleber@ziontechgroup.com</span>
          </div>
        </header>

        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.filter(t => t.category === cat).map(tool => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group block p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{tool.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400">Need custom tools or integrations?</span>
            <Link href="/contact" className="text-emerald-300 hover:text-emerald-200 underline">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
