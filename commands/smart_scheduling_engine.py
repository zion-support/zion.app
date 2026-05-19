#!/usr/bin/env python3
"""Smart Scheduling Engine - Optimal timing for emails"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
sys.path.insert(0, '/root/.openclaw/workspace/zion.app/commands')

try:
    from google_workspace import telegram_send
except:
    def telegram_send(t): print(f"[TG] {t}")

SCHEDULE_LOG = Path('/root/.openclaw/workspace/zion.app/data/smart_schedule.json')

# Business hours by priority
TIME_WINDOWS = {
    'urgent': [(0, 24)],      # Anytime
    'booking': [(8, 20)],     # Business hours
    'sales': [(9, 17)],       # Prime time
    'portuguese': [(8, 18)],  # Brazil-friendly hours
    'general': [(9, 17)],    # Standard biz hours
}

def get_optimal_send_time(intents, recipient_tz='America/Sao_Paulo'):
    """Calculate best time to send based on intents"""
    now = datetime.now(timezone.utc)
    best_window = TIME_WINDOWS.get(intents[0], TIME_WINDOWS['general']) if intents else TIME_WINDOWS['general']
    
    # Simple: next hour within window
    for hour in range(now.hour, 24):
        start, end = best_window[0]
        if end > hour >= start:
            return now.replace(hour=hour, minute=0, second=0) + timedelta(hours=1)
    return now + timedelta(hours=8)  # Default next morning

def main(execute=True):
    print("⏰ Smart Scheduling Engine - Calculating optimal times...")
    
    optimal = get_optimal_send_time(['booking', 'general'])
    if execute:
        telegram_send(f"⏰ Optimal send time: {optimal.strftime('%H:%M')} UTC")
    
    return optimal

if __name__ == '__main__':
    main(execute=True)