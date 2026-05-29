"use client";

import { useState, useEffect, useCallback } from "react";

interface ActivityItem {
  id: string;
  text: string;
  type: "service" | "client" | "deploy" | "metric";
  timestamp: Date;
  icon: string;
}

const ACTIVITY_TEMPLATES = [
  { text: "AI Strategy Consulting engagement started", type: "service" as const, icon: "🧠" },
  { text: "Cloud migration architecture review completed", type: "service" as const, icon: "☁️" },
  { text: "SOC 2 compliance audit initiated", type: "service" as const, icon: "🔒" },
  { text: "Custom LLM model deployed to production", type: "service" as const, icon: "🤖" },
  { text: "Multi-cloud Kubernetes cluster provisioned", type: "service" as const, icon: "⚙️" },
  { text: "Data pipeline processing 1M+ events/day", type: "metric" as const, icon: "📊" },
  { text: "New AI Automation workflow activated", type: "deploy" as const, icon: "🚀" },
  { text: "RPA bot deployed — 40 hours/month saved", type: "metric" as const, icon: "⚡" },
  { text: "Client onboarding: AI Readiness Assessment", type: "client" as const, icon: "🎯" },
  { text: "Penetration testing engagement completed", type: "service" as const, icon: "🛡️" },
  { text: "Real-time anomaly detection system live", type: "deploy" as const, icon: "📡" },
  { text: "ETL pipeline processing 500GB daily", type: "metric" as const, icon: "🔄" },
  { text: "New client: Healthcare AI integration", type: "client" as const, icon: "🏥" },
  { text: "CI/CD pipeline optimization — 60% faster builds", type: "metric" as const, icon: "⚡" },
  { text: "Business intelligence dashboard delivered", type: "service" as const, icon: "📈" },
  { text: "Serverless AI API deployed — <50ms latency", type: "deploy" as const, icon: "🔥" },
  { text: "New client: Financial services automation", type: "client" as const, icon: "💰" },
  { text: "Zero-trust security architecture implemented", type: "service" as const, icon: "🔐" },
  { text: "Micro-SaaS platform launched", type: "deploy" as const, icon: "✨" },
  { text: "99.9% uptime SLA maintained — 365 days", type: "metric" as const, icon: "🏆" },
];

function generateActivity(): ActivityItem {
  const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  return {
    ...template,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date(),
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [visible, setVisible] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Initialize with a few random activities
    const initial: ActivityItem[] = [];
    for (let i = 0; i < 5; i++) {
      const item = generateActivity();
      item.timestamp = new Date(Date.now() - Math.random() * 3600000 * 24); // Random time in last 24h
      initial.push(item);
    }
    setActivities(initial.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  useEffect(() => {
    // Add new activity every 8-15 seconds
    const interval = setInterval(() => {
      const newItem = generateActivity();
      setActivities((prev) => [newItem, ...prev].slice(0, 20));
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  const displayed = isExpanded ? activities : activities.slice(0, visible);

  return (
    <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h2 className="text-lg font-bold text-slate-900">Live Activity Feed</h2>
          <span className="text-xs text-emerald-600 font-medium">● Real-time</span>
        </div>
        <span className="text-xs text-slate-500">{activities.length} recent activities</span>
      </div>

      <div className="space-y-2">
        {displayed.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 rounded-lg p-3 transition-all duration-500 ${
              index === 0 && !isExpanded
                ? "bg-emerald-50/80 border border-emerald-200"
                : "bg-white/60 border border-transparent hover:bg-white"
            }`}
            style={{
              opacity: 1,
              animation: index === 0 && !isExpanded ? "slideIn 0.5s ease-out" : undefined,
            }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{item.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{timeAgo(item.timestamp)}</span>
                <span
                  className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${
                    item.type === "service"
                      ? "bg-blue-100 text-blue-700"
                      : item.type === "client"
                      ? "bg-purple-100 text-purple-700"
                      : item.type === "deploy"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > visible && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full text-center text-sm text-emerald-600 font-medium hover:text-emerald-800 transition py-2 rounded-lg hover:bg-emerald-50"
        >
          {isExpanded ? "Show less" : `Show all ${activities.length} activities`}
        </button>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
