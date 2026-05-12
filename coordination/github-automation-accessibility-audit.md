# GitHub Automation — Accessibility Audit

**Created:** 2026-05-11 23:30 UTC  
**Owner:** Kleber Garcia Alcatrão (initial setup) / Hermes (ongoing monitoring)  
**Status:** ✅ Ready to merge → 🚀 Automated daily at 03:00 UTC

---

## 📋 Overview

A new GitHub Actions workflow for automated accessibility auditing has been added:

- **Script:** `scripts/accessibility-audit.sh`
- **Workflow:** `.github/workflows/accessibility-audit.yml`
- **Schedule:** Daily at 03:00 UTC
- **Output:** Concise summary posted on the repository (PR comment / issue / or log)

---

## ✅ Current State

| Step | Status | Done By | Date |
|------|--------|---------|------|
| Script created | ✅ Done | Kleber | 2026-05-11 |
| Workflow YAML added | ✅ Done | Kleber | 2026-05-11 |
| Ready to merge to main | ⏳ Pending | Kleber | — |
| Merge & push to origin/main | ⏳ Pending | Kleber | — |
| Workflow activation (first run) | ⏳ Pending | GitHub Actions | 03:00 UTC next |
| Ongoing daily execution | ⏳ Pending | GitHub Actions | Daily 03:00 UTC |

---

## 🚀 Action Required (Before Automation Goes Live)

**Kleber must run:**

```bash
git pull --rebase
git push origin main
```

Once pushed, the workflow becomes active and will run automatically each day at 03:00 UTC.

---

## 📊 What Hermes Should Monitor

After the first run, Hermes Agent (via coordination) should:

1. **Check workflow runs** — Visit GitHub Actions tab to confirm successful execution
2. **Read the summary** — The workflow posts a concise accessibility report (link in repo)
3. **Track failures** — If the audit fails, create/update a GitHub issue or comment on PR
4. **Report status** — Update `active-tasks.md` with accessibility audit status weekly or on failures
5. **Escalate** — Notify Kleber via inbox.md if repeated failures occur

**Relevant credentials (from .env):**
- `GITHUB_TOKEN` — For reading workflow runs and posting comments
- Repository: likely `ziontechgroup/main` (confirm with Kleber)

---

## 🔮 Next Improvement (Planned)

**Live bundle-size budget monitor** using `next-bundle-analyzer`:

- Nightly workflow comparing current bundle size against threshold
- Fails or comments if bundle grows beyond budget
- Keeps app lean without manual checks

**Status:** Planned (not yet implemented)  
**Owner:** Hermes (to implement after onboarding)  
**Task ID:** Will be added once Hermes is active

---

## 📝 How to Use This Document

- **Kleber:** Merge the accessibility audit, then mark task #18 as Done
- **Hermes:** After poller is live, check this doc, claim task #19, and set up monitoring
- **Both:** Update this doc when bundle-size monitor is created (task #20)

---

## 🔗 Related Files

- `scripts/accessibility-audit.sh` — The audit script (add to repo)
- `.github/workflows/accessibility-audit.yml` — GitHub Actions workflow
- Coordination task board: `active-tasks.md` (tasks #18–20 below)
