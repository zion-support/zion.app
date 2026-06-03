# AI Agent Self-Improvement Research & Implementation Plan
> Created by @OWL for Zion Tech Group fleet
> Last updated: 2026-06-03

## Current Fleet Capabilities

| Capability | Status | Notes |
|-----------|--------|-------|
| Wave service creation | ✅ Working | Research → data → integrate → push |
| Git conflict resolution | ⚠️ Fragile | Carol force-pushes cause data loss |
| Type-check validation | ✅ Working | Pre-push quality gate |
| Link monitoring | ✅ Working | Cron job every 360m |
| Self-healing | ⚠️ Partial | Can fix known patterns, not novel issues |
| Proactive improvement | ❌ Missing | React to tasks, don't initiate |
| Cross-agent learning | ❌ Missing | No shared knowledge base |
| Client-facing reporting | ⚠️ Basic | Dashboard exists but static |

## Priority Improvements

### P0 — Critical (implement now)

1. **Git conflict resilience**
   - Before any push: `git fetch && git diff --stat origin/main` to detect conflicts early
   - After rebase: verify wave file count matches expected
   - Script: `scripts/verify-wave-integrity.sh` — checks all wave imports match wave file exports

2. **Service count verification**
   - After every wave integration: count services in allServices vs expected
   - Alert if count drops (indicates lost services)
   - Add to post-build verification

3. **Category value enforcement**
   - All categories MUST be lowercase (schema rule)
   - Add pre-commit hook or build-time check
   - Script: `scripts/verify-categories.sh`

### P1 — High (implement this week)

4. **Proactive monitoring**
   - Agents should check site health without being asked
   - Cron: every 2h, check key pages return 200
   - Auto-fix: if service page 404s, check if wave data exists

5. **Shared knowledge base**
   - `~/.hermes/shared-kb.md` — lessons learned, patterns, pitfalls
   - All agents read on restart
   - Append-only, dated entries

6. **Client-facing activity log**
   - Dashboard should show real-time agent actions
   - Filter by bot, by time range
   - Exportable as PDF for client reports

### P2 — Medium (implement when time allows)

7. **Automated link repair**
   - Crawl all internal links weekly
   - Auto-fix broken links (redirect or remove)
   - Report to group

8. **Performance optimization**
   - Monitor Lighthouse scores
   - Auto-fix performance regressions
   - Image optimization, code splitting

9. **Content quality scoring**
   - Score each service page (description length, features count, benefits count)
   - Flag pages below threshold
   - Auto-generate improvement suggestions

## New Agent Prompts

### Agent Template: Research Specialist
```
You are @[NAME]_bot, a research specialist for Zion Tech Group.

ON RESTART:
1. Read ~/.hermes/multi-agent-coordination.md for current task board
2. Check /dashboard for fleet status
3. Report your status in Zion Agents group

YOUR ROLE:
- Research new service categories and individual services
- Create wave data files following schema rules
- Validate all data before integration

SCHEMA RULES (MUST FOLLOW):
1. Category values: always lowercase (ai, micro-saas, it, security, cloud, data, automation)
2. Required fields: id, title, description, features[], benefits[], pricing, contactInfo, icon, href, category, industry
3. Always include features AND benefits — service detail page crashes without them
4. CRLF check: ensure wave files use LF line endings
5. Contact info: use website: 'https://ziontechgroup.com'

QUALITY GATES:
- Run `npx tsc --noEmit` before every push
- Verify service count hasn't dropped
- Check for empty benefits/features arrays
```

### Agent Template: Code Quality Specialist
```
You are @[NAME]_bot, a code quality specialist for Zion Tech Group.

ON RESTART:
1. Read ~/.hermes/multi-agent-coordination.md for current task board
2. Check /dashboard for fleet status
3. Report your status in Zion Agents group

YOUR ROLE:
- Fix broken links, improve navigation, enhance design
- Ensure all pages render correctly
- Optimize performance and accessibility

QUALITY GATES:
- All internal links must return 200
- No empty benefits/features in any service
- Type-check must pass before push
- Lighthouse score > 80 for key pages
```

### Agent Template: DevOps/Infrastructure
```
You are @[NAME]_bot, a DevOps specialist for Zion Tech Group.

ON RESTART:
1. Read ~/.hermes/multi-agent-coordination.md for current task board
2. Check /dashboard for fleet status
3. Report your status in Zion Agents group

YOUR ROLE:
- Maintain CI/CD workflows
- Monitor site uptime and performance
- Manage deployments and rollbacks

QUALITY GATES:
- All workflows must pass before merge
- Site must return 200 after every deploy
- Dependabot PRs reviewed within 24h
```

## Implementation Checklist

- [ ] Create `scripts/verify-wave-integrity.sh`
- [ ] Create `scripts/verify-categories.sh`
- [ ] Create `~/.hermes/shared-kb.md`
- [ ] Add service count check to build pipeline
- [ ] Enhance dashboard with real-time data
- [ ] Add client-facing activity export
- [ ] Create agent onboarding prompts for future agents
- [ ] Set up proactive monitoring cron
- [ ] Implement automated link repair
- [ ] Add content quality scoring
