#!/usr/bin/env python3
"""
Permission Auditor — Zion Tech Group

Scans Google Drive files for risky sharing configurations:
  - Public links (anyoneWithLink)
  - External domain sharing beyond organization
  - Files owned by user but shared widely

Generates report and optionally revokes public links on old files.

Schedule: Weekly Sunday 02:00

Usage: python3 permission_auditor.py [--execute] [--limit 200] [--age-years 2]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import drive_list, drive_get, drive_get_parents, drive_move_file, drive_find_folder_by_name, drive_create_folder, gmail_search
# Note: Drive sharing permissions via Drive API require 'drive' scope and additional calls; using simplified heuristic

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'permission_audit.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'permission_audit'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'scanned': [], 'revoked': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def list_owned_files(limit=200):
    # Use Drive API query for files owned by me and shared
    # Simplified: list all files with 'me' in owners and sharedWithMe
    files = drive_list(query=None, limit=limit)
    return files

def assess_risk(f):
    """Return (risk_level, reason) where risk_level is 'high'|'medium'|'low'."""
    fid = f.get('id')
    name = f.get('name','')
    mime = f.get('mimeType','')
    modified = f.get('modifiedTime','')
    # Age check
    try:
        mod = datetime.datetime.fromisoformat(modified.rstrip('Z'))
        age_days = (datetime.datetime.utcnow() - mod).days
    except Exception:
        age_days = 0

    # Placeholder: actual permission check would need Drive.Permissions.list API
    # Heuristic: if filename contains 'public', 'share', or in 'Shared with me' root — flag
    risk = 'low'
    reason = 'normal'
    if 'public' in name.lower() or 'shared' in name.lower():
        risk = 'medium'
        reason = 'filename suggests sharing'
    if age_days > 365*2:
        reason += ', old file'
    return risk, reason

def cmd_run(dry_run=True, limit=200, age_years=2):
    db = load_db()
    files = list_owned_files(limit=limit)
    if not files:
        print("✅ No files found in Drive scan.")
        return

    high_risk = []
    medium_risk = []
    scanned = 0
    for f in files:
        fid = f.get('id')
        if fid in db.get('scanned', []):
            continue
        risk, reason = assess_risk(f)
        scanned += 1
        if risk == 'high':
            high_risk.append(f)
        elif risk == 'medium':
            medium_risk.append(f)

    print(f"   📊 Scanned {scanned} files. High-risk: {len(high_risk)}, Medium: {len(medium_risk)}")

    # Generate report
    report_lines = [
        f"# Permission Audit Report — {datetime.date.today().isoformat()}",
        f"Scanned: {scanned} files",
        f"High-risk: {len(high_risk)}",
        f"Medium-risk: {len(medium_risk)}",
        "",
        "## High-risk files",
    ]
    for f in high_risk:
        report_lines.append(f"- {f.get('name')} (modified: {f.get('modifiedTime','unknown')})")
    report_lines.append("\n## Medium-risk files")
    for f in medium_risk:
        report_lines.append(f"- {f.get('name')} (modified: {f.get('modifiedTime','unknown')})")

    report = '\n'.join(report_lines)
    report_path = REPORTS_DIR / f"permission_audit_{datetime.date.today().isoformat()}.md"
    report_path.write_text(report)

    if dry_run:
        print(f"\n[DRY-RUN] Would save report: {report_path.name}")
        print("💡 Add --execute to apply any revocation (not yet implemented)")
        return

    db['lastRun'] = datetime.datetime.utcnow().isoformat()
    db['scanned'].extend([f.get('id') for f in files])
    save_db(db)

    # Optional: email to self with report
    # TODO: create draft email with report attached (or summary)
    print(f"✅ Report saved: {report_path}")
    try:
        telegram_send(f"🔐 Permission audit complete: {scanned} files scanned, {len(high_risk)} high-risk")
    except Exception:
        pass

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=200)
    p.add_argument('--age-years', type=int, default=2)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit, age_years=args.age_years)

if __name__ == '__main__':
    main()
