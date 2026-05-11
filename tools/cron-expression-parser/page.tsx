'use client';

import { useState, useMemo } from 'react';

/* eslint-disable @typescript-eslint/no-unused-vars */
const FIELD_NAMES = ['minute', 'hour', 'day of month', 'month', 'day of week'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function describeField(field: string, fieldName: string, monthNames?: string[], dowNames?: string[]): string {
  if (field === '*') return `every ${fieldName}`;

  // */n pattern
  const everyMatch = field.match(/^\*\/(\d+)$/);
  if (everyMatch) return `every ${everyMatch[1]} ${fieldName}s`;

  // List
  if (field.includes(',')) {
    const values = field.split(',');
    if (fieldName === 'month' && monthNames) {
      return values.map(v => monthNames[parseInt(v) - 1] ?? v).join(', ');
    }
    if (fieldName === 'day of week' && dowNames) {
      return values.map(v => dowNames[parseInt(v) % 7] ?? v).join(', ');
    }
    return values.join(', ') + ` (on those ${fieldName}s)`;
  }

  // Range
  const rangeMatch = field.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
  if (rangeMatch) {
    const [, start, end, step] = rangeMatch;
    if (fieldName === 'month' && monthNames) {
      const rangeStr = `${monthNames[parseInt(start) - 1] ?? start} to ${monthNames[parseInt(end) - 1] ?? end}`;
      return step ? `${rangeStr} (every ${step})` : rangeStr;
    } else if (fieldName === 'day of week' && dowNames) {
      const rangeStr = `${dowNames[parseInt(start) % 7] ?? start} to ${dowNames[parseInt(end) % 7] ?? end}`;
      return step ? `${rangeStr} (every ${step})` : rangeStr;
    } else {
      const rangeStr = `${start} through ${end}`;
      return step ? `${rangeStr} (every ${step})` : rangeStr;
    }
  }

  // Single value
  if (fieldName === 'month' && monthNames) return monthNames[parseInt(field) - 1] ?? field;
  if (fieldName === 'day of week' && dowNames) return dowNames[parseInt(field) % 7] ?? field;

  return `at ${field}`;
}

function humanizeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression — must have exactly 5 fields';

  const [minute, hour, dom, month, dow] = parts;

  // Check for common patterns
  if (expr === '* * * * *') return 'Every minute';
  if (minute.startsWith('*/') && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    return `Every ${minute.slice(2)} minutes`;
  }
  if (minute.match(/^\d+$/) && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    return `At minute ${minute} of every hour`;
  }
  if (minute.match(/^\d+$/) && hour.match(/^\d+$/) && dom === '*' && month === '*' && dow === '*') {
    return `Daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  const parts_desc = [
    describeField(minute, 'minute'),
    describeField(hour, 'hour'),
    describeField(dom, 'day of month'),
    describeField(month, 'month', MONTH_NAMES),
    describeField(dow, 'day of week', undefined, DOW_NAMES),
  ];

  return `At ${parts_desc[0]}, ${parts_desc[1]}, ${parts_desc[2]}, ${parts_desc[3]}, ${parts_desc[4]}`;
}

function getNextRuns(expr: string, count: number = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const now = new Date();
  const runs: string[] = [];
  const maxIterations = 525600; // 1 year in minutes
  let current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1);

  const [minExpr, hourExpr, domExpr, monthExpr, dowExpr] = parts;

  function matchesField(value: number, expr: string, max: number): boolean {
    if (expr === '*') return true;
    if (expr.startsWith('*/')) return value % parseInt(expr.slice(2)) === 0;
    if (expr.includes(',')) return expr.split(',').some(v => parseInt(v) === value);
    const rangeMatch = expr.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
    if (rangeMatch) {
      const [, s, e, step] = rangeMatch;
      const start = parseInt(s);
      const end = parseInt(e);
      const stepVal = step ? parseInt(step) : 1;
      if (value >= start && value <= end) {
        return (value - start) % stepVal === 0;
      }
      return false;
    }
    return parseInt(expr) === value;
  }

  for (let i = 0; i < maxIterations && runs.length < count; i++) {
    const m = current.getMinutes();
    const h = current.getHours();
    const d = current.getDate();
    const mo = current.getMonth() + 1;
    const dw = current.getDay();

    if (
      matchesField(m, minExpr, 59) &&
      matchesField(h, hourExpr, 23) &&
      matchesField(d, domExpr, 31) &&
      matchesField(mo, monthExpr, 12) &&
      matchesField(dw, dowExpr, 6)
    ) {
      runs.push(current.toLocaleString());
    }
    current = new Date(current.getTime() + 60000);
  }
  return runs;
}

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 min', cron: '*/5 * * * *' },
  { label: 'Hourly', cron: '0 * * * *' },
  { label: 'Daily at midnight', cron: '0 0 * * *' },
  { label: 'Daily at 9am', cron: '0 9 * * *' },
  { label: 'Weekdays at 9am', cron: '0 9 * * 1-5' },
  { label: 'Weekly (Sun)', cron: '0 0 * * 0' },
  { label: 'Monthly (1st)', cron: '0 0 1 * *' },
  { label: 'Yearly (Jan 1)', cron: '0 0 1 1 *' },
  { label: 'Every 15 min (work hrs)', cron: '*/15 9-17 * * 1-5' },
];

export default function CronExpressionParserPage() {
  const [cronExpr, setCronExpr] = useState('0 9 * * 1-5');
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) return { valid: false, error: 'Must have exactly 5 fields (minute hour day month weekday)' };

    const ranges = [
      { min: 0, max: 59, name: 'minute' },
      { min: 0, max: 23, name: 'hour' },
      { min: 1, max: 31, name: 'day of month' },
      { min: 1, max: 12, name: 'month' },
      { min: 0, max: 7, name: 'day of week' },
    ];

    for (let i = 0; i < 5; i++) {
      const field = parts[i];
      const { min, max, name } = ranges[i];

      if (field === '*') continue;

      // */n
      if (/^\*\/\d+$/.test(field)) {
        const n = parseInt(field.slice(2));
        if (n < 1 || n > max) return { valid: false, error: `Invalid step in ${name}: /${n}` };
        continue;
      }

      // List
      const items = field.split(',');
      for (const item of items) {
        const rangeMatch = item.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
        if (rangeMatch) {
          const [, s, e, step] = rangeMatch;
          if (parseInt(s) < min || parseInt(e) > max) {
            return { valid: false, error: `${name}: range ${s}-${e} out of bounds (${min}-${max})` };
          }
          continue;
        }
        const n = parseInt(item);
        if (isNaN(n) || n < min || n > max) {
          return { valid: false, error: `${name}: "${item}" is out of bounds (${min}-${max})` };
        }
      }
    }
    return { valid: true, error: '' };
  }, [cronExpr]);

  const humanized = useMemo(() => {
    if (!validation.valid) return '';
    return humanizeCron(cronExpr);
  }, [cronExpr, validation.valid]);

  const nextRuns = useMemo(() => {
    if (!validation.valid) return [];
    return getNextRuns(cronExpr, 6);
  }, [cronExpr, validation.valid]);

  const fieldBreakdown = useMemo(() => {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) return [];
    return [
      { field: 'Minute', value: parts[0], desc: describeField(parts[0], 'minute') },
      { field: 'Hour', value: parts[1], desc: describeField(parts[1], 'hour') },
      { field: 'Day (month)', value: parts[2], desc: describeField(parts[2], 'day of month') },
      { field: 'Month', value: parts[3], desc: describeField(parts[3], 'month', MONTH_NAMES) },
      { field: 'Day (week)', value: parts[4], desc: describeField(parts[4], 'day of week', undefined, DOW_NAMES) },
    ];
  }, [cronExpr]);

  const copyCron = () => {
    navigator.clipboard.writeText(cronExpr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Cron Expression Parser</h1>
      <p className="mb-6 text-slate-600">
        Parse, validate, and understand cron schedule expressions. See human-readable descriptions, field breakdowns, and upcoming run times.
      </p>

      <div className="border rounded-lg p-6 mb-6 space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Cron Expression</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={cronExpr}
              onChange={(e) => setCronExpr(e.target.value)}
              placeholder="* * * * *"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={copyCron}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          {validation.valid ? (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-700 font-medium">✓ Valid — </span>
              <span className="text-green-800">{humanized}</span>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ✗ {validation.error}
            </div>
          )}
        </div>

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.cron}
                onClick={() => setCronExpr(p.cron)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  cronExpr === p.cron
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Field Breakdown */}
        {validation.valid && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Field Breakdown</label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Field</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Value</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldBreakdown.map((f) => (
                    <tr key={f.field} className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-700">{f.field}</td>
                      <td className="py-2 px-3 font-mono text-slate-900 bg-slate-50 rounded">{f.value}</td>
                      <td className="py-2 px-3 text-slate-600">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Next Runs */}
        {validation.valid && nextRuns.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Next Scheduled Runs</label>
            <ol className="space-y-1">
              {nextRuns.map((run, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 font-mono">{run}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Reference */}
      <div className="border rounded-lg p-6 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Cron Format Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <h3 className="font-medium text-slate-700 mb-1">Format</h3>
            <code className="bg-white px-2 py-1 rounded border">minute hour day month weekday</code>
            <p className="mt-2">Five fields separated by spaces. Each field can be:</p>
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              <li><code>*</code> — any value</li>
              <li><code>*/n</code> — every n units</li>
              <li><code>1,3,5</code> — specific values</li>
              <li><code>1-5</code> — range</li>
              <li><code>1-5/2</code> — range with step</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-1">Special Notes</h3>
            <ul className="list-disc ml-5 space-y-0.5">
              <li>Day of week: 0 or 7 = Sunday</li>
              <li>Month: 1 = January through 12 = December</li>
              <li>Day of month: 1–31</li>
              <li>Hour: 0–23 (24-hour format)</li>
              <li>Minute: 0–59</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
