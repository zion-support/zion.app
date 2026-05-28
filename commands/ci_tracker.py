#!/usr/bin/env python3
"""
Persistent CI Health Tracker — Zion

Maintains state of GitHub Actions failures across runs.
Identifies new persistent failures (same workflow failing > 24h) and
automatically drafts GitHub Issues with diagnostic context.

Usage:
  python3 ci_tracker.py [--dry-run]   # Default dry-run; add --execute to draft issues
"""

import sys, os, json, datetime, hashlib, argparse, re
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat
import urllib.request, urllib.parse

# ── Configuration ────────────────────────────────────────────────────────────

STATE_FILE = WORKSPACE / 'zion.app' / 'data' / 'ci_tracker_state.json'
ISSUE_LABEL = 'ci-failure-auto'
GITHUB_REPO = 'Zion-support/zion.app'  # owner/repo
GITHUB_TOKEN = os.getenv('GITHUB_PAT')  # from API KEYS sheet

# Age threshold for "persistent" (24 hours)
PERSISTENT_HOURS = 24

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'failures': {}, 'lastUpdated': None}

def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))

def hash_failure(repo: str, workflow: str, branch: str, error_snippet: str) -> str:
    """Create stable key for a failure."""
    raw = f"{repo}|{workflow}|{branch}|{error_snippet[:100]}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def fetch_ci_failure_emails() -> list:
    """Get recent GitHub Actions failure emails from Gmail."""
    # Re-use the CI health dashboard's query (unread failures)
    msgs = gmail_search('from:notifications@github.com subject:"Run failed"', limit=50)
    failures = []
    for m in msgs:
        msg = gmail_get(m['id'])
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        # Extract repo + workflow from subject
        # Example: "[Zion-support/zion.app] Run failed: .github/workflows/workflow.yml - main"
        m_repo = re.search(r'\[([^\]]+)\]', subject)
        m_wf = re.search(r'Run failed: (.+?) - ', subject)
        date_hdr = next((h['value'] for h in headers if h['name'] == 'Date'), '')
        try:
            from email.utils import parsedate_to_datetime
            date = parsedate_to_datetime(date_hdr).isoformat()
        except Exception:
            date = datetime.datetime.utcnow().isoformat()

        failures.append({
            'id': m['id'],
            'repo': m_repo.group(1) if m_repo else 'unknown',
            'workflow': m_wf.group(1).strip() if m_wf else 'unknown',
            'subject': subject,
            'date': date,
            'threadId': m.get('threadId'),
        })
    return failures

def categorize_failures(failures: list) -> dict:
    """Group failures by repo/workflow/branch."""
    groups = {}
    for f in failures:
        # Extract branch from subject (last part after ' - ')
        parts = f['subject'].split(' - ')
        branch = parts[-1].strip() if len(parts) > 1 else 'main'
        key = (f['repo'], f['workflow'], branch)
        if key not in groups:
            groups[key] = []
        groups[key].append(f)
    return groups

def age_hours(timestamp: str) -> float:
    """Return hours elapsed since timestamp (ISO)."""
    try:
        dt = datetime.datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        return (datetime.datetime.utcnow().replace(tzinfo=dt.tzinfo) - dt).total_seconds() / 3600
    except Exception:
        return 0

def summarize_with_llm(group: dict) -> str:
    """Ask LLM to write a concise summary of the failure pattern."""
    wf = group['workflow']
    repo = group['repo']
    count = group['count']
    latest = group['latest_date']
    errors = '; '.join(e['subject'] for e in group['examples'][:3])
    prompt = (
        f"Write a 2-sentence summary for a GitHub Issue about CI failures.\n"
        f"Repository: {repo}\n"
        f"Workflow: {wf}\n"
        f"Occurrences: {count} times, latest: {latest}\n"
        f"Error subjects: {errors}\n\n"
        "The issue should request investigation and fix. Be professional and concise."
    )
    resp = chat([{"role": "user", "content": prompt}], provider="auto")
    return resp['content'].strip()

def create_github_issue(title: str, body: str, labels: list = None) -> str:
    """Create GitHub Issue via API; return issue URL."""
    if not GITHUB_TOKEN:
        raise RuntimeError("GITHUB_PAT not set in environment")
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    payload = {
        "title": title,
        "body": body,
        "labels": labels or [ISSUE_LABEL]
    }
    data = json.dumps(payload).encode()
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
    }
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp.get('html_url', '')
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        raise RuntimeError(f"GitHub API error {e.code}: {err}")

def cmd_run(dry_run: bool):
    print("🔍 Persistent CI Tracker scanning for recurring failures…")
    failures = fetch_ci_failure_emails()
    print(f"📥 Found {len(failures)} CI failure emails")

    state = load_state()
    updated = False
    new_persistent = []

    groups = categorize_failures(failures)

    for key, items in groups.items():
        repo, wf, branch = key
        # Determine if this is persistent (any occurrence > 24h old)
        oldest_age = max(age_hours(i['date']) for i in items)
        if oldest_age < PERSISTENT_HOURS:
            continue  # not persistent yet

        # Compute group hash
        sample_error = items[0]['subject']
        grp_hash = hash_failure(repo, wf, branch, sample_error)
        first_seen = min(i['date'] for i in items)
        latest_date = max(i['date'] for i in items)
        count = len(items)

        # Check if we already created an issue for this hash
        if grp_hash in state['failures']:
            continue  # already tracked

        # New persistent failure detected
        title = f"CI Failure: {wf} in {repo} ({branch})"
        summary = summarize_with_llm({
            'workflow': wf,
            'repo': repo,
            'count': count,
            'latest_date': latest_date,
            'examples': items[:3]
        })
        body = (
            f"**Workflow:** `{wf}`\n"
            f"**Repository:** {repo}\n"
            f"**Branch:** {branch}\n"
            f"**Occurrences:** {count} (first seen: {first_seen})\n"
            f"**Latest:** {latest_date}\n\n"
            f"**Summary:**\n{summary}\n\n"
            f"---\n"
            f"Auto-generated by CI Tracker. Investigate failure logs in GitHub Actions."
        )

        if dry_run:
            print(f"\n⚠️  [DRY-RUN] Would create GitHub Issue:")
            print(f"   Title: {title}")
            print(f"   Body: {body[:120]}…")
        else:
            try:
                issue_url = create_github_issue(title, body)
                print(f"\n✅ Created GitHub Issue: {issue_url}")
            except Exception as e:
                print(f"\n❌ Issue creation failed: {e}")
                continue

        # Record in state to avoid duplicate issues
        state['failures'][grp_hash] = {
            'repo': repo,
            'workflow': wf,
            'branch': branch,
            'firstSeen': first_seen,
            'lastSeen': latest_date,
            'count': count,
            'issueTitle': title,
            'issueUrl': issue_url if not dry_run else '(dry-run)',
            'resolved': False
        }
        updated = True
        new_persistent.append(title)

    if updated:
        save_state(state)

    print(f"\n📊 Total tracked failures: {len(state['failures'])}")
    if new_persistent:
        print(f"   New persistent failures detected: {len(new_persistent)}")
        for t in new_persistent:
            print(f"     • {t}")
    else:
        print("   No new persistent failures.")

    if dry_run:
        print("\n💡 Add --execute to actually draft GitHub Issues.")

def main():
    parser = argparse.ArgumentParser(description='Persistent CI Failure Tracker')
    parser.add_argument('--execute', action='store_true', help='Create GitHub Issues (default: dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
