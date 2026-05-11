'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, Copy, Check, Sparkles, RotateCcw, AlignLeft } from 'lucide-react';

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'TRIGGER',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'FULL', 'ON',
  'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT',
  'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
  'AUTO_INCREMENT', 'NOT', 'NULL', 'UNIQUE', 'CHECK',
  'CASCADE', 'RESTRICT', 'SET', 'WITH', 'RECURSIVE',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
  'GRANT', 'REVOKE', 'TO', 'FROM',
  'IF', 'EXISTS', 'TEMPORARY', 'TEMP',
  'ASC', 'DESC', 'HAVING',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'CAST',
  'TRUE', 'FALSE', 'UNKNOWN',
]);

const MAJOR_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE',
  'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN', 'LEFT', 'RIGHT',
  'INNER', 'OUTER', 'CROSS', 'FULL', 'ORDER', 'BY', 'GROUP',
  'HAVING', 'LIMIT', 'UNION', 'SET', 'ON', 'WHERE',
]);

function formatSQL(sql: string, indent: string = '  ', maxLineLen: number = 80): string {
  // Tokenize
  const tokens: string[] = [];
  let i = 0;
  const s = sql.trim();

  while (i < s.length) {
    // Whitespace
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }

    // Line comment
    if (s.startsWith('--', i)) {
      const end = s.indexOf('\n', i);
      const comment = end === -1 ? s.slice(i) : s.slice(i, end);
      tokens.push(comment);
      i = end === -1 ? s.length : end;
      continue;
    }

    // Block comment
    if (s.startsWith('/*', i)) {
      const end = s.indexOf('*/', i + 2);
      const comment = end === -1 ? s.slice(i) : s.slice(i, end + 2);
      tokens.push(comment);
      i = end === -1 ? s.length : end + 2;
      continue;
    }

    // String literal
    if (s[i] === "'" || s[i] === '"') {
      const quote = s[i];
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '\\' && j + 1 < s.length) { j += 2; continue; }
        if (s[j] === quote) { j++; break; }
        j++;
      }
      tokens.push(s.slice(i, j));
      i = j;
      continue;
    }

    // Backtick identifier
    if (s[i] === '`') {
      let j = i + 1;
      while (j < s.length && s[j] !== '`') j++;
      tokens.push(s.slice(i, j + 1));
      i = j + 1;
      continue;
    }

    // Numbers
    if (/\d/.test(s[i]) || (s[i] === '.' && i + 1 < s.length && /\d/.test(s[i + 1]))) {
      let j = i;
      while (j < s.length && /[\d.eE+\-]/.test(s[j])) j++;
      tokens.push(s.slice(i, j));
      i = j;
      continue;
    }

    // Operators and punctuation
    if (/[(),;*=<>!+\-/%.]/.test(s[i])) {
      // Multi-char operators
      if (i + 1 < s.length && ['<=', '>=', '!=', '<>', '||'].includes(s.slice(i, i + 2))) {
        tokens.push(s.slice(i, i + 2));
        i += 2;
      } else {
        tokens.push(s[i]);
        i++;
      }
      continue;
    }

    // Words
    if (/[a-zA-Z_$@]/.test(s[i])) {
      let j = i;
      while (j < s.length && /[a-zA-Z0-9_$@#]/.test(s[j])) j++;
      tokens.push(s.slice(i, j));
      i = j;
      continue;
    }

    // Fallback
    tokens.push(s[i]);
    i++;
  }

  // Build formatted output
  let result = '';
  let depth = 0;
  let lineLen = 0;
  let prevToken = '';

  const ind = () => indent.repeat(depth);
  const nl = () => {
    result += '\n' + ind();
    lineLen = depth * indent.length;
  };
  const emit = (t: string) => {
    result += t;
    lineLen += t.length;
  };
  const emitSpace = () => {
    result += ' ';
    lineLen++;
  };

  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];
    const upper = token.toUpperCase();
    const isComment = token.startsWith('--') || token.startsWith('/*');
    const isKeyword = KEYWORDS.has(upper);
    const isMajor = MAJOR_KEYWORDS.has(upper);

    // Handle semicolons as statement separators
    if (token === ';') {
      emit(';');
      if (ti < tokens.length - 1) {
        result += '\n\n';
        lineLen = 0;
        depth = 0;
      }
      prevToken = token;
      continue;
    }

    // Comments get their own line
    if (isComment) {
      if (prevToken && prevToken !== '\n') nl();
      emit(token);
      nl();
      prevToken = '\n';
      continue;
    }

    // Parentheses
    if (token === '(') {
      const nextUpper = (tokens[ti + 1] || '').toUpperCase();
      // Subquery: (SELECT ...
      if (nextUpper === 'SELECT' || nextUpper === 'WITH') {
        emit('(');
        depth++;
        nl();
      } else {
        emit('(');
        depth++;
      }
      prevToken = token;
      continue;
    }

    if (token === ')') {
      depth = Math.max(0, depth - 1);
      // Check if we need a newline before closing paren
      if (prevToken && prevToken !== '(' && prevToken !== '\n') {
        // Only newline for multi-line contexts
      }
      emit(')');
      prevToken = token;
      continue;
    }

    // Comma handling
    if (token === ',') {
      emit(',');
      // New line after comma in SELECT, WHERE, VALUES, GROUP BY, ORDER BY
      if (lineLen > 20) {
        nl();
      } else {
        emitSpace();
      }
      prevToken = ',';
      continue;
    }

    // Major keywords get their own line
    if (isMajor) {
      if (prevToken && prevToken !== '(' && prevToken !== '\n' && prevToken !== ',') {
        nl();
      }
      if (prevToken === '\n' || prevToken === ',') {
        // already on new line
      }
      emit(upper);
      emitSpace();
      prevToken = upper;
      continue;
    }

    // AND/OR get new line in long statements
    if ((upper === 'AND' || upper === 'OR') && lineLen > 30) {
      nl();
      emit(upper);
      emitSpace();
      prevToken = upper;
      continue;
    }

    // JOIN keywords
    if (['JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'FULL'].includes(upper)) {
      if (prevToken && prevToken !== '\n' && prevToken !== '(') nl();
      emit(upper);
      emitSpace();
      prevToken = upper;
      continue;
    }

    // ON keyword
    if (upper === 'ON') {
      if (prevToken && prevToken !== '\n') nl();
      emit('ON');
      emitSpace();
      prevToken = upper;
      continue;
    }

    // Keywords
    if (isKeyword) {
      if (prevToken && prevToken !== '(' && prevToken !== '\n' && prevToken !== ',') emitSpace();
      emit(upper);
      emitSpace();
      prevToken = upper;
      continue;
    }

    // Regular tokens
    if (prevToken && prevToken !== '(' && prevToken !== '\n' && prevToken !== ',') emitSpace();
    emit(token);
    prevToken = token;
  }

  // Clean up: remove trailing spaces on lines, collapse multiple blank lines
  return result
    .split('\n')
    .map(l => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const EXAMPLE_QUERIES = [
  {
    label: 'Complex SELECT',
    sql: `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = true AND u.created_at >= '2024-01-01' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 20;`,
  },
  {
    label: 'INSERT with subquery',
    sql: `INSERT INTO archive_orders (id, user_id, total, created_at) SELECT id, user_id, total, created_at FROM orders WHERE created_at < (SELECT DATE_SUB(NOW(), INTERVAL 1 YEAR)) AND status IN ('completed', 'refunded') ORDER BY created_at ASC;`,
  },
  {
    label: 'CREATE TABLE',
    sql: `CREATE TABLE IF NOT EXISTS products (id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, price DECIMAL(10,2) NOT NULL DEFAULT 0.00, category_id INT, stock_quantity INT DEFAULT 0, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL, INDEX idx_name (name), INDEX idx_category (category_id));`,
  },
  {
    label: 'CTE with window fn',
    sql: `WITH ranked_sales AS (SELECT product_id, sale_date, amount, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY sale_date DESC) as rn, SUM(amount) OVER (PARTITION BY product_id ORDER BY sale_date) as running_total FROM sales WHERE sale_date >= '2024-01-01') SELECT p.name, rs.sale_date, rs.amount, rs.running_total FROM ranked_sales rs JOIN products p ON rs.product_id = p.id WHERE rs.rn <= 10 ORDER BY p.name, rs.sale_date DESC;`,
  },
];

export default function SqlFormatter() {
  const [input, setInput] = useState(EXAMPLE_QUERIES[0].sql);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');

  const format = useCallback(() => {
    const indent = indentType === 'tabs' ? '\t' : '  ';
    try {
      const formatted = formatSQL(input, indent);
      setOutput(formatted);
    } catch {
      setOutput('-- Error formatting SQL. Please check your input.');
    }
  }, [input, indentType]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInput(EXAMPLE_QUERIES[0].sql);
    setOutput('');
  };

  const loadExample = (sql: string) => {
    setInput(sql);
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Free Developer Tool
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Database className="w-10 h-10 text-blue-400" />
            SQL Query Formatter
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Format and beautify SQL queries with intelligent keyword detection, indentation control,
            and support for SELECT, INSERT, UPDATE, DELETE, CTEs, subqueries, and more.
          </p>
        </motion.div>

        {/* Example queries */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {EXAMPLE_QUERIES.map((ex, i) => (
            <button
              key={i}
              onClick={() => loadExample(ex.sql)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Raw SQL
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-72 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Paste your SQL query here..."
              spellCheck={false}
            />
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Formatted SQL
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-72 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-emerald-200 font-mono focus:outline-none resize-none"
              placeholder="Click 'Format' to see the result..."
              spellCheck={false}
            />
          </motion.div>
        </div>

        {/* Options and Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setIndentType('spaces')}
              className={`px-3 py-1.5 text-sm rounded-md transition ${indentType === 'spaces' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setIndentType('tabs')}
              className={`px-3 py-1.5 text-sm rounded-md transition ${indentType === 'tabs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Tabs
            </button>
          </div>

          <button
            onClick={format}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <AlignLeft className="w-5 h-5" />
            Format SQL
          </button>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          {output && (
            <button
              onClick={copyOutput}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: 'Smart Keywords', desc: 'Auto-uppercases SQL keywords while preserving identifiers' },
            { title: 'Intelligent Indent', desc: 'Deep nesting, subqueries, and CTEs properly indented' },
            { title: 'Multi-Statement', desc: 'Handles multiple statements separated by semicolons' },
            { title: '100% Client-Side', desc: 'No data sent to servers. Works offline.' },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-400">{f.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
