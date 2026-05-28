#!/usr/bin/env python3
"""
Drive Organizer — Zion Tech Group

Auto-organizes Google Drive root and shared drives into structured folders.
Creates hierarchy: /Clients/<ClientName>/..., /Projects/<ProjectName>/...,
/Finance/RateCards/..., /Templates/... and moves stray files accordingly.
Uses filename patterns and email-based heuristics to detect client/project.

Schedule: Daily at 02:30

Usage: python3 drive_organizer.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.parse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import drive_move_file, drive_create_folder, drive_find_folder_by_name, drive_get_parents, gog_headers

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'drive_organizer.json'
ROOT_ID = 'root'  # will be resolved via API

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'moved': [], 'skipped': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def ensure_folder(path_parts, create=True):
    """Traverse/create nested folder path; return leaf folder ID."""
    current = ROOT_ID
    for part in path_parts:
        fid = drive_find_folder_by_name(part, parent=current)
        if not fid and create:
            fid = drive_create_folder(part, parent_id=current)
        if not fid:
            raise Exception(f"Folder '{part}' not found and creation disabled/failed")
        current = fid
    return current

def guess_client_folder(filename):
    """Extract client name from filename patterns."""
    patterns = [
        r'(?:Client|Customer|Account)[\s_-]*([A-Za-z0-9]+)',
        r'([A-Za-z0-9]+)[\s_-]*(?:proposal|contract|invoice|rate)',
        r'Zion[\s_-]*([A-Za-z0-9]+)'
    ]
    for p in patterns:
        m = re.search(p, filename, re.I)
        if m:
            return m.group(1).title()
    return None

def categorize_file(meta):
    """Return target folder path parts (list) for a file."""
    name = meta.get('name','')
    mime = meta.get('mimeType','')
    parents = meta.get('parents', [])

    # Skip if already in a organized parent
    organized_parents = ['Clients', 'Projects', 'Finance', 'Templates', 'Archive']
    for p in parents:
        # Would need folder name lookup; for now, skip check — we'll just avoid moving things in our target dirs by path
        pass

    if 'template' in name.lower():
        return ['Templates']
    if any(kw in name.lower() for kw in ['rate card', 'ratecard', 'pricing', 'global rate']):
        return ['Finance', 'RateCards']
    if any(kw in name.lower() for kw in ['invoice', 'invoice_', 'receipt']):
        return ['Finance', 'Invoices']
    if any(kw in name.lower() for kw in ['proposal', 'contract', 'sow', 'statement of work']):
        cli = guess_client_folder(name)
        if cli:
            return ['Clients', cli, 'Contracts']
        return ['Archive']
    if any(kw in name.lower() for kw in ['meeting notes', 'minutes', 'notes']):
        cli = guess_client_folder(name)
        if cli:
            return ['Clients', cli, 'Notes']
        return ['Projects', 'Notes']
    # Google AI Studio experiments
    if 'google ai studio' in name.lower():
        return ['Projects', 'GoogleAIStudio']

    # Default: keep in place
    return None

def list_owned_files(limit):
    """List files owned by the user via Drive API."""
    query = "trashed=false and 'me' in owners"
    url = f"https://www.googleapis.com/drive/v3/files?q={urllib.parse.quote_plus(query)}&pageSize={limit}&fields=files(id,name,modifiedTime,mimeType,parents)"
    req = urllib.request.Request(url, headers=gog_headers())
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp.get('files', [])

def cmd_run(dry_run=True, limit=100):
    db = load_db()
    files = list_owned_files(limit)
    if not files:
        print("✅ No files found in Drive.")
        return

    moved = 0
    skipped = 0
    for f in files:
        fid = f.get('id')
        name = f.get('name','')
        if fid in db.get('moved', []):
            continue
        target = categorize_file(f)
        if not target:
            skipped += 1
            continue
        try:
            target_id = ensure_folder(target)
            if dry_run:
                print(f"   [DRY-RUN] Would move: {name} → /{'/'.join(target)}/")
                db['moved'].append(fid)
                moved += 1
            else:
                drive_move_file(fid, new_parent_id=target_id)
                print(f"   ✅ Moved: {name} → /{'/'.join(target)}/")
                db['moved'].append(fid)
                moved += 1
        except Exception as e:
            print(f"   ⚠️  Failed to move {name}: {e}")
            skipped += 1

    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)

    print(f"\n✅ Processed {len(files)} files. Moved: {moved}, Skipped: {skipped}")
    if dry_run:
        print("💡 Add --execute to organize Drive.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=100)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
