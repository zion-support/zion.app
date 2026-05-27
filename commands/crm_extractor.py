#!/usr/bin/env python3
"""
CRM Contact Extractor - Build Contact Database from Emails

Features:
- Extract contacts from email signatures
- Parse phone numbers, titles, companies
- Build structured contact database
- Portuguese/English signature detection

Usage:
  python3 crm_extractor.py --extract --limit 50
"""

import sys, json, re
from pathlib import Path
from datetime import datetime

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

CRM_DB = WORKSPACE / 'zion.app' / 'data' / 'contacts.json'

def load_contacts():
    if CRM_DB.exists():
        return json.loads(CMR_DB.read_text())
    return {}

def save_contacts(contacts):
    CRM_DB.parent.mkdir(parents=True, exist_ok=True)
    CRM_DB.write_text(json.dumps(contacts, indent=2))

def extract_signature(text):
    """Extract signature from email body"""
    # Common signature patterns
    lines = text.split('\n')
    sig_lines = []
    
    for i, line in enumerate(lines[-10:]):  # Check last 10 lines
        # Signature usually has less punctuation, more contact info
        if any(x in line.lower() for x in ['@', 'phone', 'telefone', 'cel', 'whats', '+', 'linkedin', 'github']):
            sig_lines.append(line)
    
    return '\n'.join(sig_lines)

def parse_contact_info(text, sender_email):
    """Parse contact info from signature"""
    contact = {'email': sender_email, 'source': 'email_signature'}
    
    # Phone patterns
    phone_match = re.search(r'(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}', text)
    if phone_match:
        contact['phone'] = phone_match.group(0)
    
    # Name (usually in email or first line)
    name_match = re.search(r'"([^"]+)"', sender_email) or re.search(r'<([^>]+)>\s*([^<]+)', sender_email)
    if name_match:
        contact['name'] = name_match.group(1) if '"' in sender_email else name_match.group(2)
    
    # Title patterns
    title_patterns = [
        r'(?:CEO|CTO|CFO|Director|Gerente|Coordenador|Manager|Specialist|Consultor)',
        r'(?:Sra\.|Sr\.|Sra|Sr)\s+([A-Z][a-z]+)'
    ]
    for pattern in title_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            contact['title'] = match.group(0)
            break
    
    # Company (usually after title)
    company_match = re.search(r'([A-Z][a-zA-Z\s]+(?:Ltda|Ltd|Inc|Corp|S/A))', text)
    if company_match:
        contact['company'] = company_match.group(1)
    
    return contact

def main():
    limit = 50
    for arg in sys.argv:
        if arg.isdigit():
            limit = int(arg)
    
    print(f"📇 CRM Contact Extractor - Analyzing {limit} emails")
    
    messages = gmail_search('label:V14-Done', limit=limit)
    contacts = load_contacts()
    stats = {'extracted': 0, 'skipped': 0}
    
    for msg in messages:
        msg_id = msg['id']
        full = gmail_get(msg_id)
        headers = {h['name']: h['value'] for h in full.get('payload', {}).get('headers', [])}
        
        sender = headers.get('From', '')
        sender_email = sender.split('<')[-1].replace('>', '').strip() if '<' in sender else sender
        
        if not sender_email or sender_email in contacts:
            stats['skipped'] += 1
            continue
        
        # Get email body
        snippet = full.get('snippet', '')
        signature = extract_signature(snippet)
        
        if signature:
            contact = parse_contact_info(signature, sender_email)
            if contact.get('phone') or contact.get('name'):
                contacts[sender_email] = contact
                stats['extracted'] += 1
                print(f"  ✅ {contact.get('name', 'Unknown')}: {sender_email[:20]}")
    
    save_contacts(contacts)
    print(f"\n📊 Contacts extracted: {stats['extracted']}")
    print(f"⚡ Database updated: {len(contacts)} total contacts")

if __name__ == '__main__':
    main()