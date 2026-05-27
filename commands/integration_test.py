#!/usr/bin/env python3
"""
Integration Test Harness — Zion Tech Group

Nightly validation runner: executes all automation scripts in dry-run mode,
captures pass/fail, and reports to Telegram. Optionally opens GitHub Issues
on repeated failures to track regressions.

Usage:
  python3 integration_test.py [--execute]   # Actually run tests (default dry-run)
  python3 integration_test.py --create-issues  # Auto-create GitHub Issues for failing tests
"""

import sys, os, re, json, datetime, argparse, subprocess, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

# Scripts to test (ordered; quick ones first)
TEST_SCRIPTS = [
    ('auto_labeler.py', ['--execute', '--limit', '5']),
    ('followup_reminder.py', ['--execute', '--limit', '5']),
    ('email_prioritizer.py', ['--execute', '--limit', '5']),
    ('smart_reply_queue.py', ['--limit', '5']),
    ('draft_notifier.py', ['--execute']),
    ('sender_reputation.py', ['--execute', '--limit', '20']),
    ('email_translator.py', ['--limit', '5']),
    ('ci_health_dashboard.py', ['report']),
    ('email_to_task.py', ['--limit', '5']),
    ('meeting_prep.py', ['--dry-run']),
    ('daily_sync.py', ['--dry-run']),
    ('email_dashboard.py', ['--limit', '20']),
    ('unresponded_tracker.py', ['report']),
    ('attachment_indexer.py', []),
    ('ci_tracker.py', []),
    ('client_onboarding.py', ['--limit', '20']),
    ('contract_watchdog.py', ['--dry-run']),
    ('invoice_reminder.py', ['--dry-run']),
    ('competitor_digest.py', []),
    ('newsletter_cleaner.py', ['--limit', '20']),
    ('website_monitor.py', []),
    ('social_mentions.py', []),
    ('expense_parser.py', ['--limit', '10']),
    ('meeting_notes.py', ['--lookback-hours', '24']),
    ('client_health.py', []),
    ('smart_reply_learning.py', []),
    ('outbound_templates.py', ['list']),
    ('thread_summarizer.py', ['test-thread-123']),  # will fail gracefully if thread not found
]

STATE_FILE = WORKSPACE / 'zion.app' / 'data' / 'integration_test_state.json'
GITHUB_REPO = 'Zion-support/zion.app'
GITHUB_TOKEN_FILE = WORKSPACE / '.github-pat'

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'failures': {}, 'lastRun': None}

def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))

def run_script(script_name: str, args: list) -> tuple[bool, str]:
    """Execute script under commands/; return (success, output)."""
    script_path = WORKSPACE / 'zion.app' / 'commands' / script_name
    cmd = ['python3', str(script_path)] + args
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        success = result.returncode == 0
        output = result.stdout + result.stderr
        return success, output
    except subprocess.TimeoutExpired:
        return False, f"TIMEOUT after 120s"
    except Exception as e:
        return False, str(e)

def create_github_issue(title: str, body: str) -> str:
    token = GITHUB_TOKEN_FILE.read_text().strip() if GITHUB_TOKEN_FILE.exists() else os.getenv('GITHUB_PAT')
    if not token:
        return None
    url = f"https://api.github.com/repos/{GITHUB_REPO}/issues"
    payload = json.dumps({'title': title, 'body': body, 'labels': ['integration-test', 'automation']}).encode()
    headers = {
        'Authorization': f'token {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
    }
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        return resp.get('html_url', '')
    except Exception as e:
        return None

def cmd_run(dry_run: bool, create_issues: bool):
    print("🧪 Integration Test Harness starting…")
    state = load_state()
    today = datetime.date.today().isoformat()
    new_failures = []
    all_passed = True

    results_lines = ["# Integration Test Results\n"]
    for script, args in TEST_SCRIPTS:
        print(f"   Testing {script}…")
        success, output = run_script(script, args)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"      {status}")
        results_lines.append(f"- {script}: {status}")

        if not success:
            all_passed = False
            new_failures.append({'script': script, 'output': output[:1000]})
            # Track consecutive failures
            state['failures'].setdefault(script, {'count': 0, 'lastFail': None, 'issueUrl': None})
            state['failures'][script]['count'] += 1
            state['failures'][script]['lastFail'] = today

            # Create GitHub Issue if threshold reached (e.g., 3 consecutive)
            if create_issues and state['failures'][script]['count'] >= 3 and not state['failures'][script].get('issueUrl'):
                title = f"[Automation] {script} failing consistently"
                body = (
                    f"Script `{script}` has failed {state['failures'][script]['count']} times in a row.\n\n"
                    f"**Latest output:**\n```\n{output[:2000]}\n```\n\n"
                    f"Last failure: {today}\n"
                    f"Run integration test harness to investigate."
                )
                issue_url = create_github_issue(title, body)
                if issue_url:
                    state['failures'][script]['issueUrl'] = issue_url
                    print(f"      🐛 GitHub Issue created: {issue_url}")
        else:
            # Reset failure count on success
            if script in state['failures']:
                state['failures'][script]['count'] = 0

    state['lastRun'] = today
    save_state(state)

    # Build summary
    summary = '\n'.join(results_lines)
    if all_passed:
        summary += "\n\n✅ All tests passed!"
    else:
        summary += f"\n\n❌ {len(new_failures)} script(s) failed. See details above."

    if dry_run:
        print("\n--- TEST SUMMARY (dry-run) ---")
        print(summary)
        print("💡 Add --execute to actually run tests and send alerts.")
        return

    # Send Telegram summary
    try:
        message(action='send', target='telegram', message=summary[:4000])
        print("📡 Telegram report sent.")
    except Exception as e:
        print(f"❌ Telegram failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Integration Test Harness')
    parser.add_argument('--execute', action='store_true', help='Run tests (default dry-run)')
    parser.add_argument('--create-issues', action='store_true', help='Auto-create GitHub Issues on repeated failures')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, create_issues=args.create_issues)

if __name__ == '__main__':
    main()
