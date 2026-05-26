// Service Configurator Wizard — multi-step proposal builder
// Fully client-side: generates proposal HTML in-browser, no server needed
'use client';

import { useState, useMemo } from 'react';

import { allServices } from '@/data/servicesData';
import StepsIndicator from '@/components/StepsIndicator';

type Step = 'budget' | 'needs' | 'services' | 'timeline' | 'review';

const COMPANY = {
  name: 'Zion Tech Group',
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown, DE 19709',
};

export default function ConfiguratorPage() {
  const [step, setStep] = useState<Step>('budget');
  const [budget, setBudget] = useState<string>('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [proposalHtml, setProposalHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const needCategories = [
    'Reduce operational costs',
    'Improve customer experience',
    'Increase security & compliance',
    'Automate manual workflows',
    'Scale infrastructure rapidly',
    'Gain better analytics & insights',
    'Launch new digital products',
    'Modernize legacy systems',
    'Optimize cloud spend',
    'Enable remote/hybrid work',
  ];

  const steps: Step[] = ['budget', 'needs', 'services', 'timeline', 'review'];

  const recommendedServices = useMemo(() => {
    if (!budget || needs.length === 0) return [];
    return allServices.filter(s =>
      needs.some(n => s.description.toLowerCase().includes(n.split(' ')[0].toLowerCase()))
    ).slice(0, 5);
  }, [budget, needs]);

  const handleNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const handleBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  // ── Client-side proposal generator (no server needed) ──────────────
  const buildProposalHtml = (): string => {
    const services = selectedServices
      .map(id => allServices.find(s => s.id === id))
      .filter(Boolean) as typeof allServices;

    const rows = services.map(s => (
      `<tr>
        <td style="padding:8px;border:1px solid #ddd;">${s.title}</td>
        <td style="padding:8px;border:1px solid #ddd;">${s.category}</td>
        <td style="padding:8px;border:1px solid #ddd;">$${s.pricing?.basic || 'Custom'}/mo</td>
      </tr>`
    )).join('');

    const needsList = needs.map(n => `<li>${n}</li>`).join('');
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Proposal — ${companyName} — ${COMPANY.name}</title>
<style>
  body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:900px;margin:0 auto}
  h1{color:#7c3aed;border-bottom:3px solid #7c3aed;padding-bottom:10px}
  h2{color:#1e293b;margin-top:30px}
  table{border-collapse:collapse;width:100%;margin-top:16px}
  th{background:#7c3aed;color:#fff;padding:10px;text-align:left}
  td,th{border:1px solid #ddd;padding:8px}
  .cta{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;padding:20px;border-radius:8px;margin-top:30px}
  .footer{margin-top:40px;font-size:12px;color:#999;border-top:1px solid #eee;padding-top:10px}
  .meta{color:#888;font-size:14px;margin-bottom:20px}
  .kv{display:grid;grid-template-columns:1fr 2fr;gap:8px;margin:12px 0}
  .k{color:#888;font-size:13px}
</style></head><body>
<h1>${COMPANY.name} — Custom Proposal</h1>
<div class="meta">Generated: ${date} &bull; ${services.length} services recommended</div>

<h2>Client Information</h2>
<div class="kv">
  <span class="k">Company</span><span>${companyName}</span>
  <span class="k">Email</span><span>${contactEmail}</span>
  ${contactPhone ? `<span class="k">Phone</span><span>${contactPhone}</span>` : ''}
  <span class="k">Budget</span><span>${budget}</span>
  <span class="k">Timeline</span><span>${timeline}</span>
</div>

${needs ? `<h2>Stated Objectives</h2><ul>${needsList}</ul>` : ''}

<h2>Recommended Services</h2>
<table><thead><tr><th>Service</th><th>Category</th><th>Starting Price</th></tr></thead>
<tbody>${rows}</tbody></table>

${services.length > 0 ? `<p style="margin-top:12px;color:#666;font-size:14px">
  Monthly subtotal: $${services.reduce((sum, s) => sum + parseInt((s.pricing?.basic || '0').replace(/[^0-9]/g,'') || '0'), 0).toLocaleString()}/mo
</p>` : ''}

<div class="cta">
  <h2 style="color:#fff;margin-top:0">Ready to get started?</h2>
  <p>Contact: <strong>${COMPANY.phone}</strong> or <strong>${COMPANY.email}</strong></p>
  <p>${COMPANY.address}</p>
</div>

<div class="footer">
  ${COMPANY.name} — All services include implementation support, SLA guarantees, and 24/7 monitoring.<br>
  This proposal was generated on ${date} and is valid for 30 days.
</div>
</body></html>`;
  };

  const generateProposal = () => {
    setErrorMsg(null);
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service.');
      return;
    }
    setGeneratingPdf(true);
    // Small delay to show loading state
    setTimeout(() => {
      try {
        const html = buildProposalHtml();
        setProposalHtml(html);
      } catch (err) {
        setErrorMsg('Failed to generate proposal. Please try again.');
        console.error(err);
      } finally {
        setGeneratingPdf(false);
      }
    }, 800);
  };

  const downloadProposal = () => {
    if (!proposalHtml) return;
    const blob = new Blob([proposalHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const safeName = companyName.replace(/[^a-z0-9]/gi, '_');
    a.download = `${COMPANY.name.replace(/\s+/g,'_')}_Proposal_${safeName}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const emailProposal = () => {
    if (!proposalHtml) return;
    // Open user's email client with a pre-filled message
    const subject = encodeURIComponent(`Proposal — ${companyName} — ${COMPANY.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nThank you for your interest in ${COMPANY.name}.\n\n` +
      `Please find your custom proposal attached (open in any browser and print to PDF).\n\n` +
      `Reply to this email or call ${COMPANY.phone} to get started.\n\n` +
      `${COMPANY.name}\n${COMPANY.email}\n${COMPANY.phone}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  const printProposal = () => {
    if (!proposalHtml) return;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(proposalHtml);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 500);
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container-page max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Build Your Custom Solution
        </h1>
        <p className="text-slate-300 text-center mb-8">
          Answer a few questions — we{'\''}ll design the perfect service bundle and send you a detailed proposal.
        </p>

        <StepsIndicator steps={steps.map(s => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} current={step} />

        <div className="mt-8 bg-slate-900/40 rounded-xl border border-slate-700/50 p-8">
          {/* Step 1: Budget */}
          {step === 'budget' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">What{'\''}s your monthly budget?</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Under $1,000', '$1,000–$5,000', '$5,000–$20,000', '$20,000–$100,000', 'Over $100,000'].map(b => (
                  <button
                    key={b}
                    onClick={() => { setBudget(b); handleNext(); }}
                    className="rounded-lg border border-purple-500/50 bg-purple-900/20 px-6 py-4 text-white hover:bg-purple-900/40 transition"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Needs */}
          {step === 'needs' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">What are your top business objectives? (select all that apply)</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {needCategories.map(n => (
                  <label key={n} className="flex items-center gap-3 rounded-lg border border-slate-700 p-4 cursor-pointer hover:border-purple-500/50">
                    <input
                      type="checkbox"
                      checked={needs.includes(n)}
                      onChange={e => {
                        if (e.target.checked) setNeeds([...needs, n]);
                        else setNeeds(needs.filter(x => x !== n));
                      }}
                      className="h-5 w-5 rounded border-purple-500"
                    />
                    <span className="text-white">{n}</span>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleNext} disabled={needs.length === 0}
                  className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Service Selection */}
          {step === 'services' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Review Recommended Services</h2>
              <p className="text-slate-400 mb-6">These were selected based on your budget and needs. Customize your bundle.</p>

              <div className="space-y-4">
                {recommendedServices.map(s => (
                  <div key={s.id} className="flex items-start gap-4 rounded-lg border border-slate-700 p-4">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={e => {
                        if (e.target.checked) setSelectedServices([...selectedServices, s.id]);
                        else setSelectedServices(selectedServices.filter(id => id !== s.id));
                      }}
                      className="mt-1 h-5 w-5 rounded border-purple-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{s.title}</div>
                      <div className="text-sm text-slate-400 mb-2">{s.description.substring(0, 120)}...</div>
                      <div className="text-purple-300 font-medium">
                        {Object.values(s.pricing)[0] as string}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={handleBack} className="rounded-full border border-slate-600 px-6 py-3 text-white hover:bg-slate-800">Back</button>
                <button onClick={handleNext} className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Timeline & Contact */}
          {step === 'timeline' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Timeline & Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Implementation Timeline</label>
                  <select value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white">
                    <option value="">Select timeline...</option>
                    <option value="ASAP">As soon as possible (urgent)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="3-months">Within 3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="exploratory">Just exploring (no immediate need)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="you@company.com" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone (optional)</label>
                  <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+1 302 464 0950" className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white" />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="rounded-full border border-slate-600 px-6 py-3 text-white hover:bg-slate-800">Back</button>
                <button onClick={handleNext} disabled={!companyName || !contactEmail || !timeline}
                  className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500 disabled:opacity-50">
                  Review Proposal
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Generate */}
          {step === 'review' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Your Custom Proposal</h2>
              <div className="bg-slate-800/60 rounded-lg p-6 mb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><div className="text-sm text-slate-400">Company</div><div className="text-white font-medium">{companyName}</div></div>
                  <div><div className="text-sm text-slate-400">Email</div><div className="text-white font-medium">{contactEmail}</div></div>
                  <div><div className="text-sm text-slate-400">Timeline</div><div className="text-white font-medium">{timeline}</div></div>
                  <div><div className="text-sm text-slate-400">Budget Range</div><div className="text-white font-medium">{budget}</div></div>
                </div>
                <div className="mt-6">
                  <div className="text-sm text-slate-400 mb-2">Selected Services ({selectedServices.length})</div>
                  <ul className="space-y-2">
                    {selectedServices.map(sid => {
                      const s = allServices.find(x => x.id === sid);
                      return s ? <li key={sid} className="text-white">• {s.title}</li> : null;
                    })}
                  </ul>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Proposal will include:</div>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>✓ Detailed service descriptions and features</li>
                    <li>✓ Volume discounts based on selected bundle</li>
                    <li>✓ Implementation timeline and milestones</li>
                    <li>✓ Next steps and contact information</li>
                    <li>✓ Download HTML / Print to PDF</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-4">
                <button onClick={handleBack} className="rounded-full border border-slate-600 px-6 py-3 text-white hover:bg-slate-800">Back</button>
                <button onClick={generateProposal} disabled={generatingPdf || selectedServices.length === 0}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white hover:from-purple-500 hover:to-pink-500 disabled:opacity-50">
                  {generatingPdf ? 'Generating…' : 'Generate & Email Proposal'}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-center text-red-400">
                  {errorMsg}
                </div>
              )}

              {proposalHtml && !errorMsg && (
                <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="text-green-400 font-medium mb-3 text-center">✓ Proposal generated!</div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={downloadProposal} className="rounded-full bg-purple-600 px-6 py-2 text-white text-sm font-semibold hover:bg-purple-500">
                      Download HTML
                    </button>
                    <button onClick={printProposal} className="rounded-full border border-purple-400 px-6 py-2 text-purple-300 text-sm font-semibold hover:bg-purple-900/30">
                      Print / Save as PDF
                    </button>
                    <button onClick={emailProposal} className="rounded-full border border-slate-600 px-6 py-2 text-slate-300 text-sm font-semibold hover:bg-slate-800">
                      Open in Email
                    </button>
                  </div>
                  <details className="mt-4">
                    <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-200">Preview Proposal</summary>
                    <div className="mt-2 border border-slate-700 rounded overflow-hidden" style={{ maxHeight: '400px', overflow: 'auto' }}>
                      <iframe
                        srcDoc={proposalHtml}
                        title="Proposal Preview"
                        className="w-full"
                        style={{ height: '380px', border: 'none' }}
                        sandbox=""
                      />
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
