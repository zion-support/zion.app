'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Info, Check, Sparkles, HelpCircle } from 'lucide-react';

interface Explanation {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  description: string;
}

const specialValues: Record<string, string> = {
  '*': 'every',
  '*/5': 'every 5',
  '*/10': 'every 10',
  '*/15': 'every 15',
  '*/30': 'every 30',
  '@yearly': 'yearly (Jan 1, 00:00)',
  '@annually': 'yearly (Jan 1, 00:00)',
  '@monthly': 'monthly (1st, 00:00)',
  '@weekly': 'weekly (Sun, 00:00)',
  '@daily': 'daily (00:00)',
  '@midnight': 'daily (00:00)',
  '@hourly': 'hourly (00:00)',
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CronExpressionExplainer() {
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validateCron = (cron: string): boolean => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return false;
    
    // Check each field is valid (simplified validation)
    const patterns = [
      /^(\*|(\d+)|(\d+-\d+)|(\d+,\d+)|\*\/(\d+))$/, // minute
      /^(\*|(\d+)|(\d+-\d+)|(\d+,\d+)|\*\/(\d+))$/, // hour
      /^(\*|(\d+)|(\d+-\d+)|(\d+,\d+)|\*\/(\d+))$/, // day of month
      /^(\*|(\d+)|(\d+-\d+)|(\d+,\d+)|\*\/(\d+))$/, // month
      /^(\*|(\d+)|(\d+-\d+)|(\d+,\d+)|\*\/(\d+))$/, // day of week
    ];
    
    return patterns.every((pattern, index) => pattern.test(parts[index]));
  };

  const explainField = (field: string, fieldType: 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'): string => {
    if (specialValues[field]) return specialValues[field];
    
    if (field === '*') {
      return fieldType === 'minute' ? 'every minute' :
             fieldType === 'hour' ? 'every hour' :
             fieldType === 'dayOfMonth' ? 'every day' :
             fieldType === 'month' ? 'every month' :
             'every day of week';
    }
    
    if (field.startsWith('*/')) {
      const interval = field.slice(2);
      return fieldType === 'minute' ? `every ${interval} minutes` :
             fieldType === 'hour' ? `every ${interval} hours` :
             fieldType === 'dayOfMonth' ? `every ${interval} days` :
             fieldType === 'month' ? `every ${interval} months` :
             `every ${interval} days of week`;
    }
    
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      if (fieldType === 'month') {
        return `from ${monthNames[start - 1]} to ${monthNames[end - 1]}`;
      }
      if (fieldType === 'dayOfWeek') {
        return `from ${dayNames[start]} to ${dayNames[end]}`;
      }
      return `from ${start} to ${end}`;
    }
    
    if (field.includes(',')) {
      const values = field.split(',').map(v => {
        const num = parseInt(v, 10);
        if (fieldType === 'month') return monthNames[num - 1];
        if (fieldType === 'dayOfWeek') return dayNames[num];
        return String(num);
      });
      return values.join(', ');
    }
    
    const num = parseInt(field, 10);
    if (fieldType === 'month') return monthNames[num - 1];
    if (fieldType === 'dayOfWeek') return dayNames[num];
    return String(num);
  };

  const generateExplanation = () => {
    if (!validateCron(cronExpression)) {
      setIsValid(false);
      setError('Invalid cron expression format. Use: * * * * * (minute hour day month weekday)');
      setExplanation(null);
      return;
    }
    
    setIsValid(true);
    setError(null);
    
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.trim().split(/\s+/);
    
    const descParts = [];
    
    // Build human-readable description
    if (minute !== '*') {
      if (minute.startsWith('*/')) {
        descParts.push(`every ${minute.slice(2)} minutes`);
      } else {
        descParts.push(`at minute ${minute}`);
      }
    }
    
    if (hour !== '*') {
      if (hour.startsWith('*/')) {
        descParts.push(`every ${hour.slice(2)} hours`);
      } else {
        descParts.push(`at ${hour.padStart(2, '0')}:00`);
      }
    }
    
    if (dayOfMonth !== '*') {
      if (dayOfMonth.startsWith('*/')) {
        descParts.push(`every ${dayOfMonth.slice(2)} days`);
      } else {
        descParts.push(`on day ${dayOfMonth}`);
      }
    }
    
    if (month !== '*') {
      if (month.startsWith('*/')) {
        descParts.push(`every ${month.slice(2)} months`);
      } else {
        descParts.push(`in ${monthNames[parseInt(month, 10) - 1]}`);
      }
    }
    
    if (dayOfWeek !== '*') {
      if (dayOfWeek.startsWith('*/')) {
        descParts.push(`every ${dayOfWeek.slice(2)} weeks on day`);
      } else {
        descParts.push(`on ${dayNames[parseInt(dayOfWeek, 10)]}`);
      }
    }
    
    const description = descParts.length > 0 
      ? `Runs ${descParts.join(' and ')}.`
      : 'Runs every minute.';
    
    setExplanation({
      minute: explainField(minute, 'minute'),
      hour: explainField(hour, 'hour'),
      dayOfMonth: explainField(dayOfMonth, 'dayOfMonth'),
      month: explainField(month, 'month'),
      dayOfWeek: explainField(dayOfWeek, 'dayOfWeek'),
      description
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCronExpression(e.target.value);
    generateExplanation();
  };

  useEffect(() => {
    generateExplanation();
  }, [generateExplanation]);
  
  const examples = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every day at 8:30 AM', value: '30 8 * * *' },
    { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
    { label: 'Mondays at 9 AM', value: '0 9 * * 1' },
    { label: '1st of every month at midnight', value: '0 0 1 * *' },
    { label: 'Weekdays at 5 PM', value: '0 17 * * 1-5' },
    { label: 'Quarterly (Jan, Apr, Jul, Oct)', value: '0 0 1 1,4,7,10 *' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            AI-Powered
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Cron{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Expression Explainer
            </span>
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Understand what your cron expressions mean in plain English
          </p>
        </motion.div>

        {/* Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-slate-900">Cron Expression</span>
            </div>
          </div>
          <div className="p-4">
            <input
              type="text"
              value={cronExpression}
              onChange={handleChange}
              className="w-full font-mono text-lg text-slate-800 bg-slate-50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cron expression (e.g., 0 0 * * *)"
              spellCheck={false}
            />
            {!isValid && error && (
              <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Explanation */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Plain English Explanation</h3>
            </div>
            <p className="text-slate-300 text-lg">{explanation.description}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {[
                { label: 'Minute', value: explanation.minute },
                { label: 'Hour', value: explanation.hour },
                { label: 'Day', value: explanation.dayOfMonth },
                { label: 'Month', value: explanation.month },
                { label: 'Weekday', value: explanation.dayOfWeek },
              ].map((field) => (
                <div key={field.label} className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-white font-medium text-sm">{field.label}</p>
                  <p className="text-slate-400 text-xs">{field.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Examples */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Common Examples
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {examples.map((example) => (
              <button
                key={example.label}
                onClick={() => {
                  setCronExpression(example.value);
                  generateExplanation();
                }}
                className="group flex flex-col items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div className="text-slate-500 text-sm mb-2">{example.label}</div>
                <div className="font-mono text-lg text-slate-900">{example.value}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Fields Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Field Reference
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Minute', range: '0-59', examples: ['*', '*/15', '0', '30'] },
              { label: 'Hour', range: '0-23', examples: ['*', '*/6', '0', '12'] },
              { label: 'Day', range: '1-31', examples: ['*', '*/7', '1', '15'] },
              { label: 'Month', range: '1-12', examples: ['*', '*/3', '1', '6,9,12'] },
              { label: 'Weekday', range: '0-6 (Sun=0)', examples: ['*', '*/1', '0', '1-5'] },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-4 py-2">
                <div className="w-24">
                  <p className="text-white font-medium">{field.label}</p>
                  <p className="text-slate-400 text-xs">{field.range}</p>
                </div>
                <div className="flex-1 space-x-3">
                  {field.examples.map((ex) => (
                    <span key={ex} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Special Strings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-green-400" />
            Special Strings
          </h3>
          <div className="space-y-3">
            {[
              { str: '@yearly', desc: 'Run once a year at midnight of Jan 1' },
              { str: '@annually', desc: 'Same as @yearly' },
              { str: '@monthly', desc: 'Run once a month at midnight of the 1st' },
              { str: '@weekly', desc: 'Run once a week at midnight of Sunday' },
              { str: '@daily', desc: 'Run once a day at midnight' },
              { str: '@midnight', desc: 'Same as @daily' },
              { str: '@hourly', desc: 'Run once an hour at minute 0' },
            ].map((item) => (
              <div key={item.str} className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-green-600/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-medium">{item.str}</div>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}