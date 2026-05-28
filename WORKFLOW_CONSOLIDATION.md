# Workflow Consolidation Plan

## Summary
- Total workflows: 204
- Many are redundant versions of the same purpose

## Categories with Redundancy

### ai-app* (14 workflows)
Consider consolidating:
- ai-app-improvement-on-push.yml
- ai-app-improvement-daily-quick.yml
- ai-app-improvement-evolution.yml
- ai-app-improvement-evolution-full-quality.yml
- ai-app-improvement-specialist.yml
- ai-app-improvement-orchestrator.yml

**Recommended:** Keep 2 max (quick + full)

### ai-automation* (14 workflows)
Many are similar monitoring/digest workflows.
**Recommended:** Consolidate into 3-4 core workflows

### ai-content* (13 workflows)
Content generation is fragmented.
**Recommended:** Keep 2-3 (velocity + quality)

### ai-openclaw* (13 workflows)
**Recommended:** Consolidate to 3-4

## Proposed Actions

1. Disable rarely-used workflows (run manually or < monthly)
2. Merge similar workflows with conditional logic
3. Keep only essential automated workflows running on push/schedule

## Quick Wins

Disable these if they fail consistently and aren't critical:
- ai-broken-link-fixer.yml (if failing)
- ai-layout-improvement.yml (if failing)
- ai-performance-optimizer.yml (if failing)
