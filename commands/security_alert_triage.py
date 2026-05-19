#!/usr/bin/env python3
"""
Security Alert Triage - Automatically analyze and escalate security events

Monitors security emails, log patterns, and threat intelligence to categorize
alerts and trigger appropriate responses.
"""

import sys, json, re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get, telegram_send

SECURITY_LOG_FILE = WORKSPACE / 'zion.app' / 'data' / 'security_alerts.json'

# Alert severity keywords
CRITICAL_KEYWORDS = [
    'breach', 'unauthorized', 'compromise', 'exfiltration', 'malware',
    'ransomware', 'exploit', 'zero-day', 'cve-', 'vulnerability',
]

HIGH_KEYWORDS = [
    'failed login', 'brute force', 'suspicious', 'unusual activity',
    'access denied', 'permission denied', 'unauthorized access',
    'credential', 'password reset', '2fa bypass',
]

MEDIUM_KEYWORDS = [
    'warning', 'alert', 'deprecated', 'ssl', 'certificate', 'tls',
    'outdated', 'version', 'patch', 'update required',
]


def analyze_email_severity(subject: str, snippet: str) -> Dict:
    """Analyze email for security severity."""
    text = f"{subject} {snippet}".lower()
    
    severity = 'low'
    category = 'general'
    matched_keywords = []
    
    # Check critical keywords
    for kw in CRITICAL_KEYWORDS:
        if kw in text:
            severity = 'critical'
            category = 'intrusion'
            matched_keywords.append(kw)
    
    # Check high keywords
    if severity != 'critical':
        for kw in HIGH_KEYWORDS:
            if kw in text:
                severity = 'high'
                category = 'authentication'
                matched_keywords.append(kw)
                break
    
    # Check medium keywords
    if severity == 'low':
        for kw in MEDIUM_KEYWORDS:
            if kw in text:
                severity = 'medium'
                category = 'compliance'
                matched_keywords.append(kw)
                break
    
    return {
        'severity': severity,
        'category': category,
        'keywords': matched_keywords,
    }


def check_security_emails(limit=50) -> List[Dict]:
    """Check for security-related emails."""
    alerts = []
    
    queries = [
        'from:security@',
        'from:noc@',
        'from:abuse@',
        'subject:"security alert"',
        'subject:"unauthorized"',
        'subject:"failed login"',
        'subject:"suspicious"',
    ]
    
    seen_ids = set()
    for query in queries:
        emails = gmail_search(query, limit=20)
        for email in emails:
            if email['id'] not in seen_ids:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
                snippet = msg.get('snippet', '')
                
                analysis = analyze_email_severity(subject, snippet)
                
                alerts.append({
                    'email_id': email['id'],
                    'subject': subject,
                    'sender': sender,
                    'snippet': snippet[:100],
                    **analysis,
                })
                seen_ids.add(email['id'])
    
    return alerts


def generate_response_template(alert: Dict) -> str:
    """Generate response template based on alert type."""
    templates = {
        'critical': """🚨 CRITICAL SECURITY INCIDENT DETECTED

Sender: {sender}
Subject: {subject}

IMMEDIATE ACTIONS REQUIRED:
1. Review affected systems
2. Check logs for unauthorized access
3. Reset compromised credentials
4. Notify security team
5. Document incident

Keywords matched: {keywords}""",
        
        'high': """⚠️ HIGH PRIORITY SECURITY ALERT

Sender: {sender}
Subject: {subject}

Review required:
- Verify account access
- Check for suspicious activity
- Consider credential rotation

Keywords: {keywords}""",
        
        'medium': """ℹ️ Security Notification

Sender: {sender}
Subject: {subject}

Review recommended:
- Update certificates if expired
- Apply pending patches
- Review compliance requirements

Keywords: {keywords}""",
    }
    
    template = templates.get(alert['severity'], templates['medium'])
    return template.format(
        sender=alert['sender'][:30],
        subject=alert['subject'][:50],
        keywords=', '.join(alert['keywords']) or 'none'
    )


def main(execute=True, limit=50):
    """Main execution."""
    print("🛡️ Security Alert Triage - Scanning for security events...")
    
    alerts = check_security_emails(limit)
    
    # Categorize by severity
    by_severity = {'critical': [], 'high': [], 'medium': [], 'low': []}
    for alert in alerts:
        severity = alert['severity']
        by_severity[severity].append(alert)
    
    # Load existing log
    if SECURITY_LOG_FILE.exists():
        log = json.loads(SECURITY_LOG_FILE.read_text())
    else:
        log = {'alerts': []}
    
    # Log new alerts
    for alert in alerts:
        alert['timestamp'] = datetime.now(timezone.utc).isoformat()
        log['alerts'].append(alert)
    
    SECURITY_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    SECURITY_LOG_FILE.write_text(json.dumps(log, indent=2))
    
    # Summary
    print(f"\n📊 Security Alert Summary:")
    print(f"  🔴 Critical: {len(by_severity['critical'])}")
    print(f"  🟠 High: {len(by_severity['high'])}")
    print(f"  🟡 Medium: {len(by_severity['medium'])}")
    print(f"  ⚪ Low: {len(by_severity['low'])}")
    
    # Send alerts
    if execute:
        for alert in by_severity['critical']:
            msg = generate_response_template(alert)
            telegram_send(f"🚨 CRITICAL: {alert['subject'][:40]}")
        
        for alert in by_severity['high'][:3]:
            telegram_send(f"⚠️ HIGH: {alert['subject'][:40]}")
    
    return alerts


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--limit', type=int, default=50)
    args = parser.parse_args()
    main(execute=args.execute, limit=args.limit)