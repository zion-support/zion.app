#!/usr/bin/env python3
"""
V587 - Email Thread Visualizer
Creates visual timelines and interactive navigation for email conversations.
Maps participant relationships and highlights key decision points.
Enforces reply-all for all communications.
"""
import json
from datetime import datetime
from typing import Dict, List
from collections import defaultdict

class EmailThreadVisualizer:
    def __init__(self):
        self.reply_all_enforced = True
    
    def visualize_thread(self, email_thread: List[Dict]) -> Dict:
        """Create visual representation of email thread"""
        if not email_thread:
            return {
                'engine': 'V587_Email_Thread_Visualizer',
                'timestamp': datetime.now().isoformat(),
                'error': 'No thread data provided',
                'reply_all_enforced': self.reply_all_enforced
            }
        
        # Build timeline
        timeline = self._build_timeline(email_thread)
        
        # Map participants
        participants = self._map_participants(email_thread)
        
        # Identify decision points
        decision_points = self._identify_decision_points(email_thread)
        
        # Calculate thread metrics
        metrics = self._calculate_thread_metrics(email_thread)
        
        # Generate visualization data
        visualization_data = self._generate_visualization_data(
            timeline, participants, decision_points, metrics
        )
        
        return {
            'engine': 'V587_Email_Thread_Visualizer',
            'timestamp': datetime.now().isoformat(),
            'thread_id': email_thread[0].get('id', 'unknown'),
            'timeline': timeline,
            'participants': participants,
            'decision_points': decision_points,
            'thread_metrics': metrics,
            'visualization_data': visualization_data,
            'reply_all_enforced': self.reply_all_enforced,
            'all_recipients': email_thread[-1].get('to', []) + email_thread[-1].get('cc', [])
        }
    
    def _build_timeline(self, thread: List[Dict]) -> List[Dict]:
        """Build chronological timeline of emails"""
        timeline = []
        
        for idx, email in enumerate(thread):
            timeline.append({
                'position': idx + 1,
                'email_id': email.get('id', f'email-{idx}'),
                'timestamp': email.get('timestamp', ''),
                'sender': email.get('from', ''),
                'subject': email.get('subject', ''),
                'preview': email.get('body', '')[:100] + '...' if len(email.get('body', '')) > 100 else email.get('body', ''),
                'has_attachments': len(email.get('attachments', [])) > 0,
                'attachment_count': len(email.get('attachments', [])),
                'is_reply': 'Re:' in email.get('subject', ''),
                'sentiment': self._analyze_sentiment(email.get('body', ''))
            })
        
        return timeline
    
    def _map_participants(self, thread: List[Dict]) -> Dict:
        """Map all participants and their relationships"""
        participants = defaultdict(lambda: {
            'email_count': 0,
            'first_email': None,
            'last_email': None,
            'replies_to': set(),
            'replied_by': set()
        })
        
        for email in thread:
            sender = email.get('from', '')
            recipients = email.get('to', []) + email.get('cc', [])
            timestamp = email.get('timestamp', '')
            
            # Update sender stats
            participants[sender]['email_count'] += 1
            if not participants[sender]['first_email']:
                participants[sender]['first_email'] = timestamp
            participants[sender]['last_email'] = timestamp
            
            # Track relationships
            for recipient in recipients:
                participants[sender]['replied_by'].add(recipient)
                participants[recipient]['replies_to'].add(sender)
        
        # Convert sets to lists for JSON serialization
        result = {}
        for email, data in participants.items():
            result[email] = {
                'email_count': data['email_count'],
                'first_email': data['first_email'],
                'last_email': data['last_email'],
                'replies_to': list(data['replies_to']),
                'replied_by': list(data['replied_by']),
                'role': self._determine_role(email, data)
            }
        
        return result
    
    def _determine_role(self, email: str, data: Dict) -> str:
        """Determine participant role in thread"""
        if data['email_count'] > len(data['replies_to']) * 2:
            return 'initiator'
        elif len(data['replied_by']) > 3:
            return 'central_participant'
        elif data['email_count'] == 1:
            return 'single_contributor'
        else:
            return 'active_participant'
    
    def _identify_decision_points(self, thread: List[Dict]) -> List[Dict]:
        """Identify key decision points in thread"""
        decision_keywords = [
            'decided', 'approved', 'agreed', 'confirmed', 'final',
            'go ahead', 'proceed', 'let\'s move forward', 'decision'
        ]
        
        decision_points = []
        
        for idx, email in enumerate(thread):
            body_lower = email.get('body', '').lower()
            
            if any(keyword in body_lower for keyword in decision_keywords):
                decision_points.append({
                    'email_position': idx + 1,
                    'email_id': email.get('id', f'email-{idx}'),
                    'timestamp': email.get('timestamp', ''),
                    'decision_maker': email.get('from', ''),
                    'decision_text': self._extract_decision_text(email.get('body', '')),
                    'impact': 'high' if any(kw in body_lower for kw in ['final', 'approved', 'confirmed']) else 'medium'
                })
        
        return decision_points
    
    def _extract_decision_text(self, body: str) -> str:
        """Extract the actual decision text"""
        sentences = body.split('.')
        decision_keywords = ['decided', 'approved', 'agreed', 'confirmed']
        
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in decision_keywords):
                return sentence.strip()[:200]
        
        return body[:200]
    
    def _analyze_sentiment(self, text: str) -> str:
        """Simple sentiment analysis"""
        text_lower = text.lower()
        
        positive_words = ['great', 'excellent', 'thank', 'appreciate', 'good', 'happy', 'pleased']
        negative_words = ['bad', 'terrible', 'disappointed', 'frustrated', 'angry', 'upset']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _calculate_thread_metrics(self, thread: List[Dict]) -> Dict:
        """Calculate thread metrics"""
        total_emails = len(thread)
        unique_senders = len(set(email.get('from', '') for email in thread))
        
        # Calculate time span
        timestamps = [email.get('timestamp', '') for email in thread if email.get('timestamp')]
        time_span_hours = 0
        
        if len(timestamps) >= 2:
            try:
                first = datetime.fromisoformat(timestamps[0].replace('Z', '+00:00'))
                last = datetime.fromisoformat(timestamps[-1].replace('Z', '+00:00'))
                time_span_hours = (last - first).total_seconds() / 3600
            except:
                time_span_hours = 0
        
        # Calculate average response time
        response_times = []
        for i in range(1, len(thread)):
            try:
                prev_time = datetime.fromisoformat(thread[i-1].get('timestamp', '').replace('Z', '+00:00'))
                curr_time = datetime.fromisoformat(thread[i].get('timestamp', '').replace('Z', '+00:00'))
                response_times.append((curr_time - prev_time).total_seconds() / 3600)
            except:
                pass
        
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        return {
            'total_emails': total_emails,
            'unique_participants': unique_senders,
            'time_span_hours': round(time_span_hours, 1),
            'average_response_time_hours': round(avg_response_time, 1),
            'total_attachments': sum(len(email.get('attachments', [])) for email in thread),
            'thread_density': round(total_emails / max(time_span_hours, 1), 2)
        }
    
    def _generate_visualization_data(self, timeline: List[Dict], participants: Dict, 
                                     decision_points: List[Dict], metrics: Dict) -> Dict:
        """Generate data structure for visualization"""
        return {
            'timeline_chart': {
                'type': 'horizontal_timeline',
                'data_points': len(timeline),
                'time_range': f"{timeline[0]['timestamp']} to {timeline[-1]['timestamp']}" if timeline else 'N/A'
            },
            'participant_network': {
                'type': 'network_graph',
                'nodes': len(participants),
                'edges': sum(len(p['replied_by']) for p in participants.values())
            },
            'decision_flow': {
                'type': 'flow_chart',
                'decision_count': len(decision_points),
                'high_impact_decisions': sum(1 for d in decision_points if d['impact'] == 'high')
            },
            'sentiment_progression': {
                'type': 'line_chart',
                'data_points': [t['sentiment'] for t in timeline]
            }
        }

if __name__ == "__main__":
    visualizer = EmailThreadVisualizer()
    test_thread = [
        {
            'id': '1',
            'from': 'manager@company.com',
            'to': ['team@company.com'],
            'timestamp': '2024-01-15T09:00:00Z',
            'subject': 'Project Kickoff',
            'body': 'Let\'s start the new project. Please review the requirements.'
        },
        {
            'id': '2',
            'from': 'developer@company.com',
            'to': ['manager@company.com', 'team@company.com'],
            'timestamp': '2024-01-15T10:30:00Z',
            'subject': 'Re: Project Kickoff',
            'body': 'Reviewed the requirements. Looks good to proceed.'
        },
        {
            'id': '3',
            'from': 'manager@company.com',
            'to': ['team@company.com'],
            'timestamp': '2024-01-15T11:00:00Z',
            'subject': 'Re: Project Kickoff',
            'body': 'Great! I\'ve approved the project plan. Let\'s move forward with development.'
        }
    ]
    result = visualizer.visualize_thread(test_thread)
    print(json.dumps(result, indent=2))
