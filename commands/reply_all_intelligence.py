#!/usr/bin/env python3
"""
Reply-All Intelligence Engine
Ensures proper Reply-All handling with CC detection and participant analysis
"""

import sys
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_get

def analyze_reply_all_headers(msg_id):
    """Analyze if Reply-All is needed based on CC/BCC headers"""
    full = gmail_get(msg_id)
    headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
    
    to_header = headers.get('To', '')
    cc_header = headers.get('Cc', '')
    from_header = headers.get('From', '')
    
    # Parse participants
    to_people = [e.strip() for e in to_header.split(',') if e.strip()]
    cc_people = [e.strip() for e in cc_header.split(',') if e.strip()]
    from_person = from_header
    
    # Determine if multiple recipients need reply
    total_recipients = len(to_people) + len(cc_people)
    
    return {
        'needs_reply_all': total_recipients > 1,
        'reply_all_recipients': to_people + cc_people,
        'cc_count': len(cc_people),
        'participant_roles': identify_roles(to_people + cc_people),
        'recommendation': 'reply_all' if total_recipients > 1 else 'reply_sender_only'
    }

def identify_roles(participants):
    """Identify roles from email addresses"""
    roles = {}
    for p in participants:
        email = p.split('<')[-1].strip('> ') if '<' in p else p
        name = p.split('<')[0].strip('" ') if '<' in p else p
        
        # Role detection
        if any(kw in name.lower() or kw in email.lower() for kw in ['legal', 'lawyer', 'advogado']):
            roles[email] = 'legal'
        elif any(kw in name.lower() or kw in email.lower() for kw in ['finance', 'contabil', 'accounting']):
            roles[email] = 'finance'
        elif any(kw in name.lower() or kw in email.lower() for kw in ['manager', 'gerente', 'director']):
            roles[email] = 'management'
        else:
            roles[email] = 'participant'
    
    return roles

def smart_reply_all_handler(msg_id, reply_content):
    """Handle Reply-All intelligently with role awareness"""
    analysis = analyze_reply_all_headers(msg_id)
    
    if analysis['needs_reply_all']:
        # Include all participants
        recipients = analysis['reply_all_recipients']
        roles = analysis['participant_roles']
        
        # Customize response based on roles
        role_notes = []
        for email, role in roles.items():
            if role == 'legal':
                role_notes.append(f"[FYI: Legal team copied]")
            elif role == 'finance':
                role_notes.append(f"[Billing/Accounting note]")
            elif role == 'management':
                role_notes.append(f"[Management visibility]")
        
        return {
            'action': 'reply_all',
            'recipients': recipients,
            'customizations': role_notes
        }
    else:
        return {'action': 'reply_sender'}

if __name__ == '__main__':
    print("📧 Reply-All Intelligence Engine loaded")