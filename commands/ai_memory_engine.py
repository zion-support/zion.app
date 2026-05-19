#!/usr/bin/env python3
"""
V20 - AI Memory Engine + Predictive Timing
Long-term conversation context + Optimal response windows
"""

import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'lib'))

from google_workspace import gmail_search, gmail_get

MEMORY_FILE = WORKSPACE / 'zion.app' / 'memory' / 'ai_memory.json'

class AIMemoryEngine:
    """Stores conversation history for context-aware replies"""
    
    def __init__(self):
        self.memory = self._load_memory()
    
    def _load_memory(self):
        """Load existing memory or create new"""
        try:
            with open(MEMORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return {"conversations": {}, "response_times": defaultdict(list), "preferences": {}}
    
    def _save_memory(self):
        with open(MEMORY_FILE, 'w') as f:
            json.dump(self.memory, f, indent=2)
    
    def record_interaction(self, sender, subject, reply_sent, response_time_minutes):
        """Record an interaction for learning"""
        thread_id = sender.split('<')[0].strip() if '<' in sender else sender
        
        if thread_id not in self.memory["conversations"]:
            self.memory["conversations"][thread_id] = []
        
        self.memory["conversations"][thread_id].append({
            "subject": subject,
            "timestamp": datetime.now().isoformat(),
            "reply_sent": reply_sent,
            "response_time_minutes": response_time_minutes
        })
        
        # Record response time for this sender
        self.memory["response_times"][thread_id].append(response_time_minutes)
        
        self._save_memory()
    
    def get_thread_context(self, sender):
        """Get conversation history for a sender"""
        thread_id = sender.split('<')[0].strip() if '<' in sender else sender
        return self.memory["conversations"].get(thread_id, [])[-5:]  # Last 5 interactions
    
    def predict_optimal_response_time(self, sender):
        """Predict best time to respond based on past interactions"""
        times = self.memory["response_times"].get(sender, [])
        if not times:
            return "now"  # No history, respond now
        
        avg_time = sum(times) / len(times)
        if avg_time < 30:
            return "immediate"  # Usually respond quickly
        elif avg_time < 120:
            return "soon"  # Within 2 hours
        else:
            return "flexible"  # Response time varies

class PredictiveTimingEngine:
    """Learns optimal response windows for different email types"""
    
    def __init__(self):
        self.timing_patterns = {
            "booking": {"peak_hours": [9, 14, 16], "timezone": "BRT"},
            "urgent": {"peak_hours": [8, 12, 18], "timezone": "BRT"},
            "sales": {"peak_hours": [10, 15, 17], "timezone": "BRT"}
        }
    
    def get_optimal_window(self, email_type, timezone="America/Sao_Paulo"):
        """Get best response time window"""
        import pytz
        tz = pytz.timezone(timezone)
        now = datetime.now(tz)
        
        patterns = self.timing_patterns.get(email_type, self.timing_patterns["booking"])
        peak_hours = patterns["peak_hours"]
        
        current_hour = now.hour
        for peak in peak_hours:
            if current_hour <= peak + 2:
                return f"Next peak: {peak}:00 {timezone}"
        
        return "Respond within 24 hours"

if __name__ == '__main__':
    mem = AIMemoryEngine()
    timing = PredictiveTimingEngine()
    
    print("🧠 AI Memory Engine + Predictive Timing loaded")
    print(f"   Memory entries: {len(mem.memory['conversations'])}")