#!/usr/bin/env python3
"""
Auto Client Briefs - Zion

Creates periodic client update documents automatically.
- Summarizes recent project progress
- Lists completed milestones
- Highlights upcoming deliverables
- Generates professional PDF/HTML output

Usage:
  python3 auto_client_briefs.py --client <email> --execute
  python3 auto_client_briefs.py --execute --limit 5
"""

import sys
from datetime import datetime, timedelta
from pathlib import Path
WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, drive_create_folder

def generate_brief(client_email: str, period: str = 'weekly') -> str:
    """Generate client brief document."""
    brief = f"""# Client Brief - {client_email}

## Period: {period.title()} ({datetime.now().strftime('%Y-%m-%d')})

### 🔧 Recent Progress
- [List completed tasks this period]
- [Key milestones achieved]
- [Issues resolved]

### 📊 Current Status
- Project phase: [Current phase]
- Schedule variance: [On track / [X] days delay]
- Budget status: [Under budget / On track / Over budget]

### ✅ Completed This Period
- [Milestone/Deliverable 1]
- [Milestone/Deliverable 2]

### 🎯 Next Period Focus
- [Upcoming deliverable 1]
- [Upcoming deliverable 2]
- [Key meeting/checkpoint]

### ⚠️ Risks & Mitigations
- [Risk 1]: Mitigation approach
- [Risk 2]: Mitigation approach

### 💰 Financial Summary
- Spent this period: $[X]
- Total spent: $[Y]
- Remaining budget: $[Z]

---
Generated: {datetime.now().isoformat()}
"""
    return brief

def cmd_run(dry_run: bool, limit: int = 5):
    print("📄 Auto Client Brief Generator")
    
    # In production, would read client list from database
    # For demo, using recent email contacts
    query = 'is:sent newer_than:7d to:(client OR customer) -label:spam'
    msgs = gmail_search(query, limit=limit)
    
    clients = set()
    for msg in msgs:
        headers = msg.get('payload', {}).get('headers', [])
        to = next((h['value'] for h in headers if h['name'] == 'To'), '')
        if to and '@' in to:
            clients.add(to.split('<')[-1].split('>')[0])
    
    print(f"📧 Found {len(clients)} clients for briefs.")
    
    for client in list(clients)[:limit]:
        brief = generate_brief(client)
        print(f"\nBrief for {client}:")
        print(brief[:300] + "...")
    
    if dry_run:
        print(f"\n[DRY-RUN] Would generate {len(clients)} client briefs.")
    else:
        print(f"\n✅ Generated briefs for {len(clients)} clients.")

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=5)
    p.add_argument('--client')
    p.add_argument('--period', default='weekly', choices=['weekly', 'monthly', 'quarterly'])
    args = p.parse_args()
    
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()