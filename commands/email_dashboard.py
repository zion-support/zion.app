#!/usr/bin/env python3
"""
Email Categorizer Dashboard — Zion Tech Group

Generates daily statistics on email volume by category (via auto_labeler patterns)
and priority distribution. Outputs Markdown to Drive and Telegram digest.

Usage:
  python3 email_dashboard.py [--execute]   # Publish (default dry-run)
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

from google_workspace import gmail_search, gmail_get, gmail_list_labels
from llm_client import chat

# Categories matching PATTERNS in auto_labeler and followup_reminder
CATEGORIES = ['quote_request', 'meeting_invite', 'error_report', 'info_request', 'followup']

def count_emails_since(days: int = 1, limit: int = 100) -> dict:
    """Scan recent unread emails and categorize them."""
    since_date = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    msgs = gmail_search(f'after:{since_date} is:unread', limit=limit)
    counts = {cat: 0 for cat in CATEGORIES}
    counts['other'] = 0
    # ... rest unchanged

    label_map = {lbl['id']: lbl['name'] for lbl in gmail_list_labels()}

    for m in msgs:
        raw = gmail_get(m['id'])
        headers = raw.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
        body = extract_body(raw)[:500]

        # Category detection (same logic as auto_labeler)
        text = (subject + ' ' + body).lower()
        categorized = False
        for cat in CATEGORIES:
            if cat == 'followup':
                # Check for followup label
                label_ids = raw.get('labelIds', [])
                if any(label_map.get(lid) == 'Follow-Up' for lid in label_ids):
                    counts[cat] += 1
                    categorized = True
                    break
            else:
                # Pattern match
                patterns = {
                    'quote_request': [r'\b(quote|quotation|pricing|how much|cost of|estimate)\b', r'\b(please quote|can you quote|interested in)\b'],
                    'meeting_invite': [r'\b(meeting|call|zoom|teams|schedule|available|when are you free)\b', r'\b(let\'s (discuss|talk)|chat about)\b'],
                    'error_report': [r'\b(error|failed|broken|issue|problem|bug|crash|down)\b', r'\b(not working|stuck|unable to)\b'],
                    'info_request': [r'\b(what is|how do|can you tell|please provide|information about)\b', r'\b(details on|more info)\b'],
                }
                for pat in patterns[cat]:
                    if re.search(pat, text, re.IGNORECASE):
                        counts[cat] += 1
                        categorized = True
                        break
                if categorized:
                    break
        if not categorized:
            counts['other'] += 1

    return counts

def extract_body(msg):
    """Simplified body extraction similar to other scripts."""
    payload = msg.get('payload', {})
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    import base64
                    return base64.urlsafe_b64decode(data + '===').decode('utf-8', errors='replace')
    body = payload.get('body', {}).get('data', '')
    if body:
        import base64
        return base64.urlsafe_b64decode(body + '===').decode('utf-8', errors='replace')
    return ''

def build_report(counts: dict) -> str:
    total = sum(counts.values())
    today = datetime.date.today().isoformat()
    lines = [
        f"# 📊 Email Categorizer Dashboard — {today}\n",
        f"**Total unread emails (last 24h):** {total}\n",
        "## By Category\n"
    ]
    for cat in CATEGORIES + ['other']:
        cnt = counts.get(cat, 0)
        pct = (cnt / total * 100) if total else 0
        lines.append(f"- **{cat.replace('_', ' ').title()}**: {cnt} ({pct:.0f}%)")
    lines.append("\n## Insights\n")
    # Quick LLM insight
    if total > 0:
        prompt = (
            f"Given these email category counts for the last 24h:\n" +
            '\n'.join(f"- {k}: {v}" for k,v in counts.items()) +
            "\nWrite 2 sentences of actionable insight for the CEO."
        )
        try:
            resp = chat([{"role": "user", "content": prompt}], provider="auto")
            insight = resp['content'].strip()
            lines.append(insight)
        except Exception as e:
            lines.append(f"(LLM insight unavailable: {e})")
    else:
        lines.append("No emails in the last 24h — inbox is clean!")

    md = '\n'.join(lines) + '\n'
    return md

def publish_to_drive(markdown: str, filename: str):
    """Create a Google Doc from markdown (best-effort via Drive API)."""
    # For now, just save to workspace; full Drive Docs API integration would require
    # converting to Google Docs format. Simpler: upload as .md file in reports folder.
    reports_dir = WORKSPACE / 'zion.app' / 'reports'
    reports_dir.mkdir(parents=True, exist_ok=True)
    file_path = reports_dir / filename
    file_path.write_text(markdown)
    print(f"   Report saved to {file_path}")
    # TODO: upload to Drive if needed

def cmd_run(dry_run: bool, limit: int):
    print("📊 Generating Email Dashboard…")
    counts = count_emails_since(days=1, limit=limit)
    total = sum(counts.values())
    print(f"   Counts: {counts}")

    report = build_report(counts)
    today_str = datetime.date.today().isoformat()
    report_filename = f"email-dashboard-{today_str}.md"

    if dry_run:
        print("\n--- REPORT PREVIEW ---")
        print(report)
        print("--- END PREVIEW ---")
        print(f"\n💡 Add --execute to publish to Drive and send Telegram digest.")
        return

    # Publish to Drive (report file)
    publish_to_drive(report, report_filename)

    # Send Telegram digest (shortened)
    lines = [f"📊 *Email Dashboard — {today_str}*"]
    for cat in CATEGORIES + ['other']:
        cnt = counts.get(cat, 0)
        lines.append(f"• {cat.replace('_', ' ').title()}: {cnt}")
    lines.append(f"**Total:** {total}\n")
    # Add insight snippet (first sentence)
    insight_lines = [l for l in report.split('\n') if l and not l.startswith('#') and not l.startswith('-')]
    if insight_lines:
        lines.append(f"💡 {insight_lines[0]}")
    telegram_text = '\n'.join(lines)

    try:
        message(action='send', target='telegram', message=telegram_text)
        print("📡 Telegram digest sent.")
    except Exception as e:
        print(f"❌ Telegram failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Email Categorizer Dashboard')
    parser.add_argument('--execute', action='store_true', help='Publish + send Telegram (default dry-run)')
    parser.add_argument('--limit', type=int, default=100, help='Max emails to scan')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
