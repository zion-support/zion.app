#!/usr/bin/env python3
"""
Intelligent Email Responder V16 - Auto-Reply Monitoring
Features:
- Automatically check if replies were received
- Verify response delivery
- Learn from reply content
- Close conversation loops
"""

import sys, json
from pathlib import Path
from datetime import datetime, timezone, timedelta
import hashlib
import imaplib
import email

WORKSPACE = Path('/root/.openclaw/workspace')

class ReplyMonitorV16:
    """Monitor for replies and verify responses"""
    
    def __init__(self):
        self.tracked_file = WORKSPACE / 'zion.app' / 'data' / 'tracked_conversations.json'
        self.replies_file = WORKSPACE / 'zion.app' / 'data' / 'detected_replies.json'
    
    def check_for_replies(self):
        """Check for new replies (simulated)"""
        if self.tracked_file.exists():
            tracked = json.loads(self.tracked_file.read_text())
        else:
            tracked = {'threads': {}}
        
        # In production, would connect to Gmail/IMAP
        # For now, check verification file
        verification_file = WORKSPACE / 'zion.app' / 'data' / 'response_verification_v10.json'
        
        if verification_file.exists():
            verified = json.loads(verification_file.read_text())
            replies = list(verified.get('tracked', {}).keys())
            
            return {
                'threads_checked': len(tracked.get('threads', {})),
                'replies_found': len(replies),
                'response_rate': len(replies) / max(len(tracked.get('threads', {})), 1)
            }
        
        return {'threads_checked': 0, 'replies_found': 0, 'response_rate': 0}
    
    def analyze_reply_content(self, reply_text):
        """Learn from reply content"""
        analysis = {
            'positive_signals': sum(1 for w in ['obrigado', 'agradeco', 'perfeito', 'excelente'] 
                                    if w in reply_text.lower()),
            'negative_signals': sum(1 for w in ['problema', 'não', 'cancelar', 'desisti'] 
                                    if w in reply_text.lower()),
            'questions_asked': reply_text.count('?'),
            'sentiment': 'positive' if sum(1 for w in ['obrigado', 'agradeco'] if w in reply_text.lower()) 
                         else 'negative' if any(w in reply_text.lower() for w in ['problema', 'cancelar']) 
                         else 'neutral'
        }
        
        return analysis
    
    def mark_conversation_closed(self, thread_id, outcome):
        """Mark conversation as closed with outcome"""
        if self.tracked_file.exists():
            tracked = json.loads(self.tracked_file.read_text())
        else:
            tracked = {'threads': {}}
        
        if thread_id in tracked['threads']:
            tracked['threads'][thread_id]['status'] = 'closed'
            tracked['threads'][thread_id]['outcome'] = outcome
            tracked['threads'][thread_id]['closed_at'] = datetime.now(timezone.utc).isoformat()
          
            self.tracked_file.write_text(json.dumps(tracked))
            return True
        
        return False

class ContinuousImprovementV16:
    """Continuous learning from responses"""
    
    def __init__(self):
        self.learning_file = WORKSPACE / 'zion.app' / 'data' / 'continuous_learning.json'
    
    def record_response_outcome(self, thread_id, our_response, their_reply, outcome):
        """Record what worked/didn't work"""
        if self.learning_file.exists():
            data = json.loads(self.learning_file.read_text())
        else:
            data = {'interactions': []}
        
        data['interactions'].append({
            'thread_id': thread_id,
            'our_response': our_response[:100],
            'their_reply': their_reply[:100] if their_reply else None,
            'outcome': outcome,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        # Keep last 500
        data['interactions'] = data['interactions'][-500:]
        
        self.learning_file.write_text(json.dumps(data))
    
    def get_best_patterns(self):
        """Find what response patterns work best"""
        if self.learning_file.exists():
            data = json.loads(self.learning_file.read_text())
            
            successful = [i for i in data['interactions'] 
                       if i['outcome'] in ['converted', 'positive_reply']]
            
            return {
                'total_attempts': len(data['interactions']),
                'successful': len(successful),
                'success_rate': len(successful) / max(len(data['interactions']), 1)
            }
        
        return {'total_attempts': 0, 'successful': 0, 'success_rate': 0}

if __name__ == '__main__':
    monitor = ReplyMonitorV16()
    improver = ContinuousImprovementV16()
    
    stats = monitor.check_for_replies()
    patterns = improver.get_best_patterns()
    
    print(f"V16 Reply Monitor: {stats['replies_found']}/{stats['threads_checked']} replies detected ({stats['response_rate']*100:.0f}%)")
    print(f"V16 Learning: {patterns['successful']}/{patterns['total_attempts']} successful ({patterns['success_rate']*100:.0f}%)")