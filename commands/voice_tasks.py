#!/usr/bin/env python3
"""
Voice Tasks — Zion Tech Group

Converts Telegram voice notes into calendar events.
Kleber sends voice: "Call client tomorrow at 3pm" → auto-event.

Usage: python3 voice_tasks.py [--execute] [--limit N]
"""

import sys, os, re, json, datetime, argparse, subprocess
from pathlib import Path

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import calendar_create_event, telegram_send

QUEUE_DIR = WORKSPACE / 'zion.app' / 'data' / 'voice_queue'
DB_FILE = WORKSPACE / 'zion.app' / 'data' / 'voice_tasks.json'

def load_db():
    if DB_FILE.exists():
        return json.loads(DB_FILE.read_text())
    return {'processed': []}

def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    DB_FILE.write_text(json.dumps(db, indent=2))

def transcribe_audio(ogg_path):
    wav = str(Path(ogg_path).with_suffix('.wav'))
    try:
        subprocess.run(['ffmpeg', '-y', '-i', ogg_path, wav], check=True, capture_output=True)
    except Exception as e:
        return f"[transcode error: {e}]"
    try:
        res = subprocess.run(['whisper', wav, '--model', 'tiny', '--language', 'en', '--output_format', 'txt'], capture_output=True, text=True, timeout=30)
        txt = wav.replace('.wav', '.txt')
        if Path(txt).exists():
            return Path(txt).read_text().strip()
    except Exception:
        pass
    return "[voice — transcription unavailable]"

def parse_task(text):
    now = datetime.datetime.utcnow()
    when = now.strftime('%Y-%m-%d')
    start_time = '09:00:00'
    text_lower = text.lower()
    if 'tomorrow' in text_lower:
        when = (now + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    elif 'today' in text_lower:
        when = now.strftime('%Y-%m-%d')
    m = re.search(r'(\d{1,2})(:(\d{2}))?\s*(am|pm)?', text_lower)
    if m:
        hour = int(m.group(1))
        minute = int(m.group(3) or 0)
        ampm = m.group(4)
        if ampm == 'pm' and hour < 12:
            hour += 12
        elif ampm == 'am' and hour == 12:
            hour = 0
        start_time = f"{hour:02d}:{minute:02d}:00"
    desc = re.sub(r'^(remind me to|call|schedule|book|meeting with)\s+', '', text, flags=re.I).strip().title()[:60]
    return {'title': desc, 'start': f"{when}T{start_time}Z", 'duration': 30}

def process_voice(vf, dry_run):
    transcript = transcribe_audio(str(vf))
    if 'error' in transcript or 'unavailable' in transcript:
        print(f"   ⚠️  Transcribe failed: {vf.name}")
        return False
    task = parse_task(transcript)
    print(f"   🎤 {transcript[:60]}")
    print(f"   📅 {task['title']} at {task['start']}")
    if dry_run:
        print(f"   [DRY-RUN] Would create event")
        return True
    try:
        end_dt = datetime.datetime.fromisoformat(task['start'].replace('Z','')) + datetime.timedelta(minutes=task['duration'])
        eid = calendar_create_event({
            'summary': task['title'],
            'start': {'dateTime': task['start']},
            'end': {'dateTime': end_dt.isoformat() + 'Z'},
            'description': f"Voice note: {transcript}"
        })
        telegram_send(f"📅 Voice Task Scheduled:\n{task['title']}\n{task['start']} UTC")
        print(f"   ✅ Event {eid}")
        return True
    except Exception as e:
        print(f"   ❌ Calendar failed: {e}")
        return False

def cmd_run(dry_run=True, limit=10):
    db = load_db()
    files = sorted(QUEUE_DIR.glob('*.ogg'), key=os.path.getmtime)[:limit]
    if not files:
        print("✅ No voice notes queued.")
        return
    processed = 0
    for vf in files:
        if vf.name in db.get('processed', []):
            continue
        print(f"   Processing {vf.name}")
        if process_voice(vf, dry_run):
            db['processed'].append(vf.name)
            processed += 1
        try: vf.unlink()
        except: pass
    if not dry_run:
        db['lastRun'] = datetime.datetime.utcnow().isoformat()
        save_db(db)
    print(f"\n✅ Processed {processed} voice notes.")
    if dry_run:
        print("💡 Add --execute to create events.")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=10)
    args = p.parse_args()
    cmd_run(dry_run=not args.execute, limit=args.limit)

if __name__ == '__main__':
    main()
