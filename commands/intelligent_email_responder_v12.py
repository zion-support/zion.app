#!/usr/bin/env python3
"""
Intelligent Email Responder V12 - Learning Loop + Time Optimization
Features:
- Track response effectiveness (replies received)
- Learn sender response windows
- Score template success rates
- Auto-suggest improvements
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

WORKSPACE = Path('/root/.openclaw/workspace')
sys.path.insert(0, str(WORKSPACE / 'zion.app' / 'commands'))

class ResponseLearningLoop:
    """Track and learn from response outcomes"""
    
    def __init__(self):
        self.responses_file = WORKSPACE / 'zion.app' / 'data' / 'response_effectiveness_v12.json'
        self.sender_windows_file = WORKSPACE / 'zion.app' / 'data' / 'sender_response_windows.json'
    
    def track_sent_response(self, thread_hash, intent, template, confidence, sent_at, response_text):
        """Record sent response for tracking"""
        data = self._load_json(self.responses_file, {'responses': {}, 'templates': {}})
        
        data['responses'][thread_hash] = {
            'intent': intent,
            'template': template,
            'confidence': confidence,
            'sent_at': sent_at,
            'response_preview': response_text[:100],
            'replied_back': False,
            'reply_time_hours': None,
            'outcome': None
        }
        
        data['templates'].setdefault(intent, {})
        data['templates'][intent][template] = data['templates'][intent].get(template, 0) + 1
        
        self._save_json(self.responses_file, data)
    
    def check_reply_received(self, thread_hash, check_after_hours=48):
        """Check if original sender replied back"""
        data = self._load_json(self.responses_file, {'responses': {}})
        
        if thread_hash not in data['responses']:
            return False
        
        response = data['responses'][thread_hash]
        
        # In production, would check sent folder and replies
        # Placeholder returns current state
        return response.get('replied_back', False)
    
    def record_sender_response_time(self, sender_email, reply_delay_hours):
        """Learn when senders respond fastest"""
        data = self._load_json(self.sender_windows_file, {'senders': {}})
        
        sender_data = data['senders'].setdefault(sender_email, {
            'avg_response_time_hours': reply_delay_hours,
            'response_count': 1,
            'fastest_response_hours': reply_delay_hours,
            'best_reply_time': datetime.now(timezone.utc).hour
        })
        
        # Update rolling average
        count = sender_data['response_count']
        sender_data['avg_response_time_hours'] = (
            (sender_data['avg_response_time_hours'] * (count - 1) + reply_delay_hours) / count
        )
        sender_data['response_count'] = count + 1
        
        if reply_delay_hours < sender_data.get('fastest_response_hours', 999):
            sender_data['fastest_response_hours'] = reply_delay_hours
        
        self._save_json(self.sender_windows_file, data)
    
    def recommend_improvements(self):
        """Analyze and suggest template improvements"""
        data = self._load_json(self.responses_file, {'templates': {}})
        recommendations = []
        
        for intent, templates in data['templates'].items():
            # Find most/least used templates
            if len(templates) > 1:
                sorted_templates = sorted(templates.items(), key=lambda x: x[1], reverse=True)
                recommendations.append({
                    'intent': intent,
                    'most_used': sorted_templates[0][0],
                    'suggestion': f"Consider A/B testing variant for {intent} responses"
                })
        
        return recommendations
    
    def _load_json(self, path, default):
        if path.exists():
            return json.loads(path.read_text())
        return default
    
    def _save_json(self, path, data):
        path.write_text(json.dumps(data, indent=2, default=str))

# ========== AUTO-TIME OPTIMIZATION ==========

class TimeOptimizer:
    """Recommend optimal send times by sender"""
    
    def get_optimal_send_time(self, sender_email):
        sender_windows = WORKSPACE / 'zion.app' / 'data' / 'sender_response_windows.json'
        
        if sender_windows.exists():
            data = json.loads(sender_windows.read_text())
            sender_data = data.get('senders', {}).get(sender_email, {})
            if sender_data.get('best_reply_time'):
                return sender_data['best_reply_time']
        
        # Default: business hours 9-17 local
        return 10  # 10 AM

if __name__ == '__main__':
    loop = ResponseLearningLoop()
    print("V12 Learning Loop initialized")
    
    # Show recommendations
    for rec in loop.recommend_improvements():
        print(f"  - {rec['suggestion']} (intent: {rec['intent']})")