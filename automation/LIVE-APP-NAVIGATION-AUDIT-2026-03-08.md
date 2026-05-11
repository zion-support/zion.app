# Live App Navigation Audit – 2026-03-08

Audit of https://ziontechgroup.com navigation and automations to fix/improve nav and create missing pages. Live site visited 2026-03-08.

## Live site navigation snapshot

- **Primary nav:** Home, Solutions, Services, Pricing, Contact
- **Footer / resource links:** Search, FAQ, Blog, Case Studies, Innovation Bundles, Community, Industries, Products, AI Services, Consultation, Automation, Micro SAAS, About, Careers, Contact, Partners, Terms, Privacy, Site Map
- **Solution pages:** 47+ industry solution routes (e.g. /solutions/healthcare, /solutions/real-estate-property)
- **Key routes:** /, /services, /solutions, /pricing, /contact, /about, /blog, /industries, /case-studies, /products, /ai-services, /consultation, /site-map

## Audit results

- **Live navigation audit** (automation/reports/live-navigation-audit-latest.json): 245 unique internal links from live site; 692 local routes; 0 broken on live; 0 nav constants pointing to missing pages. 162 links on live site are not in nav constants (expected: many solution/service deep links).
- **Missing pages:** None. All linked solution routes, service routes, and product routes have corresponding app pages.

## New / updated automations

1. **ai-weekly-live-app-audit-auto-fix.yml** – Added step Live Navigation Audit (npm run nav:live-audit) before Site Link Audit. Upload artifact includes live-navigation-audit-latest.json.
2. **ai-automation-ideas-from-live-audit.cjs** – Uses liveNotInNavSample/liveNotInNavCount and navBrokenCount/navBroken; adds backlog ideas for syncing nav and fixing broken nav hrefs when applicable.
3. **ai-live-navigation-audit.cjs** – Report includes liveNotInNav and missingFromApp for consumers.
4. **ai-live-nav-sync-suggestions.cjs** – New script. Reads live-navigation-audit-latest.json, writes live-nav-sync-suggestions-latest.json (suggested nav constant additions). npm: nav:sync-suggestions.
5. **package.json** – Added nav:sync-suggestions script.

## Commands

- `npm run nav:live-audit` – Crawl live site, compare to nav constants and local routes.
- `npm run nav:sync-suggestions` – Generate nav sync suggestions from latest audit report.

## References

- automation/GITHUB-ACTIONS-AUDIT-2026-03-08.md
- automation/ai-live-navigation-audit.cjs
- automation/ai-live-nav-sync-suggestions.cjs
- app/constants/navigation.ts
