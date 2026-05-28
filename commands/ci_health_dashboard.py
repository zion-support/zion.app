#!/usr/bin/env python3
"""
CI Health Dashboard — Zion Tech Group

Aggregates GitHub Actions failures across repositories, identifies patterns,
and drafts GitHub Issues for flaky/blocked workflows.

Usage:
  python3 ci_health_dashboard.py report   — Print summary to stdout
  python3 ci_health_dashboard.py issues  — Draft GitHub Issues for persistent failures
"""

import sys, os, json, re, datetime
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get
from llm_client import chat
from subprocess import check_output

GITHUB_PAT = None
GITHUB_REPO = 'Zion-support/zion.app'  # default; extend later

def get_github_failures(limit: int = 50):
    """Query Gmail for unread GitHub Actions failure emails."""
    # Using the same narrow query the daemon uses
    query = 'from:notifications@github.com subject:"Run failed" label:INBOX is:unread'
    msgs = gmail_search(query, limit=limit)
    failures = []
    for m in msgs:
        try:
            msg = gmail_get(m['id'])
            hdrs = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
            subject = hdrs.get('Subject', '')
            snippet = msg.get('snippet', '')
            # Extract repo and workflow from subject like: "Workflow (Zion-support/zion.app) failed"
            repo_match = re.search(r'\(([^)]+)\)', subject)
            repo = repo_match.group(1) if repo_match else 'unknown'
            # Extract workflow name before "failed"
            wf_match = re.search(r'^(.*?)\s+\(', subject)
            workflow = wf_match.group(1).strip() if wf_match else 'unknown'
            failures.append({
                'id': m['id'],
                'threadId': m.get('threadId'),
                'subject': subject,
                'repo': repo,
                'workflow': workflow,
                'snippet': snippet[:200],
                'date': hdrs.get('Date', ''),
            })
        except Exception as e:
            print(f"[parse error {m['id']}: {e}]", file=sys.stderr)
    return failures

def group_failures(failures):
    """Group by repo+workflow; count occurrences and collect snippets."""
    groups = defaultdict(lambda: {'count': 0, 'snippets': [], 'latest': None, 'ids': []})
    for f in failures:
        key = (f['repo'], f['workflow'])
        g = groups[key]
        g['count'] += 1
        g['snippets'].append(f['snippet'])
        g['ids'].append(f['id'])
        # Keep most recent date
        if g['latest'] is None or f['date'] > g['latest']:
            g['latest'] = f['date']
    return dict(groups)

def summarize_with_llm(groups) -> str:
    """Use LLM to produce a concise health summary."""
    lines = [f"CI Health Summary — {len(groups)} failing workflows\n"]
    for (repo, wf), data in sorted(groups.items(), key=lambda x: -x[1]['count'])[:10]:
        lines.append(f"- {repo} / {wf}: {data['count']} failure(s) (latest: {data['latest']})")
    summary = "\n".join(lines)

    prompt = (
        "You are a DevOps engineer summarizing GitHub Actions health.\n"
        f"Here are the current failing workflows:\n{summary}\n\n"
        "Write a 3-sentence executive summary:\n"
        "- Overall health status\n"
        "- Most critical broken workflow and why\n"
        "- Recommended next step\n"
        "Return ONLY the summary text."
    )
    try:
        resp = chat([{"role": "user", "content": prompt}], provider="auto")
        return resp['content'].strip()
    except Exception as e:
        return f"[LLM summary unavailable: {e}]"

def generate_daily_report(groups):
    """Generate a Markdown report suitable for email or Drive log."""
    date_str = datetime.datetime.utcnow().strftime('%Y-%m-%d')
    lines = [
        f"# CI Health Report — {date_str}",
        "",
        "## Overview",
        f"- Total failing workflows: **{len(groups)}**",
        f"- Total failure occurrences: **{sum(g['count'] for g in groups.values())}**",
        "",
        "## Failing Workflows",
    ]
    for (repo, wf), data in sorted(groups.items(), key=lambda x: -x[1]['count']):
        lines.append(f"### {repo} / {wf}")
        lines.append(f"- Failures: {data['count']} (last seen: {data['latest']})")
        lines.append(f"- Email thread IDs: {', '.join(data['ids'][:3])}" + (" ..." if len(data['ids']) > 3 else ""))
        # Show representative snippet
        if data['snippets']:
            lines.append(f"- Example error: `{data['snippets'][0][:120]}...`")
        lines.append("")
    lines.extend(["## Recommendations", "1. Prioritize workflows with >3 failures", "2. Check for flaky tests or missing dependencies", "3. Consider disabling/cancelling repeatedly failing jobs"])
    return "\n".join(lines)

def draft_github_issue(repo: str, workflow: str, data: dict):
    """Create a GitHub Issue via API (requires GITHUB_PAT in env)."""
    global GITHUB_PAT
    GITHUB_PAT = os.getenv('GITHUB_PAT') or GITHUB_PAT
    if not GITHUB_PAT:
        print("   [SKIP] GITHUB_PAT not set — cannot draft issue")
        return None

    import urllib.request
    title = f"CI: `{workflow}` failing repeatedly ({data['count']} times)"
    body = (
        f"**Workflow:** `{workflow}` in `{repo}`\n"
        f"**Observed failures:** {data['count']} (latest: {data['latest']})\n\n"
        f"**Recent error snippet:**\n```\n{data['snippets'][0][:300] if data['snippets'] else 'N/A'}\n```\n\n"
        "**Investigation steps:**\n"
        "1. Check workflow file syntax and dependencies\n"
        "2. Verify secrets and environment variables\n"
        "3. Review recent changes that might have broken the build\n\n"
        f"*Auto-generated by CI Health Dashboard on {datetime.datetime.utcnow().isoformat()}*"
    )
    url = f"https://api.github.com/repos/{repo}/issues"
    payload = json.dumps({"title": title, "body": body, "labels": ["ci-failure", "automated"]}).encode()
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {GITHUB_PAT}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        return resp.get('html_url')
    except Exception as e:
        print(f"   [Issue draft error: {e}]", file=sys.stderr)
        return None

def cmd_report():
    failures = get_github_failures(limit=100)
    print(f"📊 CI Health Report — {len(failures)} failure emails found")
    groups = group_failures(failures)
    print(f"   Unique failing workflows: {len(groups)}")
    summary = summarize_with_llm(groups)
    print(f"\n🤖 LLM Summary:\n{summary}")
    # Print top 5
    print("\nTop failures:")
    for (repo, wf), d in sorted(groups.items(), key=lambda x: -x[1]['count'])[:5]:
        print(f"  {repo}/{wf}: {d['count']}x  [{d['latest']}]")
    # Also save to file
    report = generate_daily_report(groups)
    out = WORKSPACE / 'zion.app' / 'reports' / f'ci-health-{datetime.datetime.utcnow().strftime("%Y-%m-%d")}.md'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(report)
    print(f"\n📄 Full report saved to {out}")

def cmd_issues():
    failures = get_github_failures(limit=100)
    groups = group_failures(failures)
    print(f"🔧 Drafting GitHub Issues for {len(groups)} failing workflows...")
    # Only draft for workflows failing >1 time to avoid noise
    drafted = 0
    for (repo, wf), d in groups.items():
        if d['count'] < 2:
            continue  # skip single occurrences
        url = draft_github_issue(repo, wf, d)
        if url:
            print(f"   ✅ Issue created: {url}")
            drafted += 1
        else:
            print(f"   ⚠️  Skipped {repo}/{wf} (PAT missing or error)")
    print(f"\n✅ Drafted {drafted} issues")

def main():
    import argparse
    p = argparse.ArgumentParser(description='CI Health Dashboard')
    sub = p.add_subparsers(dest='cmd')
    sub.add_parser('report', help='Print CI health summary')
    sub.add_parser('issues', help='Draft GitHub Issues for persistent failures')
    args = p.parse_args()

    if args.cmd == 'report':
        cmd_report()
    elif args.cmd == 'issues':
        cmd_issues()
    else:
        p.print_help()

if __name__ == '__main__':
    main()
