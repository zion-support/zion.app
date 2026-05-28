#!/usr/bin/env python3
"""
Website Status Monitor — Zion Tech Group

Cron-friendly HTTP health checker for ZionTechGroup.com and other critical
endpoints. Alerts via Telegram if site is down or returns unexpected status.

Usage:
  python3 website_monitor.py --execute  # Perform check and alert (default dry-run)
"""

import sys, os, re, json, datetime, argparse, urllib.request, urllib.error, socket
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

# ── Configuration ────────────────────────────────────────────────────────────

URLS_TO_CHECK = [
    {'url': 'https://ziontechgroup.com', 'expected': 200, 'name': 'ZionTechGroup Home'},
    # Add more as needed
]

TIMEOUT = 10  # seconds
ALERT_RECIPIENT = 'kleber@ziontechgroup.com'  # also Telegram

def check_url(url_info: dict) -> dict:
    url = url_info['url']
    try:
        req = urllib.request.Request(url, method='GET', headers={'User-Agent': 'ZionMonitor/1.0'})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            status = resp.getcode()
            ok = (status == url_info.get('expected', 200))
            return {'url': url, 'status': status, 'ok': ok, 'error': None}
    except urllib.error.HTTPError as e:
        return {'url': url, 'status': e.code, 'ok': False, 'error': f'HTTP {e.code}'}
    except (socket.timeout, urllib.error.URLError) as e:
        return {'url': url, 'status': None, 'ok': False, 'error': str(e)}
    except Exception as e:
        return {'url': url, 'status': None, 'ok': False, 'error': str(e)}

def cmd_run(dry_run: bool):
    print("🌐 Website Status Monitor running…")
    results = []
    all_ok = True
    for u in URLS_TO_CHECK:
        r = check_url(u)
        results.append(r)
        if r['ok']:
            print(f"   ✅ {u['name']}: {r['status']}")
        else:
            print(f"   ❌ {u['name']}: {r['error'] or r['status']}")
            all_ok = False

    if dry_run:
        print("\n💡 Add --execute to send alerts if any failures.")
        return

    if all_ok:
        print("\n✅ All endpoints healthy. No alerts needed.")
        return

    # Build alert
    lines = ["🚨 *Website Health Alert*\n"]
    for r in results:
        if not r['ok']:
            lines.append(f"• {r['url']} — {r['error'] or 'status '+str(r['status'])}")
    alert_text = '\n'.join(lines)

    try:
        # Telegram
        try:
            from google_workspace import gog_headers
            # The 'message' tool should be available at runtime
            message(action='send', target='telegram', message=alert_text)
            print("📡 Telegram alert sent.")
        except Exception:
            pass
        # Also send email
        import base64, json
        raw = f"Subject: 🚨 Website Health Alert\r\nTo: {ALERT_RECIPIENT}\r\n\r\n{alert_text}"
        encoded = base64.urlsafe_b64encode(raw.encode()).decode().rstrip('=')
        url = 'https://gmail.googleapis.com/gmail/v1/users/me/drafts'
        payload = json.dumps({'message': {'raw': encoded}}).encode()
        req = urllib.request.Request(url, data=payload, headers=gog_headers(), method='POST')
        urllib.request.urlopen(req)
        print("✉️  Draft alert email created.")
    except Exception as e:
        print(f"❌ Alert delivery failed: {e}")

def main():
    parser = argparse.ArgumentParser(description='Website Status Monitor')
    parser.add_argument('--execute', action='store_true', help='Send alerts if failures (default dry-run)')
    args = parser.parse_args()
    cmd_run(dry_run=not args.execute)

if __name__ == '__main__':
    main()
