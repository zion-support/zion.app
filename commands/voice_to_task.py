import sys
import json
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

# Import only what we need, handle errors gracefully
try:
    from google_workspace import gmail_search, gmail_get, telegram_send
except:
    def gmail_search(query, limit=20):
        return []
    def gmail_get(id):
        return {}
    def telegram_send(text):
        print(f"[TELEGRAM] {text}")

TASK_LOG = WORKSPACE / 'zion.app' / 'data' / 'voice_tasks.json'

TASK_INDICATORS = [
    'todo', 'to do', 'need to', 'have to', 'must', 'should', 'will',
    'remind me', 'don\'t forget', 'action item'
]


def extract_from_voice_emails(limit=20):
    """Extract tasks from voice messaging app emails."""
    tasks = []
    queries = [
        'subject:"voice message"',
        'subject:"voicemail"',
        'subject:"audio note"',
    ]
    
    for query in queries:
        try:
            emails = gmail_search(query, limit=10)
            for email in emails:
                msg = gmail_get(email['id'])
                headers = msg.get('payload', {}).get('headers', [])
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                snippet = msg.get('snippet', '').lower()
                
                for indicator in TASK_INDICATORS:
                    if indicator in snippet:
                        tasks.append({
                            'source': subject,
                            'type': 'voice_email',
                            'extracted_text': snippet[:150],
                            'timestamp': datetime.now(timezone.utc).isoformat(),
                        })
                        break
        except Exception as e:
            print(f"Error searching {query}: {e}")
            continue
    
    return tasks


def extract_from_drive_audio(limit=10):
    """Extract from Drive audio files - stub for now."""
    return []


def convert_to_task(text):
    """Convert voice text to structured task."""
    return {
        'task': text[:100],
        'extracted': True,
    }


def main(execute=True, limit=20):
    print("🎤 Voice-to-Task Converter - Processing voice notes...")
    
    voice_tasks = extract_from_voice_emails(limit)
    audio_tasks = extract_from_drive_audio(limit)
    
    print(f"📊 Found {len(voice_tasks)} voice emails, {len(audio_tasks)} audio files")
    
    converted = []
    for t in voice_tasks + audio_tasks:
        task = convert_to_task(t.get('extracted_text', t.get('source', '')))
        task.update(t)
        converted.append(task)
    
    if TASK_LOG.exists():
        log = json.loads(TASK_LOG.read_text())
    else:
        log = {'tasks': []}
    
    log['tasks'].extend(converted)
    log['last_updated'] = datetime.now(timezone.utc).isoformat()
    TASK_LOG.parent.mkdir(parents=True, exist_ok=True)
    TASK_LOG.write_text(json.dumps(log, indent=2))
    
    if execute:
        telegram_send(f"🎤 Voice Tasks: {len(converted)} extracted")
    
    return converted


if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--execute', action='store_true')
    p.add_argument('--limit', type=int, default=20)
    args = p.parse_args()
    main(execute=args.execute, limit=args.limit)