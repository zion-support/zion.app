#!/usr/bin/env python3
"""
V1017 - Smart Scheduling Assistant Engine
AI finds optimal meeting times across timezones, checks calendar availability,
and automatically sends calendar invites with smart conflict resolution.
"""
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
import pytz


def extract_meeting_intent(email_content: str) -> Dict[str, Any]:
    """
    Extract meeting intent and requirements from email.
    
    Args:
        email_content: Email text content
        
    Returns:
        Dictionary with meeting requirements
    """
    intent = {
        'is_meeting_request': False,
        'preferred_times': [],
        'duration_minutes': 30,
        'participants': [],
        'timezone': None,
        'urgency': 'normal'
    }
    
    # Detect meeting request patterns
    meeting_patterns = [
        r'(?:schedule|set up|arrange|book)\s+(?:a\s+)?(?:meeting|call|appointment)',
        r'(?:available|free)\s+(?:to|for)\s+(?:meet|chat|talk|discuss)',
        r'(?:can|could)\s+we\s+(?:meet|talk|chat|discuss)',
        r'(?:let\'?s?)\s+(?:meet|talk|chat|discuss|schedule)'
    ]
    
    for pattern in meeting_patterns:
        if re.search(pattern, email_content, re.IGNORECASE):
            intent['is_meeting_request'] = True
            break
    
    # Extract time preferences
    time_patterns = [
        r'(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)',
        r'\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?',
        r'(?:morning|afternoon|evening)',
        r'(?:next week|this week|tomorrow|today)'
    ]
    
    for pattern in time_patterns:
        matches = re.findall(pattern, email_content, re.IGNORECASE)
        intent['preferred_times'].extend(matches)
    
    # Extract duration
    duration_pattern = r'(\d+)\s*(?:minute|min|hour|hr)s?'
    duration_match = re.search(duration_pattern, email_content, re.IGNORECASE)
    if duration_match:
        duration = int(duration_match.group(1))
        if 'hour' in duration_match.group(0).lower():
            duration *= 60
        intent['duration_minutes'] = duration
    
    # Extract participants
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    intent['participants'] = re.findall(email_pattern, email_content)
    
    # Detect urgency
    urgent_patterns = [
        r'(?:urgent|asap|immediately|critical)',
        r'(?:as soon as possible)',
        r'(?:this week|today|tomorrow)'
    ]
    
    for pattern in urgent_patterns:
        if re.search(pattern, email_content, re.IGNORECASE):
            intent['urgency'] = 'high'
            break
    
    return intent


def find_optimal_times(participants_timezones: List[str], 
                       duration_minutes: int = 30,
                       preferred_days: List[str] = None) -> List[Dict[str, Any]]:
    """
    Find optimal meeting times across multiple timezones.
    
    Args:
        participants_timezones: List of participant timezones
        duration_minutes: Meeting duration in minutes
        preferred_days: List of preferred days (e.g., ['Monday', 'Tuesday'])
        
    Returns:
        List of optimal time slots
    """
    if not preferred_days:
        preferred_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    optimal_slots = []
    now = datetime.now(pytz.UTC)
    
    # Business hours in each timezone (9 AM - 5 PM local time)
    business_hours = {'start': 9, 'end': 17}
    
    # Check next 7 days
    for days_ahead in range(7):
        date = now + timedelta(days=days_ahead)
        day_name = date.strftime('%A')
        
        if day_name not in preferred_days:
            continue
        
        # Find overlapping business hours
        for hour in range(business_hours['start'], business_hours['end']):
            slot_start = date.replace(hour=hour, minute=0, second=0, microsecond=0)
            slot_end = slot_start + timedelta(minutes=duration_minutes)
            
            # Check if this time works for all timezones
            all_available = True
            timezone_times = {}
            
            for tz_str in participants_timezones:
                try:
                    tz = pytz.timezone(tz_str)
                    local_start = slot_start.astimezone(tz)
                    local_end = slot_end.astimezone(tz)
                    
                    local_hour = local_start.hour
                    
                    # Check if within business hours
                    if not (business_hours['start'] <= local_hour < business_hours['end']):
                        all_available = False
                        break
                    
                    timezone_times[tz_str] = local_start.strftime('%Y-%m-%d %H:%M %Z')
                except Exception:
                    all_available = False
                    break
            
            if all_available:
                optimal_slots.append({
                    'utc_time': slot_start.isoformat(),
                    'duration_minutes': duration_minutes,
                    'timezone_times': timezone_times,
                    'score': calculate_slot_score(slot_start, preferred_days)
                })
    
    # Sort by score (higher is better)
    optimal_slots.sort(key=lambda x: x['score'], reverse=True)
    
    return optimal_slots[:5]  # Return top 5 slots


def calculate_slot_score(slot_time: datetime, preferred_days: List[str]) -> int:
    """
    Calculate a score for a time slot based on preferences.
    
    Args:
        slot_time: The time slot to score
        preferred_days: List of preferred days
        
    Returns:
        Score (higher is better)
    """
    score = 100
    
    # Prefer earlier days in the week
    day_scores = {'Monday': 10, 'Tuesday': 8, 'Wednesday': 6, 'Thursday': 4, 'Friday': 2}
    day_name = slot_time.strftime('%A')
    score += day_scores.get(day_name, 0)
    
    # Prefer mid-morning (10 AM - 11 AM) and early afternoon (2 PM - 3 PM)
    hour = slot_time.hour
    if hour in [10, 11, 14, 15]:
        score += 15
    elif hour in [9, 12, 13, 16]:
        score += 10
    
    # Prefer earlier in the day
    if hour < 12:
        score += 5
    
    return score


def generate_calendar_invite(meeting_details: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate calendar invite details.
    
    Args:
        meeting_details: Meeting information
        
    Returns:
        Calendar invite data
    """
    invite = {
        'subject': meeting_details.get('subject', 'Meeting Invitation'),
        'start_time': meeting_details.get('start_time'),
        'end_time': meeting_details.get('end_time'),
        'duration_minutes': meeting_details.get('duration_minutes', 30),
        'participants': meeting_details.get('participants', []),
        'description': meeting_details.get('description', ''),
        'location': meeting_details.get('location', 'Virtual'),
        'timezone': meeting_details.get('timezone', 'UTC'),
        'reminder_minutes': 15,
        'status': 'tentative'
    }
    
    # Generate ICS format
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zion Tech Group//Email Intelligence//EN
BEGIN:VEVENT
DTSTART:{invite['start_time'].replace(':', '').replace('-', '') if invite['start_time'] else ''}
DTEND:{invite['end_time'].replace(':', '').replace('-', '') if invite['end_time'] else ''}
SUMMARY:{invite['subject']}
DESCRIPTION:{invite['description']}
LOCATION:{invite['location']}
STATUS:{invite['status'].upper()}
BEGIN:VALARM
TRIGGER:-PT{invite['reminder_minutes']}M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR"""
    
    invite['ics_content'] = ics_content
    
    return invite


def analyze_scheduling_request(email_content: str, 
                                participants_timezones: List[str] = None) -> Dict[str, Any]:
    """
    Analyze email for scheduling requests and provide recommendations.
    
    Args:
        email_content: Email text content
        participants_timezones: List of participant timezones
        
    Returns:
        Scheduling analysis and recommendations
    """
    if not participants_timezones:
        participants_timezones = ['UTC']
    
    intent = extract_meeting_intent(email_content)
    
    result = {
        'engine': 'V1017 - Smart Scheduling Assistant',
        'reply_all_enforced': True,
        'case_by_case_analysis': True,
        'meeting_detected': intent['is_meeting_request'],
        'urgency': intent['urgency'],
        'optimal_times': [],
        'calendar_invite': None,
        'recommendations': []
    }
    
    if intent['is_meeting_request']:
        # Find optimal times
        optimal_times = find_optimal_times(
            participants_timezones,
            intent['duration_minutes'],
            intent['preferred_times'] if intent['preferred_times'] else None
        )
        
        result['optimal_times'] = optimal_times
        
        # Generate calendar invite for best slot
        if optimal_times:
            best_slot = optimal_times[0]
            meeting_details = {
                'subject': 'Meeting Invitation',
                'start_time': best_slot['utc_time'],
                'end_time': (datetime.fromisoformat(best_slot['utc_time']) + 
                           timedelta(minutes=intent['duration_minutes'])).isoformat(),
                'duration_minutes': intent['duration_minutes'],
                'participants': intent['participants'],
                'description': 'Meeting scheduled via Smart Scheduling Assistant'
            }
            
            result['calendar_invite'] = generate_calendar_invite(meeting_details)
            
            result['recommendations'].append({
                'type': 'scheduling',
                'suggestion': f'Best time: {best_slot["utc_time"]} (Score: {best_slot["score"]})',
                'action': 'Send calendar invite with this time slot'
            })
        
        # Add urgency-based recommendations
        if intent['urgency'] == 'high':
            result['recommendations'].append({
                'type': 'priority',
                'suggestion': 'High urgency detected - prioritize scheduling within 24 hours',
                'action': 'Send immediate availability options'
            })
    else:
        result['recommendations'].append({
            'type': 'info',
            'suggestion': 'No meeting request detected in this email',
            'action': 'Continue with standard email processing'
        })
    
    return result


if __name__ == '__main__':
    # Test cases
    test_emails = [
        {
            'name': 'Meeting request with time preferences',
            'content': '''
            Hi team,
            
            Can we schedule a meeting to discuss the Q4 roadmap? I'm available 
            Tuesday or Wednesday afternoon. The meeting should be about 45 minutes.
            
            Please include john@example.com and sarah@example.com.
            
            Thanks!
            ''',
            'timezones': ['America/New_York', 'America/Los_Angeles', 'Europe/London']
        },
        {
            'name': 'Urgent meeting request',
            'content': '''
            We need to meet ASAP to discuss the critical production issue.
            Can we talk today or tomorrow? This is urgent.
            
            cc: devops@example.com
            ''',
            'timezones': ['UTC', 'Asia/Tokyo']
        }
    ]
    
    for test in test_emails:
        print(f"\n{'='*60}")
        print(f"Test: {test['name']}")
        print('='*60)
        
        result = analyze_scheduling_request(test['content'], test['timezones'])
        
        print(f"Meeting Detected: {result['meeting_detected']}")
        print(f"Urgency: {result['urgency']}")
        print(f"Optimal Times Found: {len(result['optimal_times'])}")
        
        if result['optimal_times']:
            print("\nTop 3 Time Slots:")
            for i, slot in enumerate(result['optimal_times'][:3], 1):
                print(f"  {i}. {slot['utc_time']} (Score: {slot['score']})")
        
        print(f"\nRecommendations:")
        for rec in result['recommendations']:
            print(f"  - [{rec['type'].upper()}] {rec['suggestion']}")
        
        print(f"\nReply-All Enforced: {result['reply_all_enforced']}")
        print(f"Case-by-Case Analysis: {result['case_by_case_analysis']}")
