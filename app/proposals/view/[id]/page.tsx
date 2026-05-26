// app/proposals/view/[id]/page.tsx
// Dynamic proposal viewer — reads from automation/proposals/{id}.html or .json
'use client';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Detail | Zion Tech Group',
  description: 'View and download your custom Zion Tech Group service proposal.',
  alternates: { canonical: '/proposals/view/[id]' },};



// Pre-render as static — must return a non-empty array for output:export
// '__sample__' is a sentinel; the component falls through to notFound() for it
export async function generateStaticParams() {
  return [{ id: '__sample__' }];
}

// Next.js 15: params is a Promise that must be awaited
export default async function ProposalViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let html: string | null = null;
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const proposalsDir = path.join(process.cwd()!, '..', 'automation', 'proposals');
    const htmlFilePath = path.join(proposalsDir, `${id}.html`);
    const jsonFilePath = path.join(proposalsDir, `${id}.json`);

    if (fs.existsSync(htmlFilePath)) {
      html = fs.readFileSync(htmlFilePath, 'utf-8');
    } else if (fs.existsSync(jsonFilePath)) {
      // Rebuild from JSON data
      const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
      const companyName = data.companyName || 'Zion Tech Group';

      const allServicesPath = path.join(process.cwd()!, 'app', 'data', 'servicesData.json');
      const allServices: any[] = JSON.parse(fs.readFileSync(allServicesPath, 'utf-8'));
      const services = (data.selectedServices || [])
        .map((sid: string) => allServices.find((s: any) => s.id === sid))
        .filter(Boolean);

      const rows = services.map((s: any) =>
        `<tr><td style="padding:8px;border:1px solid #ddd;">${s.title}</td><td style="padding:8px;border:1px solid #ddd;">${s.category}</td><td style="padding:8px;border:1px solid #ddd;">$${s.pricing?.basic || 'Custom'}/mo</td></tr>`
      ).join('');
      const needsList = (data.needs || []).map((n: string) => `<li>${n}</li>`).join('');

      html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${companyName} — Zion Tech Group</title>
<style>body{font-family:Arial,sans-serif;padding:40px;color:#333}h1{color:#7c3aed;border-bottom:3px solid #7c3aed;padding-bottom:10px}
table{border-collapse:collapse;width:100%;margin-top:16px}th{background:#7c3aed;color:#fff;padding:10px;text-align:left}
td,th{border:1px solid #ddd;padding:8px}.cta{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;padding:20px;border-radius:8px;margin-top:30px}
.footer{margin-top:40px;font-size:12px;color:#999;border-top:1px solid #eee;padding-top:10px}
.meta{color:#888;font-size:14px;margin-bottom:20px}</style></head><body>
<h1>Zion Tech Group — Custom Proposal</h1>
<div class="meta">Proposal ID: ${id} &bull; Generated: ${new Date(data.generatedAt).toLocaleDateString()}</div>
<h2>Client Information</h2>
<p><strong>Company:</strong> ${companyName}</p>
<p><strong>Email:</strong> ${data.contactEmail}</p>
${data.contactPhone ? `<p><strong>Phone:</strong> ${data.contactPhone}</p>` : ''}
<p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
<p><strong>Timeline:</strong> ${data.timeline || 'Exploratory'}</p>
${needsList ? `<h2>Stated Needs</h2><ul>${needsList}</ul>` : ''}
<h2>Recommended Services</h2>
<table><thead><tr><th>Service</th><th>Category</th><th>Starting Price</th></tr></thead><tbody>${rows}</tbody></table>
<div class="cta"><h2 style="color:#fff;margin-top:0">Ready to get started?</h2>
<p>Contact: <strong>+1 302 464 0950</strong> or <strong>kleber@ziontechgroup.com</strong></p>
<p>364 E Main St STE 1008, Middletown, DE 19709</p></div>
<div class="footer">Zion Tech Group — All services include implementation support, SLA guarantees, and 24/7 monitoring.</div>
</body></html>`;
    }
  } catch { /* ignore — render notFound below */ }

  if (!html) notFound();

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container-page">
        <div className="flex justify-between items-center mb-6">
          <a href="/proposals/" className="text-slate-400 hover:text-white text-sm">&larr; Back to Proposals</a>
          <button
            onClick={() => {
              const blob = new Blob([html], { type: 'text/html' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `ztg-proposal-${id}.html`;
              a.click();
            }}
            className="btn-primary text-sm"
          >
            Download Proposal
          </button>
        </div>
        <div
          className="bg-white text-black rounded-xl p-8 shadow-2xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
