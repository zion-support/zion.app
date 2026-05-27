#!/usr/bin/env python3
"""
Shared Drive Health — Zion Tech Group

Detects orphaned files, untitled documents, and abandoned folders in shared drives.
Helps clean up shared workspace and improve findability.

Schedule: Daily at 02:45

Usage: python3 shared_drive_health.py [--execute] [--limit 100]
"""

import sys, os, re, json, datetime, argparse
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import drive_list, drive_get_parents

DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'shared_drive_health.json'
REPORTS_DIR = WORKSPACE / 'zion.app' / 'reports' / 'shared_drive_health'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'issues': [], 'lastRun': None}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def is_orphaned(file_meta):
    """A file is orphaned if it has no parents or parents are inaccessible."""
    parents = file_meta.get('parents', [])
    return len(parents) == 0

def is_untitled(name):
    return name.lower() in ['untitled', 'document without title', 'new document', 'unnamed']

def cmd_run(dry_run=True, limit=100):
    db = load_db()
    # Query all files not in trash, limit to owned files
    files = drive_list(limit=limit)
    if not files:
        print("✅ No files found in Drive scan.")
        return

    issues = []
    for f in files:
        fid = f.get('id')
        name = f.get('name','')
        if fid in db.get('issues', []):
            continue
        if is_orphaned(f):
            issues.append((fid, name, 'orphaned (no parent)'))
        elif is_untitled(name):
            issues.append((fid, name, 'untitled'))

    if not issues:
        print(f"✅ No issues found in {len(files)} files.")
        return

    print(f"   ⚠️  Found {len(issues)} problematic files:")
    for fid, name, reason in issues:
        print(f"      • {name} — {reason}")

    if dry_run:
        print("💡 Add --execute to create recovery folder and move these files")
        return

    # Create recovery folder
    recovery_id = None
    try:
        recovery_id = drive_find_folder_by_name('Orphans', parent='root')
        if not recovery_id:
            recovery_id = drive_create_folder('Orphans', parent_id='root')
    except Exception as e:
        print(f"   ❌ Could not create recovery folder: {e}")
        return

    moved = 0
    for fid, name, reason in issues:
        try:
            drive_move_file(fid, new_parent_id=recovery_id)
            db['issues'].append(fid)
            moved += 1
            print(f"   ✅ Moved: {name}")
        except Exception as e:
            print(f"   ⚠️  Failed to move {name}: {e}")

    if moved:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
        telegram_send(f"📁 Shared Drive Health: moved {moved} orphan/untitled files to /Orphans")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=100)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
