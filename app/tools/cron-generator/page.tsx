'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Sparkles, Calendar, HelpCircle } from 'lucide-react';

const intervals = [
  { id: 'every-minute', label: 'Every minute', cron: '* * * * *', desc: 'Runs every minute' },
  { id: 'every-5-min', label: 'Every 5 minutes', cron: '*/5 * * * *', desc: 'Runs every 5 minutes' },
  { id: 'every-15-min', label: 'Every 15 minutes', cron: '*/15 * * * *', desc: 'Runs every 15 minutes' },
  { id: 'every-30-min', label: 'Every 30 minutes', cron: '*/30 * * * *', desc: 'Runs every 30 minutes' },
  { id: 'hourly', label: 'Every hour', cron: '0 * * * *', desc: 'Runs at the start of every hour' },
  { id: 'daily', label: 'Daily at midnight', cron: '0 0 * * *', desc: 'Runs once a day at midnight' },
  { id: 'daily-noon', label: 'Daily at noon', cron: '0 12 * * *', desc: 'Runs once a day at 12:00 PM' },
  { id: 'weekly', label: 'Weekly (Sunday)', cron: '0 0 * * 0', desc: 'Runs every Sunday at midnight' },
  { id: 'monthly', label: 'Monthly (1st)', cron: '0 0 1 * *', desc: 'Runs on the 1st of every month' },
];

export default function CronGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [customCron, setCustomCron] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const generateCron = () => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  const selectInterval = (interval: string) => {
    setCustomCron(interval);
    setUseCustom(true);
  };

  const cronExpression = useCustom && customCron ? customCron : generateCron();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
  };

  const parseDescription = (cron: string): string => {
    const parts = cron.split(' ');
    const [m, h, dom, mon, dow] = parts;
    
    let desc = 'Runs ';
    
    if (m === '*') desc += 'every minute';
    else if (m.startsWith('*/')) desc += `every ${m.slice(2)} minutes`;
    else desc += `at minute ${m}`;
    
    if (h === '*') desc += ' of every hour';
    else if (h.startsWith('*/')) desc += ` every ${h.slice(2)} hours`;
    else desc += ` at hour ${h}`;
    
    if (dom !== '*') desc += ` on day ${dom}`;
    if (mon !== '*') desc += ` in month ${mon}`;
    if (dow !== '*') desc += ` on weekday ${dow}`;
    
    return desc;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Cron{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Expression Generator
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Generate cron expressions visually. Select your schedule and get 
            the exact cron syntax for your scheduled tasks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Select */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Quick Select
              </h3>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {intervals.map((interval) => (
                <button
                  key={interval.id}
                  onClick={() => selectInterval(interval.cron)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    cronExpression === interval.id
                      ? 'bg-green-600/20 border border-green-500/30'
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="text-white font-medium">{interval.label}</div>
                  <div className="text-slate-400 text-sm">{interval.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Custom Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-400" />
                Custom Builder
              </h3>
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded"
                />
                Use custom
              </label>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Minute */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Minute</label>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  disabled={useCustom}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="*">Every minute (*)</option>
                  <option value="*/5">Every 5 minutes (*/5)</option>
                  <option value="*/10">Every 10 minutes (*/10)</option>
                  <option value="*/15">Every 15 minutes (*/15)</option>
                  <option value="*/30">Every 30 minutes (*/30)</option>
                  <option value="0">At minute 0</option>
                </select>
              </div>

              {/* Hour */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Hour</label>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  disabled={useCustom}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="*">Every hour (*)</option>
                  <option value="*/2">Every 2 hours (*/2)</option>
                  <option value="*/4">Every 4 hours (*/4)</option>
                  <option value="*/6">Every 6 hours (*/6)</option>
                  <option value="*/12">Every 12 hours (*/12)</option>
                  <option value="0">At midnight (0)</option>
                  <option value="12">At noon (12)</option>
                </select>
              </div>

              {/* Day of Month */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Day of Month</label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  disabled={useCustom}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="*">Every day (*)</option>
                  <option value="1">1st of month</option>
                  <option value="15">15th of month</option>
                  <option value="1,15">1st and 15th</option>
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  disabled={useCustom}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="*">Every month (*)</option>
                  <option value="1">January</option>
                  <option value="6,7,8">Summer (Jun-Aug)</option>
                  <option value="1,4,7,10">Quarterly</option>
                </select>
              </div>

              {/* Day of Week */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  disabled={useCustom}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="*">Every day (*)</option>
                  <option value="1-5">Weekdays (Mon-Fri)</option>
                  <option value="0,6">Weekends</option>
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Generated Expression</h3>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-mono text-green-400 font-bold mb-3">
              {cronExpression}
            </div>
            <p className="text-slate-300">
              {parseDescription(cronExpression)}
            </p>
          </div>
        </motion.div>

        {/* Cron Format Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 p-4"
        >
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Cron Format Reference
          </h3>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            {[
              { label: 'Minute', range: '0-59' },
              { label: 'Hour', range: '0-23' },
              { label: 'Day', range: '1-31' },
              { label: 'Month', range: '1-12' },
              { label: 'Weekday', range: '0-6' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-white font-medium text-sm">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.range}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}