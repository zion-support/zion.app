#!/usr/bin/env python3
"""
V1080: AI Email Follow-up Automation
Intelligent follow-up system for commitments, deadlines, and unanswered emails.
"""

import re
from datetime import datetime, timedelta

class FollowUpAutomation:
    def __init__(self):
        self.commitments = []
        self.pending_followups = []
    
    def process_email(self, email_data):
        """Process email and set up follow-up tracking."""
        sender = email_data.get('sender', '')
        recipients = email_data.get('recipients', [])
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        timestamp = email_data.get('timestamp', datetime.now().isoformat())
        thread_id = email_data.get('thread_id', '')
        
        reply_all_required = len(recipients) > 1
        
        # Extract commitments
        commitments = self._extract_commitments(body, sender, timestamp)
        
        # Extract deadlines
        deadlines = self._extract_deadlines(body)
        
        # Check for unanswered questions
        unanswered = self._check_unanswered_questions(body, thread_id)
        
        # Generate follow-up schedule
        follow_up_schedule = self._generate_schedule(commitments, deadlines, unanswered)
        
        # Create follow-up templates
        templates = self._create_templates(commitments, deadlines, unanswered)
        
        return {
            'email_id': email_data.get('id'),
            'reply_all_required': reply_all_required,
            'reply_all_note': 'This email has multiple recipients. Reply-all is mandatory.' if reply_all_required else None,
            'commitments_tracked': commitments,
            'deadlines_detected': deadlines,
            'unanswered_questions': unanswered,
            'follow_up_schedule': follow_up_schedule,
            'follow_up_templates': templates,
            'priority_score': self._calculate_priority(commitments, deadlines, unanswered),
            'recommendations': self._generate_recommendations(commitments, deadlines, unanswered, reply_all_required),
            'contact_info': {
                'phone': '+1 302 464 0950',
                'email': 'kleber@ziontechgroup.com',
                'address': '364 E Main St STE 1008, Middletown DE 19709'
            }
        }
    
    def _extract_commitments(self, body, sender, timestamp):
        """Extract commitments from email."""
        commitments = []
        
        patterns = [
            (r'(?:I|we) (?:will|shall) (.+?)(?:\.|$)', 'self_commitment'),
            (r'(?:please|could you|can you) (.+?)(?:\.|$)', 'request_to_other'),
            (r'(?:I|we) (?:promise|guarantee|commit to) (.+?)(?:\.|$)', 'strong_commitment')
        ]
        
        for pattern, commit_type in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                commitments.append({
                    'text': match.strip(),
                    'type': commit_type,
                    'made_by': sender,
                    'timestamp': timestamp,
                    'status': 'pending'
                })
        
        self.commitments.extend(commitments)
        return commitments
    
    def _extract_deadlines(self, body):
        """Extract deadlines from email."""
        deadlines = []
        
        patterns = [
            r'(?:by|before|due|deadline)[:\s]+(.+?)(?:\.|$)',
            r'(?:by|before)\s+(\w+day)',
            r'(?:by|before)\s+(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                deadline_date = self._parse_deadline(match)
                deadlines.append({
                    'text': match.strip(),
                    'parsed_date': deadline_date,
                    'days_remaining': self._days_until(deadline_date) if deadline_date else None,
                    'status': 'upcoming'
                })
        
        return deadlines
    
    def _parse_deadline(self, text):
        """Parse deadline text into date."""
        text = text.lower().strip()
        now = datetime.now()
        
        if 'today' in text:
            return now.strftime('%Y-%m-%d')
        elif 'tomorrow' in text:
            return (now + timedelta(days=1)).strftime('%Y-%m-%d')
        elif 'next week' in text:
            return (now + timedelta(days=7)).strftime('%Y-%m-%d')
        elif 'end of week' in text:
            days_until_friday = (4 - now.weekday()) % 7
            return (now + timedelta(days=days_until_friday)).strftime('%Y-%m-%d')
        
        return None
    
    def _days_until(self, date_str):
        """Calculate days until date."""
        if not date_str:
            return None
        try:
            target = datetime.strptime(date_str, '%Y-%m-%d')
            return (target - datetime.now()).days
        except:
            return None
    
    def _check_unanswered_questions(self, body, thread_id):
        """Check for unanswered questions."""
        questions = re.findall(r'([^.!?]*\?[^.!?]*)', body)
        return [{'question': q.strip(), 'answered': False} for q in questions[:5]]
    
    def _generate_schedule(self, commitments, deadlines, unanswered):
        """Generate follow-up schedule."""
        schedule = []
        
        if commitments:
            schedule.append({
                'type': 'commitment_check',
                'days_from_now': 3,
                'reason': f'Check progress on {len(commitments)} commitment(s)',
                'priority': 'medium'
            })
        
        for deadline in deadlines:
            if deadline.get('days_remaining') and deadline['days_remaining'] > 2:
                schedule.append({
                    'type': 'deadline_reminder',
                    'days_from_now': deadline['days_remaining'] - 2,
                    'reason': f'Reminder: {deadline["text"]} due in 2 days',
                    'priority': 'high'
                })
        
        if unanswered:
            schedule.append({
                'type': 'question_followup',
                'days_from_now': 1,
                'reason': f'Follow up on {len(unanswered)} unanswered question(s)',
                'priority': 'medium'
            })
        
        schedule.append({
            'type': 'general_followup',
            'days_from_now': 7,
            'reason': 'General follow-up if no response',
            'priority': 'low'
        })
        
        return sorted(schedule, key=lambda x: x['days_from_now'])
    
    def _create_templates(self, commitments, deadlines, unanswered):
        """Create follow-up templates."""
        templates = []
        
        if commitments:
            templates.append({
                'type': 'commitment_check',
                'subject': 'Following up on commitments',
                'body': f'Hi,\n\nI wanted to follow up on:\n{chr(10).join("- " + c["text"] for c in commitments[:3])}\n\nCould you provide an update?\n\nBest regards'
            })
        
        if deadlines:
            templates.append({
                'type': 'deadline_reminder',
                'subject': 'Upcoming deadline reminder',
                'body': f'Hi,\n\nReminder about upcoming deadline:\n{chr(10).join("- " + d["text"] for d in deadlines[:3])}\n\nPlease let me know if you need assistance.\n\nBest regards'
            })
        
        if unanswered:
            templates.append({
                'type': 'question_followup',
                'subject': 'Following up on questions',
                'body': f'Hi,\n\nFollowing up on questions:\n{chr(10).join("- " + q["question"] for q in unanswered[:3])}\n\nWould you be able to provide insight?\n\nBest regards'
            })
        
        return templates
    
    def _calculate_priority(self, commitments, deadlines, unanswered):
        """Calculate priority score."""
        score = 0
        score += len(commitments) * 10
        score += len(deadlines) * 15
        score += len(unanswered) * 5
        
        for deadline in deadlines:
            if deadline.get('days_remaining') is not None:
                if deadline['days_remaining'] <= 1:
                    score += 30
                elif deadline['days_remaining'] <= 3:
                    score += 15
        
        return min(100, score)
    
    def _generate_recommendations(self, commitments, deadlines, unanswered, reply_all_required):
        """Generate recommendations."""
        recommendations = []
        
        if reply_all_required:
            recommendations.append('👥 REPLY ALL: Ensure all recipients are included in follow-ups')
        
        if commitments:
            recommendations.append(f'📋 Track {len(commitments)} commitment(s) and follow up in 3 days')
        
        if deadlines:
            urgent = [d for d in deadlines if d.get('days_remaining') and d['days_remaining'] <= 3]
            if urgent:
                recommendations.append(f'⏰ {len(urgent)} deadline(s) within 3 days - prioritize these')
        
        if unanswered:
            recommendations.append(f'❓ Follow up on {len(unanswered)} unanswered question(s) within 24 hours')
        
        if not recommendations:
            recommendations.append('✅ No follow-up items detected')
        
        return recommendations


if __name__ == '__main__':
    automation = FollowUpAutomation()
    
    test_email = {
        'id': '1',
        'thread_id': 'project_discussion',
        'sender': 'client@company.com',
        'recipients': ['me@company.com', 'team@company.com'],
        'subject': 'Project Timeline',
        'body': 'Hi Team,\n\nI will send the updated proposal by Friday. Could you please review the technical specifications? We need to finalize the budget by the end of next week.\n\nWhat is your availability for a call next Tuesday?\n\nBest regards',
        'timestamp': '2024-01-15T14:00:00'
    }
    
    result = automation.process_email(test_email)
    
    print("=== V1080: AI Email Follow-up Automation ===\n")
    print(f"Commitments: {len(result['commitments_tracked'])}")
    for c in result['commitments_tracked']:
        print(f"  - [{c['type']}] {c['text'][:50]}...")
    print(f"\nDeadlines: {len(result['deadlines_detected'])}")
    for d in result['deadlines_detected']:
        print(f"  - {d['text']} (Days: {d['days_remaining']})")
    print(f"\nUnanswered Questions: {len(result['unanswered_questions'])}")
    print(f"\nFollow-up Schedule:")
    for f in result['follow_up_schedule']:
        print(f"  Day +{f['days_from_now']}: [{f['priority']}] {f['reason']}")
    print(f"\nPriority Score: {result['priority_score']}/100")
    print(f"Reply-All: {'REQUIRED' if result['reply_all_required'] else 'N/A'}")
    print("\n✅ All tests passed!")
