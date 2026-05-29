"use client";

import { useState, useMemo } from "react";

interface ServiceOption {
  id: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  icon: string;
  description: string;
}

const SERVICES: ServiceOption[] = [
  { id: "ai", name: "AI & Machine Learning", category: "ai", priceMin: 2000, priceMax: 15000, icon: "🧠", description: "Custom ML models, NLP, computer vision, predictive analytics" },
  { id: "it", name: "IT Infrastructure", category: "it", priceMin: 1000, priceMax: 8000, icon: "🖥️", description: "Servers, networking, cloud migration, managed services" },
  { id: "cloud", name: "Cloud & DevOps", category: "cloud", priceMin: 1500, priceMax: 12000, icon: "☁️", description: "AWS/Azure/GCP, Kubernetes, CI/CD pipelines" },
  { id: "security", name: "Cybersecurity", category: "security", priceMin: 2500, priceMax: 20000, icon: "🔒", description: "Pen testing, SOC-as-a-Service, compliance audits" },
  { id: "data", name: "Data Analytics & BI", category: "data", priceMin: 1500, priceMax: 10000, icon: "📊", description: "Dashboards, ETL pipelines, data warehousing" },
  { id: "auto", name: "Automation & RPA", category: "automation", priceMin: 1000, priceMax: 8000, icon: "⚡", description: "Workflow automation, RPA bots, integration" },
  { id: "web", name: "Web & App Development", category: "web", priceMin: 2000, priceMax: 25000, icon: "🌐", description: "Full-stack development, SaaS platforms, e-commerce" },
  { id: "blockchain", name: "Blockchain & Web3", category: "blockchain", priceMin: 5000, priceMax: 30000, icon: "⛓️", description: "Smart contracts, DeFi, NFT platforms" },
  { id: "iot", name: "IoT Solutions", category: "iot", priceMin: 3000, priceMax: 20000, icon: "📡", description: "IoT devices, sensor networks, edge computing" },
];

const COMPANY_SIZES = [
  { id: "startup", label: "Startup (1-10)", multiplier: 0.7 },
  { id: "small", label: "Small (11-50)", multiplier: 1.0 },
  { id: "mid", label: "Mid-size (51-200)", multiplier: 1.3 },
  { id: "enterprise", label: "Enterprise (200+)", multiplier: 1.8 },
];

export default function PricingCalculator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState("small");
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const estimate = useMemo(() => {
    const size = COMPANY_SIZES.find((s) => s.id === companySize);
    const mult = size?.multiplier || 1;
    const sel = SERVICES.filter((s) => selected.includes(s.id));
    
    if (sel.length === 0) return null;

    const min = Math.round(sel.reduce((sum, s) => sum + s.priceMin * mult, 0));
    const max = Math.round(sel.reduce((sum, s) => sum + s.priceMax * mult, 0));
    const hourlyRate = 125; // USD/hour
    const estimatedHours = Math.round((min + max) / 2 / hourlyRate);

    return { min, max, hours: estimatedHours, services: sel, size: size?.label || "" };
  }, [selected, companySize]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm font-semibold"
      >
        <span className="text-lg">💰</span>
        <span>Estimate Project Cost</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">💰 Project Cost Estimator</h3>
            <p className="text-xs text-blue-100">Select services for instant estimate</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">✕</button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Company size */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Company Size</label>
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            {COMPANY_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => setCompanySize(s.id)}
                className={`text-xs py-2 px-2 rounded-lg border transition ${
                  companySize === s.id
                    ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Services</label>
          <div className="mt-1 space-y-1.5">
            {SERVICES.map((s) => {
              const isSelected = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg border transition ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                        {s.name}
                      </span>
                      {isSelected && <span className="text-blue-500 text-xs">✓</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{s.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimate result */}
        {estimate && (
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4">
            <div className="text-center">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Estimated Range</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                ${estimate.min.toLocaleString()} — ${estimate.max.toLocaleString()}
              </p>
              <p className="text-xs text-blue-500 mt-1">~{estimate.hours} hours of work</p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 space-y-1">
              <p>📦 {estimate.services.length} service{estimate.services.length > 1 ? "s" : ""} selected</p>
              <p>🏢 Company size: {estimate.size}</p>
              <p>💡 Final pricing may vary based on specific requirements</p>
            </div>
            <a
              href="/contact#engagement"
              className="mt-3 block w-full text-center rounded-lg bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition"
            >
              Get Exact Quote →
            </a>
          </div>
        )}

        {!estimate && (
          <div className="text-center py-4 text-sm text-slate-400">
            Select services above to see estimated pricing
          </div>
        )}
      </div>
    </div>
  );
}
