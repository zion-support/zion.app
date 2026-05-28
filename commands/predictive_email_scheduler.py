import sys
import json
import re
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import Counter, defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(query, limit=20):
        return []
    def gmail_get(id):
        return {}
    def telegram_send(text):
        print(f"[TELEGRAM] {text}")

SCHEDULE_LOG = WORKSPACE / 'zion.app' / 'data' / 'email_schedule.json'

DEFAULT_BEST_HOURS = [9, 10, 11, 14, 15, 16]  # Business hours


def analyze_recipient_timing(domain=None):
    """Analyze when recipients typically reply."""
    timing = {
        'best_hours': DEFAULT_BEST_HOURS.copy(),
        'best_days': [1, 2, 3],  # Mon, Tue, Wed
        'avoid_hours': [0, 1, 2, 3, 4, 5, 22, 23],
        'timezone_pattern': 'Americas',
    }
    
    if domain:
        try:
            emails = gmail_search(f'from:@{domain}', limit=30)
            reply_hours = []
            
            for e in emails:
                msg = gmail_get(e['id'])
                for h in msg.get('payload', {}).get('headers', []):
                    if h['name'] == 'Date':
                        date_str = h['value']
                        # Extract hour from RFC date format
                        import email.utils
                        try:
                            parsed = email.utils.parsedate_to_datetime(date_str)
                            reply_hours.append(parsed.hour)
                        except:
                            pass
            
            if reply_hours:
                timing['best_hours'] = [h for h, _ in Counter(reply_hours).most_common(5)]
        except Exception as ex:
            print(f"Error analyzing domain {domain}: {ex}")
    
    return timing


def main(execute=True, limit=20):
    print("⏰ Predictive Email Scheduler - Analyzing timing patterns...")
    
    emails = gmail_search('in:sent', limit=50)
    domains = defaultdict(int)
    
    for e in emails:
        try:
            msg = gmail_get(e['id'])
            for h in msg.get('payload', {}).get('headers', []):
                if h['name'] == 'To':
                    addr = h['value']
                    # Extract email from "Name <email>" format
                    if '<' in addr and '>' in addr:
                        addr = addr.split('<')[1].split('>')[0]
                    if '@' in addr:
                        domains[addr.split('@')[1]] += 1
        except:
            continue
    
    print(f"📊 Analyzed {len(domains)} recipient domains")
    
    recommendations = []
    for domain, count in list(domains.items())[:5]:
        timing = analyze_recipient_timing(domain)
        recommendations.append({
            'domain': domain,
            'emails_sent': count,
            'optimal_hours': timing['best_hours'],
            'analysis_time': datetime.now(timezone.utc).isoformat(),
        })
    
    if SCHEDULE_LOG.exists():
        log = json.loads(SCHEDULE_LOG.read_text())
    else:
        log = {'recommendations': []}
    
    log['recommendations'] = recommendations
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    SCHEDULE_LOG.parent.mkdir(parents=True, exist_ok=True)
    SCHEDULE_LOG.write_text(json.dumps(log, indent=2))
    
    if execute:
        telegram_send(f"⏰ Email Schedule: {len(recommendations)} domains analyzed")
    
    return recommendations


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit)