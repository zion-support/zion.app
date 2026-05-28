# Autonomous Changelog Generator

**Status:** ✅ Active  
**Triggers:** On push to `main` (after merges), manual dispatch  
**Output:** Updates `CHANGELOG.md` with new release section; commits to current branch  
**Telegram alerts:** On update or errors

---

## Problem

Keeping `CHANGELOG.md` manually updated is tedious and often neglected. Without an up-to-date changelog, users and contributors can't easily see what changed in each release, reducing transparency and trust.

## Solution

Automated changelog generator that:
- Reads Git commit history since last release tag
- Parses conventional commit messages (type(scope): subject)
- Groups changes by category (Features, Bug Fixes, Documentation, etc.)
- Prepends new unreleased section to `CHANGELOG.md`
- Commits and pushes automatically on merges to `main`
- Sends Telegram notification when updated

---

## How It Works

1. Triggered on every push to `main` (after PR merges)
2. Finds latest Git tag (e.g., `v1.2.3`) or falls back to `v0.1.0`
3. Fetches all commits from that tag to `HEAD`
4. Parses each commit using [Conventional Commits](https://www.conventionalcommits.org/) spec:
   - `feat:` → Features
   - `fix:` → Bug Fixes
   - `docs:` → Documentation
   - `chore:` → Chores
   - `refactor:` → Refactoring
   - `perf:` → Performance
   - `test:` → Tests
   - `ci:` → CI/CD
   - `build:` → Build
   - `revert:` → Reverts
   - Others → Uncategorized
5. Detects breaking changes (via `!` in subject or `BREAKING CHANGE` in body)
6. Generates markdown section with:
   - Version (`vYYYY-MM-DD` — use date-based version for unreleased)
   - Date
   - Grouped list with commit hashes linking to GitHub
7. Prepends new section to `CHANGELOG.md` (keeps newest at top)
8. Commits and pushes
9. Sends Telegram confirmation

---

## Output

`CHANGELOG.md` example:
```markdown
# Changelog

## v2026-05-12 (2026-05-12)

### Features
- Add autonomous content summarizer ([abc1234](https://github.com/.../commit/abc1234))
- Add dynamic sitemap optimizer ([def5678](https://github.com/.../commit/def5678))

### Bug Fixes
- Fix memory leak in PM2 query ([ghi9012](https://github.com/.../commit/ghi9012))

...
```

---

## Configuration

No configuration needed. Works with any conventional commit messages.

**Commit message format:**
```
type(scope?): subject

optional body

BREAKING CHANGE: explanation
```

Examples:
```
feat(route-slicer): add lazy-loading for heavy charts
fix(cert-monitor): handle openssl timeout gracefully
docs(readme): update installation instructions
```

---

## Safety

- **Append-only**: Only prepends new sections; never deletes or edits existing entries
- **Non-destructive**: If changelog is manually edited outside new sections, those are preserved
- **No external dependencies**: Pure Git + Node.js
- **Fast**: Runs in seconds; no network I/O

---

## Dependencies

None — uses Node.js `child_process` for `git` and standard file I/O.

---

## Manual Trigger

```bash
gh workflow run changelog.yml
```

Or via GitHub Actions UI.

---

## Future Enhancements

- Compare against semantic version tags and use proper version bumping (major/minor/patch) based on commit types
- Integrate with release automation (auto-generate GitHub Release notes)
- Support multiple sections: `[Unreleased]` → consolidated version on tag
- Link to issues/PRs when referenced in commit messages
- Generate changelog per component (monorepo-aware)

---

## Related Guardrails

- **#4 Lighthouse Monitor** — performance changes tracked here
- **#36 Security Headers** — security fixes documented
- **#23 Log Retention** — operational changes
- **#2 Storybook** — UI changes

---

## Philosophy

Every merge to `main` is a potential release. Keeping the changelog auto-updated ensures:
- Users see what's new immediately
- Contributors get credit for their work
- Release notes are ready when you decide to tag a version
