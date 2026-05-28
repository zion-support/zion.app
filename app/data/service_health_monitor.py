#!/usr/bin/env python3
"""
service_health_monitor.py — sample 50/run service page health check
Zero external deps. Stores results in app/data/service-health.json.
Runs from cron (every 5 min).
"""
import json, subprocess, time, re, sys
from pathlib import Path
from datetime import datetime, timezone

APP_ROOT = Path('/root/.openclaw/workspace/zion.app')
DATA    = APP_ROOT / 'app' / 'data'
HEALTH  = DATA / 'service-health.json'
TS_DATA = DATA / 'servicesData.ts'
BASE    = 'https://ziontechgroup.com/services'

LIMIT = 50          # services checked per run
TIMEOUT_SEC = 10    # curl timeout


def extract_ids() -> list[str]:
    src = TS_DATA.read_text()
    # Grab all id: '...' strings in order (deduplicate)
    found = re.findall(r"id:\s*'([^']+)'", src)
    seen: set[str] = set()
    out: list[str] = []
    for sid in found:
        if sid not in seen:
            seen.add(sid)
            out.append(sid)
    return out


def load_health() -> dict:
    if HEALTH.exists():
        return json.loads(HEALTH.read_text())
    return {}


def save_health(data: dict) -> None:
    HEALTH.write_text(json.dumps(data, indent=2))


def choose_batch(ids: list[str], data: dict, limit: int) -> list[str]:
    seen_ok = {k for k, v in data.items() if v.get('last_status') == 200}
    scored = []
    for sid in ids:
        entry = data.get(sid, {})
        last_run = entry.get('last_run_ts', 0)
        # unchecked first, then previously-failing, then oldest-checked
        bucket = 0 if sid not in seen_ok else (1 if entry.get('last_status') != 200 else 2)
        scored.append((bucket, last_run, sid))
    scored.sort()
    return [sid for _, _, sid in scored[:limit]]


def check(url: str) -> dict:
    try:
        r = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code} %{time_total}',
             '--max-time', str(TIMEOUT_SEC), url],
            capture_output=True, text=True, timeout=TIMEOUT_SEC + 5,
        )
        parts = r.stdout.strip().split()
        code = int(parts[0]) if parts else 0
        dur  = float(parts[1]) if len(parts) > 1 else -1.0
        return {'code': code, 'duration': round(dur, 3)}
    except Exception as exc:
        return {'code': 0, 'duration': -1.0, 'error': str(exc)}


def run():
    now = int(time.time())
    ids      = extract_ids()
    data     = load_health()
    batch    = choose_batch(ids, data, LIMIT)
    alerts   = []
    summary  = {'ok': 0, 'slow': 0, 'down': 0, 'err': 0}

    for sid in batch:
        r = check(f'{BASE}/{sid}/')
        prev = data.get(sid, {})
        code = r['code']

        entry = {
            'last_status':   code,
            'last_duration': r['duration'],
            'last_run_ts':   now,
        }

        if code == 200:
            entry['consec_fails']  = 0
            entry['first_fail_ts'] = None
            summary['ok'] += 1
        else:
            consec = prev.get('consec_fails', 0) + 1
            entry['consec_fails']  = consec
            if consec == 1:
                entry['first_fail_ts'] = now
                alerts.append({'id': sid, 'code': code, 'dur': r['duration']})
            if r['duration'] < 0:
                summary['err'] += 1
            elif r['duration'] > 5:
                summary['slow'] += 1
            else:
                summary['down'] += 1

        data[sid] = entry

    save_health(data)

    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    line = (f"[{ts}] checked={len(batch)} ok={summary['ok']}"
            f" slow={summary['slow']} down={summary['down']} err={summary['err']}")
    print(line)
    if alerts:
        for a in alerts:
            print(f"ALERT {a['id']} → {a['code']} ({a['dur']}s)")

    return summary, alerts


if __name__ == '__main__':
    run()
