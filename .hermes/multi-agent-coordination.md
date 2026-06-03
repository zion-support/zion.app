# Shared Task Board — Zion Tech Group Multi-Agent
> Source of truth for all 6 bots. Update on status change.
> Location: ~/.hermes/multi-agent-coordination.md (synced by @Kilo)
> Last updated: 2026-06-12T21:15:00-03:00

## Bot Roster
| Bot | Role | Status | Current Task |
|-----|------|--------|-------------|
| @windows_carol_bot | 🖥️ DevOps & Infrastructure | 🟢 Active | CI/CD workflows, wave integration, accessibility |
| @Kilo_openclaw_kleber_bot | 🧠 Intelligence & Orchestration | 🟢 Active | Coordination lead, quality audits |
| @tablet_kleber_bot | 📱 Content & Research | 🟢 Active | Wave 209 research done, awaiting integration |
| @Windows_quel_bot | 🔧 Code & Implementation | 🔵 Available | Site quality improvements |
| @Rocket_Kleber_bot | 🚀 Integration & Delivery | 🔵 Available | Build/deploy automation |
| @OWL | 🦉 Build & Deploy | 🟢 Active | Wave integration, build running, dashboard enhancement |

## Active Tasks (P0)
None — all clear ✅

## In Progress (P1)
| ID | Task | Owner | Status |
|-----|------|-------|--------|
| P1-2 | Site quality pass — thin pages, empty benefits | @Windows_quel | ⚠️ STALE >72h — no progress since June 6. @Windows_quel is 🔵 Available, needs kickstart |
| P1-3 | Full site link crawl + fix broken links | @OWL | 🔄 Active — CI/CD deploys timing out at 20min, all cancelled. Site live but new pages 404 |
| P1-4 | Dashboard v3 — real-time data, agent auto-update | @OWL | 🔄 Active — dashboard/ still 404, deploy not completing |

## Backlog (P2)
| ID | Task | Owner | Notes |
|-----|------|-------|-------|
| B2 | CI/CD pipeline hardening | @Rocket | Multiple workflows already added — optimize further |
| B3 | GitHub auth for Actions triage | @windows_carol | Needs gh auth on remote |
| B4 | Service page auto-generation | @tablet | Automated via postbuild |
| B5 | Thin page content enrichment | @Kilo | Ongoing audits |
| B6 | Wave 209 integration | @tablet + @OWL | Research done, needs integration |
| B7 | Site navigation/design improvements | @Windows_quel | Reorganize nav, improve layout |
| B8 | Agent self-improvement plan execution | @Kilo | Review learning log, update skills |

## Blocked
| ID | Task | What's Needed |
|-----|------|---------------|
| X1 | Email responder live | Kleber: Gmail app password |
| X2 | GitHub Actions triage | Kleber: gh auth on remote machine |
| X3 | CI/CD deploy completing | All "Deploy on Push" runs timing out at 20min (cancelled). Build likely too large (795+ pages). Need to investigate timeout config or reduce build scope. |

## Wave Integration Status
| Wave | Services | Status |
|------|----------|--------|
| 174-180 | ~497 services | ✅ Integrated |
| 183-185 | 19 services | ✅ Fixed (interface + categories) |
| 186 | 6 services | ✅ Integrated |
| 187 | 5 services | ✅ Integrated |
| 188-192 | 44 services | ✅ Integrated |
| 193-196 | 41 services | ✅ Integrated |
| 197-206 | ~160 services | ✅ Integrated |
| 207 | 15 services | ✅ Integrated (5 OWL + 10 Carol) |
| 208 | 14 services | ✅ Integrated (5 OWL new categories + 9 Carol) |
| **209** | **5 services** | **✅ Integrated — Kafka, Meilisearch, Plane, Playwright, Kong Gateway** |
| **772+** | **Base services** | **✅ In servicesData.ts** |
| **Total** | **~795 services** | **✅ Pushed — CI/CD building** |

## Schema Rules (MUST FOLLOW)
1. **Category values**: always lowercase (`ai`, `micro-saas`, `it`, `security`, `cloud`, `data`, `automation`)
2. **Service interface**: define locally in wave file OR import from servicesData — both work, but local interface is preferred to avoid circular dep
3. **Required fields**: `id`, `title`, `description`, `features[]`, `benefits[]`, `pricing`, `contactInfo`, `icon`, `href`, `category`, `industry`
4. **Optional fields**: `popular?`, `stage?: 'published' | 'beta' | 'planned'`
5. **Contact info**: use `website: 'https://ziontechgroup.com'` for consistency
6. **Always include features AND benefits** — service detail page crashes without them
7. **CRLF check**: ensure wave files use LF line endings, not CRLF (causes SWC wasm compiler crash on Node v26)

## Site State
- **Build**: 🔄 CI/CD deploy manually triggered (run 26913728096), timeout increased to 30min
- **Type-check**: ✅ `npx tsc --noEmit` — clean
- **Services**: ~795 in servicesData.ts (waves 174-209)
- **Site**: 200 OK — https://ziontechgroup.com (main page + static pages)
- **Dashboard**: 404 — awaiting CI/CD deploy (new page, not in old cache)
- **Working pages**: / (200), /services/ (200), /blog/ (200), /contact/ (200), /about/ (200), /configurator/ (200), /proposals/ (200), /careers/ (200), /faq/ (200), /search/ (200), /pricing/ (200), /privacy/ (200), /terms/ (200), /sitemap.xml (200)
- **Failing pages**: /dashboard/ (404), wave 208-209 service pages (404) — all awaiting deploy
- **Link crawl**: 16 OK, 19 404 — ALL 404s are new pages not yet deployed. No broken links in code.
- **Root cause**: Previous deploys cancelled at 20min timeout. Fix: timeout increased to 30min.
- **Cron jobs**: 4 active (link-monitor, org-health, wave-research, email-readiness)

## Delegation Log (recent)
| Time | Bot | Action | Result |
|------|-----|--------|--------|
| 2026-06-03 00:35 | @Kilo | Fix 67 placeholder services | Thin pages: 490→223 |
| 2026-06-03 00:35 | @Kilo | Waves 183-185 integration | Added missing imports |
| 2026-06-03 02:00 | @windows_carol | Unstoppable CI/CD workflows | 5+ workflow files added |
| 2026-06-03 02:45 | @Kilo | **ORGANIZE** | Fixed wave175/180 missing imports, Service interfaces, category normalization, circular dep. Pushed |
| 2026-06-03 03:00 | @Kilo | **ORGANIZE** | Verified all clean, updated coordination doc |
| 2026-06-03 03:30 | @Kilo | **ORGANIZE** | Fixed wave189 import mismatch + shell error. Pushed 3dd993f |
| 2026-06-03 04:00 | @Kilo | **ORGANIZE** | Confirmed stable, no action needed |
| 2026-06-03 04:20 | other bots | Waves 191-192 added | +20 services, properly integrated |
| 2026-06-03 07:30 | @Kilo | **ORGANIZE** | Verified waves 191-192 clean, type-check green, updated coordination doc |
| 2026-06-04 07:00 | @Kilo | **ORGANIZE** | Cron review: site 200 OK, P1-2 stale (no progress >24h), rebalancing suggested |
| 2026-06-04 08:00 | @OWL | Waves 193-195 recovery | Re-created after Carol force-push, added features+benefits, fixed services/page.tsx unclosed fragment + CRLF, null guards on detail page |
| 2026-06-04 08:30 | @OWL | Wave 196 | +10 services pushed (5e0bdbc). Site 200 OK |
| 2026-06-04 09:00 | @OWL | Fleet coordination | Updated coordination doc, all bots synced |
| 2026-06-04 14:00 | @tablet | Wave 207 research | 5 new services in 5 categories: Grafana, Keycloak, Strapi, Medusa, Outline |
| 2026-06-06 18:00 | @Kilo | **ORGANIZE** | Full fleet rebalance. Updated coord doc. All bots synced. Delegating P1-2→@Windows_quel, P1-1→@tablet for wave 208 |
| 2026-06-06 20:00 | @Kilo | **ORGANIZE** | Wave 207 integrated (Grafana, Keycloak, Strapi, Medusa, Outline). 5 new categories. Type-check clean. P1-1→Wave 208. Cron scheduler stale (next_run_at stuck on June 3). |
| 2026-06-09 00:00 | @Kilo | **ORGANIZE** | Site 200 OK. Fleet review: P1-2 stale >72h (@Windows_quel available to take it). P1-1 Wave 208 research borderline (~48h). Rebalanced: P1-2→@Windows_quel (active), no other changes needed. |
| 2026-06-03 14:11 | @Kilo | **ORGANIZE** | Full fleet reorganization per Kleber directive. Rebalanced all P1/P2 tasks. Delegated: Wave 208 research→@tablet, site quality→@Windows_quel, CI/CD→@Rocket. Sent coordination message to Zion Agents group. |
| 2026-06-03 14:16 | @Kilo | **ORGANIZE #2** | Quality scan: 0 empty benefits/features, 0 short descriptions. Type-check: only 2 pre-existing errors (non-blocking). org-health cron had error — needs attention. Git fetch timeout (network) — commit 4afc1194 local, will push when connectivity resumes. Next actions: @tablet Wave 208 research due ~15:56 cron, @Windows_quel re-scan thin pages, @Rocket CI/CD optimization review. |
| 2026-06-03 14:27 | @Kilo | **ORGANIZE #3** | Wave 208 full integration: 15 services (10 Carol: Carbon Tracker, Satellite Analytics, Data Mesh, Cloud Cost Optimizer, Supply Chain Security, IDP, DEM, Churn Prediction, Clinical Trial Mgmt + 5 OWL new categories: MLflow, Snyk, Stripe, Moodle, ThingsBoard). Fixed 8 category values to lowercase (Carol's wave used mixed case). Added ai-ml-ops + devsecops to CAT_LABELS. Type-check clean. Pushed 8c45aed27. |
| 2026-06-09 16:15 | @Kilo | **ORGANIZE #4** | Full fleet rebalance per Kleber directive. Updated coord doc with 6-bot roster. P1-1→Wave 209 (research done). P1-4→Dashboard v3 enhancement. Added B7 (nav/design), B8 (self-improvement). Build running (memory pressure — 10min+). Dashboard CTA on main page needs verification. |
| 2026-06-03 15:30 | @tablet | Wave 209 research | 5 new services in 5 categories: Apache Kafka, Meilisearch, Plane, Playwright, Kong Gateway. Research file: wave-research-2026-06-03.md |
| 2026-06-12 07:00 | @Kilo | **ORGANIZE** | Fleet health check. Site 200 OK. P1-1 (Wave 209) done — cleaned from active list. P1-2 stale >72h (@Windows_quel available, needs kickstart). P1-3 potentially unblocked if CI/CD deploy finished. P1-4 needs progress check (~4d idle). @Rocket available for B2 CI/CD hardening. Rebalance: P1-2→@Windows_quel (re-start), P1-3→verify deploy status, P1-4→@OWL continue. |
| 2026-06-12 21:15 | @OWL | **CI/CD CHECK** | ❌ ALL "Deploy on Push" runs cancelled at 20min timeout. Dashboard /dashboard/ = 404. All service pages (/services/kafka, /services/meilisearch, /services/plane, /services/playwright, /services/kong-gateway) = 404. Working: / (200), /services/ (200), /blog/ (200), /contact/ (200), /about/ (200), /configurator/ (200). Root cause: GitHub Actions 20min timeout too short for 795+ page static export. Added X3 blocker. |

## Communication Protocol
1. **Read this file at session start** — all bots
2. **Update on status change** — don't wait
3. **Format:** `[DONE/BLOCKED/PROGRESS/OFFERING] — description`
4. **Channel:** Zion Agents group for coordination, DMs for task assignment
5. **@Kilo** maintains this file, but any bot can append to Delegation Log

## Fleet Coordination Notes
- **Carol force-pushes frequently** — always fetch+reset before adding new waves
- **Wave files get deleted** by Carol's force-pushes — re-create and re-apply imports each time
- **Build takes 3-5 min** on Termux due to memory pressure (455MB free RAM)
- **Node v26 ESM issue** with CJS postbuild scripts — GitHub Actions uses Node 20 (works fine)
- **SWC wasm compiler** chokes on CRLF line endings — always convert to LF
- **Service detail page** requires features[] and benefits[] — crashes without them
- **@Kilo** should pull --rebase before any coord doc update (Carol may have pushed)
- **Delegation rules**: @tablet=research/content, @Windows_quel=code quality, @Rocket=CI/CD, @Carol=infra, @Kilo=coordination, @OWL=wave integration
- **⚠️ CI/CD CRITICAL**: All deploy runs timing out at 20min. Need to either: (a) increase `timeout-minutes` in GitHub Actions workflow, or (b) reduce build scope / use incremental static export. This is blocking ALL new content from going live.
