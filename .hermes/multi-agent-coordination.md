# Shared Task Board — Zion Tech Group Multi-Agent
> Source of truth for all 5 bots. Update on status change.
> Location: ~/.hermes/multi-agent-coordination.md (synced by @Kilo)
> Last updated: 2026-06-03T14:11:00-03:00

## Bot Roster
| Bot | Role | Status | Current Task |
|-----|------|--------|-------------|
| @windows_carol_bot | 🖥️ DevOps & Infrastructure | 🟢 Active | CI/CD workflows, wave integration, accessibility |
| @Kilo_openclaw_kleber_bot | 🧠 Intelligence & Orchestration | 🟢 Active | Coordination lead, quality audits |
| @tablet_kleber_bot | 📱 Content & Research | 🟢 Active | Wave research & content creation |
| @Windows_quel_bot | 🔧 Code & Implementation | 🔵 Available | Site quality improvements |
| @Rocket_Kleber_bot | 🚀 Integration & Delivery | 🔵 Available | Build/deploy automation |
| @OWL | 📊 Build & Deploy | 🟢 Active | Wave creation, bug fixes, fleet coordination |

## Active Tasks (P0)
None — all clear ✅

## In Progress (P1)
| ID | Task | Owner | Status |
|----|------|-------|--------|
| P1-1 | Wave 208 research | @tablet | 🔄 Just delegated — research 5 new services in new categories |
| P1-2 | Site quality pass — thin pages, empty benefits | @Windows_quel | 🔄 Just delegated — re-scan needed (was 223 after last fix) |
| P1-3 | Wave 208 integration | @OWL | ⏳ Waiting on P1-1 completion |

## Backlog (P2)
| ID | Task | Owner | Notes |
|----|------|-------|-------|
| B2 | CI/CD pipeline hardening | @Rocket | Multiple workflows already added — optimize further |
| B3 | GitHub auth for Actions triage | @windows_carol | Needs gh auth on remote |
| B4 | Service page generation from wave data | @tablet | Automated via postbuild |
| B5 | Thin page content enrichment | @Kilo | Ongoing audits |
| B6 | Wave 209+ research pipeline | @tablet | Next wave after 208 |

## Blocked
| ID | Task | What's Needed |
|------|------|---------------|
| X1 | Email responder live | Kleber: Gmail app password |
| X2 | GitHub Actions triage | Kleber: gh auth on remote machine |

## Wave Integration Status
| Wave | Services | Status |
|------|----------|--------|
| 174-180 | ~497 services | ✅ Integrated |
| 183-185 | 19 services | ✅ Fixed (interface + categories) |
| 186 | 6 services | ✅ Integrated |
| 187 | 4 services | ✅ Fixed (circular dep) |
| 188-192 | 44 services | ✅ Integrated |
| 193-196 | 41 services | ✅ Integrated |
| 197-206 | ~160 services | ✅ Integrated |
| 207 | 5 services | ✅ Integrated (Grafana, Keycloak, Strapi, Medusa, Outline) |
| **Total** | **~1,710+ services** | ✅ Type-check clean |

## Schema Rules (MUST FOLLOW)
1. **Category values**: always lowercase (`ai`, `micro-saas`, `it`, `security`, `cloud`, `data`, `automation`)
2. **Service interface**: define locally in wave file OR import from servicesData — both work, but local interface is preferred to avoid circular dep
3. **Required fields**: `id`, `title`, `description`, `features[]`, `benefits[]`, `pricing`, `contactInfo`, `icon`, `href`, `category`, `industry`
4. **Optional fields**: `popular?`, `stage?: 'published' | 'beta' | 'planned'`
5. **Contact info**: use `website: 'https://ziontechgroup.com'` for consistency
6. **Always include features AND benefits** — service detail page crashes without them
7. **CRLF check**: ensure wave files use LF line endings, not CRLF (causes SWC wasm compiler crash on Node v26)

## Site State
- **Build**: ✅ `npm run build` — green
- **Type-check**: ✅ `npx tsc --noEmit` — clean
- **Services**: ~1,710+ in servicesData.ts (waves 174-207)
- **Site**: 200 OK — https://ziontechgroup.com
- **Last deploy**: Wave 207
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
