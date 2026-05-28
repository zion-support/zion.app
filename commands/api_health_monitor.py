#!/usr/bin/env python3
"""API Health Monitor - Check critical endpoints"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE/'zion.app'/ 'commands'))

try:
    from google_workspace import telegram_send
except:
    def telegram_send(t): print(f"[TG] {t}")

HEALTH_LOG = WORKSPACE / 'zion.app' / 'data' / 'api_health.json'
ENDPOINTS = {
    'ziontechgroup.com': 'https://ziontechgroup.com',
    'github': 'https://api.github.com',
}

def check_endpoint(name, url):
    import urllib.request, time
    try:
        start = time.time()
        req = urllib.request.Request(url, headers={'User-Agent': 'ZionMonitor/1.0'})
        resp = urllib.request.urlopen(req, timeout=5)
        return {'name': name, 'status': 'up', 'ms': int((time.time()-start)*1000)}
    except Exception as e:
        return {'name': name, 'status': 'down', 'error': str(e)[:50]}

def main(execute=True):
    results = [check_endpoint(n, u) for n, u in ENDPOINTS.items()]
    up = sum(1 for r in results if r['status']=='up')
    if HEALTH_LOG.exists(): log = json.loads(HEALTH_LOG.read_text())
    else: log = {'checks': []}
    log['checks'] = results
    HEALTH_LOG.parent.mkdir(exist_ok=True)
    HEALTH_LOG.write_text(json.dumps(log, indent=2))
    if execute: telegram_send(f"🏥 API Health: {up}/{len(results)} up")
    return results

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    args = p.parse_args()
    main(execute=args.execute)
