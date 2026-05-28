#!/usr/bin/env python3
"""
Client NPS Survey Automation — Zion Tech Group

Sends NPS (Net Promoter Score) surveys after project completion.
Triggered when emails are labeled `Project-Completed`.
Waits 7 days, then sends survey link (via email or SMS placeholder).
Logs responses to Drive `NPS` sheet or local JSON.

Usage:
  python3 nps_survey.py [--execute]   # Send surveys (default dry-run)
"""

import sys, os, re, json, datetime, argparse, urllib.request
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, gmail_create_draft_new, gog_headers
from llm_client import chat

NPS_DB = WORKSPACE / 'zion.app' / 'data' / 'nps_surveys.json'
DELAY_DAYS = 7
NPS_LABEL = 'Project-Completed'

def load_nps_db() -> dict:
    if NPS_DB.exists():
        return json.loads(NPS_DB.read_text())
    return {'surveys': {}, 'lastRun': None}

def save_nps_db(db: dict):
    NPS_DB.parent.mkdir(parents=True, exist_ok=True)
    NPS_DB.write_text(json.dumps(db, indent=2))

def find_completed_projects(days_back: int = 30) -> list:
    """Find messages labeled Project-Completed from last N days."""
    since = (datetime.date.today() - datetime.timedelta(days=days_back)).isoformat()
    query = f'after:{since} label:{NPS_LABEL}'
    msgs = gmail_search(query, limit=50)
    # Dedup by sender domain
    senders = {}
    for m in msgs:
        headers = {h['name']: h['value'] for h in m.get('payload',{}).get('headers',[])}
        from_hdr = headers.get('From','')
        if '@' in from_hdr:
            import re
            mdom = re.search(r'@([\w.-]+)', from_hdr)
            if mdom:
                domain = mdom.group(1).lower()
                if domain not in ('gmail.com','yahoo.com','hotmail.com','outlook.com'):
                    if domain not in senders:
                        senders[domain] = {'msg': m, 'date': headers.get('Date','')}
    return list(senders.values())

def extract_client_name(domain: str) -> str:
    """Convert domain to readable client name (simple heuristics)."""
    parts = domain.split('.')
    if len(parts) >= 2:
        return parts[-2].title()  # e.g. 'acme' from acme.com
    return domain.title()

def generate_nps_email(domain: str, client_name: str) -> tuple:
    """Generate NPS survey email subject + body."""
    # Survey link placeholder — could be Google Form or custom URL
    survey_url = f"https://forms.gle/your-nps-form"  # TODO: set real form
    prompt = (
        f"Write a brief NPS survey request email to {client_name}.\n"
        "Include:\n"
        "- Short intro (we hope you enjoyed our work)\n"
        "- One-click NPS question: 'How likely are you to recommend us? (0-10)'\n"
        f"- Survey link: {survey_url}\n"
        "- Thank you\n"
        "Sign as Kleber Garcia Alcatrão, CEO Zion Tech Group.\n"
        "Keep under 100 words."
    )
    try:
        resp = chat([{"role":"user","content":prompt}], provider="auto", temperature=0.6)
        body = resp['content'].strip()
    except Exception:
        body = f"Hi {client_name},\n\nWe hope you enjoyed working with us! Could you please take a moment to complete our NPS survey? It’s just one question: https://forms.gle/your-nps-form\n\nThanks!\nKleber"
    subject = f"NPS Survey — We'd love your feedback"
    return subject, body

def cmd_run(dry_run: bool, limit: int = 0):
    print("📊 Client NPS Survey Automation scanning…")
    projects = find_completed_projects()
    print(f"   Found {len(projects)} project completions to process")

    db = load_nps_db()
    sent = skipped = 0

    for proj in projects:
        if limit and sent >= limit:
            print(f"   ⏹️  Limit ({limit}) reached; stopping.")
            break
        domain = proj['domain']
        msg_date_str = proj.get('date','')
        try:
            # Parse date roughly
            msg_date = datetime.datetime.strptime(msg_date_str[:10], '%Y-%m-%d').date()
        except Exception:
            msg_date = datetime.date.today()

        eligibility_date = msg_date + datetime.timedelta(days=DELAY_DAYS)
        if datetime.date.today() < eligibility_date:
            skipped += 1
            continue  # not yet eligible

        rec = db['surveys'].get(domain)
        if rec:
            if rec.get('status') in ('sent', 'responded'):
                continue  # already handled

        client_name = extract_client_name(domain)
        subject, body = generate_nps_email(domain, client_name)
        to_addr = f"contact@{domain}"  # best guess; we could lookup from Drive Clients folder but keep simple

        if dry_run:
            print(f"   [DRY-RUN] Would send NPS to {domain} ({client_name})")
            rec = {'status': 'pending_send', 'last_attempt': datetime.date.today().isoformat(), 'client': client_name}
            db['surveys'][domain] = rec
            sent += 1
            continue

        # Send email draft (safe)
        try:
            draft_id = gmail_create_draft_new(subject=subject, body=body, to_addr=to_addr)
            print(f"   ✅ NPS draft created for {domain} → {to_addr}")
            db['surveys'][domain] = {
                'status': 'draft_created',
                'draft_id': draft_id,
                'last_attempt': datetime.date.today().isoformat(),
                'client': client_name,
            }
            sent += 1
        except Exception as e:
            print(f"   ❌ Draft failed for {domain}: {e}")

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_nps_db(db)

    print(f"\n✅ Processed: {sent} surveys drafted, {skipped} not yet eligible.")
    if dry_run:
        print("💡 Add --execute to send drafts.")

def main():
    parser = argparse.ArgumentParser(description='Client NPS Survey Automation')
    parser.add_argument('--execute', action='store_true', help='Send NPS emails (default dry-run)')
    parser.add_argument('--limit', type=int, default=20, help='Max surveys to send')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
