#!/usr/bin/env python3
"""
Free email lead strategies for all agents
No paid tools required - uses existing Google Workspace OAuth
"""
import json, urllib.request, urllib.parse, re, time

TOKEN_FILE = "/root/.openclaw/workspace/zion-app/secrets/gog_tokens.json"
AGENT_EMAIL = "kleber@ziontechgroup.com"

def get_access_token():
    refresh_script = "/root/.openclaw/workspace/refresh-gmail-free.sh"
    import subprocess
    subprocess.run(["bash", refresh_script], capture_output=True)
    with open(TOKEN_FILE) as f:
        return json.load(f)['access_token']

def search_leads():
    """Search for business/partnership leads using free Gmail API"""
    access_token = get_access_token()
    
    strategies = [
        ('partnership', 'subject:(partnership OR "business proposal" OR collaboration)'),
        ('consultant', 'from:(consultant OR recruiter)'),
        ('services', 'subject:(services OR solutions OR "AI automation")'),
        ('cold-leads', 'in:inbox OR in:sent has:attachment newer_than:30d')
    ]
    
    all_leads = []
    for name, query in strategies:
        encoded = urllib.parse.quote(query)
        url = f'https://gmail.googleapis.com/gmail/v1/users/{AGENT_EMAIL}/messages?q={encoded}&maxResults=20'
        req = urllib.request.Request(url, headers={'Authorization': f'Bearer {access_token}'})
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read().decode())
        
        for msg in data.get('messages', []):
            msg_url = f'https://gmail.googleapis.com/gmail/v1/users/{AGENT_EMAIL}/messages/{msg["id"]}?format=metadata'
            msg_req = urllib.request.Request(msg_url, headers={'Authorization': f'Bearer {access_token}'})
            msg_resp = urllib.request.urlopen(msg_req)
            msg_data = json.loads(msg_resp.read().decode())
            headers = {h['name']: h['value'] for h in msg_data.get('payload', {}).get('headers', [])}
            from_addr = headers.get('From', '')
            email_match = re.search(r'<([^>]+)>', from_addr)
            email = email_match.group(1) if email_match else from_addr
            if email and email != AGENT_EMAIL:
                all_leads.append({'email': email, 'strategy': name, 'subject': headers.get('Subject', '')[:50]})
    
    return all_leads

def log_to_dashboard(leads):
    """Log lead search results to monitoring dashboard"""
    action = {
        'id': f'leads-{int(time.time())}',
        'agent': '@Kilo_openclaw_kleber_bot',
        'action': f'Lead strategies scan - found {len(leads)} potential leads across 4 queries',
        'timestamp': time.strftime('%Y-%m-%d %H:%M'),
        'impact': '+lead mining',
        'category': 'audit'
    }
    
    actions_file = '/root/.openclaw/workspace/zion-app/app/data/agent-actions.json'
    with open(actions_file) as f:
        existing = json.load(f)
    existing.insert(0, action)
    with open(actions_file, 'w') as f:
        json.dump(existing[:100], f, indent=2)
    
    return action

if __name__ == '__main__':
    leads = search_leads()
    action = log_to_dashboard(leads)
    print(f"✅ {action['action']}")
    for lead in leads[:5]:
        print(f"   Lead: {lead['email']} (via {lead['strategy']})")