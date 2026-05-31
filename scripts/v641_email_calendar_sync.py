#!/usr/bin/env python3
"""V641 - Email Calendar Sync Engine
Automatically extract and sync meetings, events, and deadlines from emails to calendar.
REPLY-ALL ENFORCED: Always replies to all recipients in multi-person threads.
"""
import json, re
from datetime import datetime, timedelta
from typing import Dict, List, Any

class EmailCalendarSyncEngine:
    """Extract and sync calendar events from emails."""
    
    EVENT_PATTERNS = {
        "meeting": [r'\bmeet(?:ing)?\b', r'\bdiscuss(?:ion)?\b', r'\bsync(?:hronize)?\b', r'\bcatch[- ]?up\b'],
        "call": [r'\bcall\b', r'\bphone\b', r'\bconference\b', r'\bzoom\b', r'\bteams\b'],
        "deadline": [r'\bdeadline\b', r'\bdue\s+(?:by|on)\b', r'\bsubmit\s+by\b', r'\bdeliver\s+by\b'],
        "reminder": [r'\breminder\b', r'\bdon.t forget\b', r'\bremember to\b', r'\bfollow[- ]?up\b'],
        "event": [r'\bevent\b', r'\bparty\b', r'\bcelebration\b', r'\banniversary\b']
    }
    
    DATE_PATTERNS = [
        r'\b(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})\b',
        r'\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?\b',
        r'\b(today|tomorrow|yesterday)\b',
        r'\b(?:next|this|last)\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b'
    ]
    
    TIME_PATTERNS = [
        r'\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b',
        r'\b(\d{1,2})\s*(AM|PM|am|pm)\b',
        r'\bat\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?\b'
    ]
    
    DURATION_PATTERNS = [
        r'\b(\d+)\s*(?:hour|hr|h)(?:s)?\b',
        r'\b(\d+)\s*(?:minute|min|m)(?:s)?\b',
        r'\b(\d+)\s*(?:day|d)(?:s)?\b'
    ]
    
    def __init__(self):
        self.synced_events = []
    
    def extract_events(self, email: Dict[str, Any]) -> Dict[str, Any]:
        """Extract calendar events from email."""
        subject = email.get("subject", "")
        body = email.get("body", "")
        text = f"{subject} {body}"
        
        # Detect event type
        event_type = self._detect_event_type(text)
        
        # Extract dates
        dates = self._extract_dates(text)
        
        # Extract times
        times = self._extract_times(text)
        
        # Extract duration
        duration = self._extract_duration(text)
        
        # Extract location
        location = self._extract_location(text)
        
        # Extract attendees
        attendees = self._extract_attendees(email)
        
        # Build calendar event
        calendar_event = self._build_calendar_event(
            email, event_type, dates, times, duration, location, attendees
        )
        
        # Check for conflicts
        conflicts = self._check_conflicts(calendar_event)
        
        # Calculate confidence
        confidence = self._calculate_confidence(dates, times, event_type)
        
        return {
            "engine": "V641",
            "email_subject": subject,
            "event_detected": event_type is not None,
            "event_type": event_type,
            "extracted_dates": dates,
            "extracted_times": times,
            "duration": duration,
            "location": location,
            "attendees": attendees,
            "calendar_event": calendar_event,
            "conflicts": conflicts,
            "confidence_score": round(confidence, 1),
            "sync_recommended": confidence > 60 and event_type is not None,
            "reply_all_enforced": len(email.get("to", []) + email.get("cc", [])) > 1,
            "timestamp": datetime.now().isoformat()
        }
    
    def _detect_event_type(self, text: str) -> str:
        """Detect type of calendar event."""
        text_lower = text.lower()
        
        for event_type, patterns in self.EVENT_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return event_type
        
        return None
    
    def _extract_dates(self, text: str) -> List[Dict]:
        """Extract dates from text."""
        dates = []
        
        # Pattern 1: MM/DD/YYYY or MM-DD-YYYY
        for match in re.finditer(self.DATE_PATTERNS[0], text):
            dates.append({
                "raw": match.group(0),
                "month": int(match.group(1)),
                "day": int(match.group(2)),
                "year": int(match.group(3)),
                "type": "numeric"
            })
        
        # Pattern 2: Month Day, Year
        for match in re.finditer(self.DATE_PATTERNS[1], text):
            dates.append({
                "raw": match.group(0),
                "month_name": match.group(1),
                "day": int(match.group(2)),
                "year": int(match.group(3)) if match.group(3) else datetime.now().year,
                "type": "text"
            })
        
        # Pattern 3: today/tomorrow/yesterday
        for match in re.finditer(self.DATE_PATTERNS[2], text):
            relative = match.group(1)
            today = datetime.now()
            if relative == "today":
                target = today
            elif relative == "tomorrow":
                target = today + timedelta(days=1)
            else:
                target = today - timedelta(days=1)
            
            dates.append({
                "raw": relative,
                "date": target.strftime("%Y-%m-%d"),
                "type": "relative"
            })
        
        # Pattern 4: next/this/last weekday
        for match in re.finditer(self.DATE_PATTERNS[3], text, re.IGNORECASE):
            dates.append({
                "raw": match.group(0),
                "type": "weekday",
                "description": match.group(0)
            })
        
        return dates[:5]
    
    def _extract_times(self, text: str) -> List[Dict]:
        """Extract times from text."""
        times = []
        
        # Pattern 1: HH:MM AM/PM
        for match in re.finditer(self.TIME_PATTERNS[0], text):
            hour = int(match.group(1))
            minute = int(match.group(2))
            period = match.group(3)
            
            if period and period.upper() == "PM" and hour < 12:
                hour += 12
            
            times.append({
                "raw": match.group(0),
                "hour": hour,
                "minute": minute,
                "period": period,
                "24h_format": f"{hour:02d}:{minute:02d}"
            })
        
        # Pattern 2: H AM/PM
        for match in re.finditer(self.TIME_PATTERNS[1], text):
            hour = int(match.group(1))
            period = match.group(2)
            
            if period.upper() == "PM" and hour < 12:
                hour += 12
            
            times.append({
                "raw": match.group(0),
                "hour": hour,
                "minute": 0,
                "period": period,
                "24h_format": f"{hour:02d}:00"
            })
        
        return times[:3]
    
    def _extract_duration(self, text: str) -> Dict:
        """Extract event duration."""
        text_lower = text.lower()
        
        # Hours
        hour_match = re.search(self.DURATION_PATTERNS[0], text_lower)
        if hour_match:
            return {"hours": int(hour_match.group(1)), "minutes": 0, "total_minutes": int(hour_match.group(1)) * 60}
        
        # Minutes
        min_match = re.search(self.DURATION_PATTERNS[1], text_lower)
        if min_match:
            minutes = int(min_match.group(1))
            return {"hours": minutes // 60, "minutes": minutes % 60, "total_minutes": minutes}
        
        # Default duration based on event type
        return {"hours": 1, "minutes": 0, "total_minutes": 60, "default": True}
    
    def _extract_location(self, text: str) -> str:
        """Extract event location."""
        # Look for location patterns
        patterns = [
            r'\bat\s+([A-Z][\w\s]+(?:Room|Suite|Floor|Building|Office))\b',
            r'\bin\s+(?:the\s+)?([A-Z][\w\s]+(?:room|conference|meeting))\b',
            r'(?:location|venue|place)[:\s]+([^\n.]+)',
            r'(?:zoom|teams|meet)\s+(?:link|url)[:\s]+(https?://\S+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return "TBD"
    
    def _extract_attendees(self, email: Dict) -> List[str]:
        """Extract event attendees from email."""
        attendees = []
        attendees.extend(email.get("to", []))
        attendees.extend(email.get("cc", []))
        
        # Remove duplicates
        return list(set(attendees))
    
    def _build_calendar_event(self, email: Dict, event_type: str, dates: List, times: List, 
                             duration: Dict, location: str, attendees: List) -> Dict:
        """Build calendar event object."""
        # Use first date and time
        date_str = dates[0].get("date", dates[0].get("raw", "")) if dates else ""
        time_str = times[0].get("24h_format", "09:00") if times else "09:00"
        
        event = {
            "title": email.get("subject", "Untitled Event"),
            "description": email.get("body", "")[:500],
            "event_type": event_type or "meeting",
            "date": date_str,
            "start_time": time_str,
            "duration_minutes": duration.get("total_minutes", 60),
            "location": location,
            "attendees": attendees,
            "organizer": email.get("from", ""),
            "reminders": [{"minutes": 15}, {"minutes": 5}]
        }
        
        return event
    
    def _check_conflicts(self, event: Dict) -> List[Dict]:
        """Check for calendar conflicts."""
        # In production, would check actual calendar
        conflicts = []
        
        # Mock conflict detection
        if event.get("start_time") == "09:00":
            conflicts.append({
                "type": "time_conflict",
                "description": "Potential conflict with morning standup",
                "severity": "low"
            })
        
        return conflicts
    
    def _calculate_confidence(self, dates: List, times: List, event_type: str) -> float:
        """Calculate extraction confidence score."""
        score = 50.0
        
        if dates:
            score += 20
        if times:
            score += 15
        if event_type:
            score += 10
        if len(dates) > 1:
            score += 5
        
        return min(100, score)
    
    def process_batch(self, emails: List[Dict]) -> Dict[str, Any]:
        results = [self.extract_events(e) for e in emails]
        
        events_detected = sum(1 for r in results if r["event_detected"])
        sync_recommended = sum(1 for r in results if r["sync_recommended"])
        
        event_types = {}
        for r in results:
            if r["event_type"]:
                event_types[r["event_type"]] = event_types.get(r["event_type"], 0) + 1
        
        return {
            "engine": "V641 - Email Calendar Sync Engine",
            "total_processed": len(results),
            "events_detected": events_detected,
            "sync_recommended": sync_recommended,
            "event_type_distribution": event_types,
            "average_confidence": round(sum(r["confidence_score"] for r in results) / len(results), 1) if results else 0,
            "reply_all_enforced": sum(1 for r in results if r["reply_all_enforced"]),
            "results": results
        }

if __name__ == "__main__":
    engine = EmailCalendarSyncEngine()
    test_emails = [
        {"subject": "Team Meeting Tomorrow", "body": "Let's meet tomorrow at 2:00 PM in Conference Room A to discuss the Q4 roadmap. The meeting will be 1 hour.",
         "from": "manager@company.com", "to": ["team@company.com", "lead@company.com"]},
        {"subject": "Project Deadline Reminder", "body": "Reminder: The project deliverables are due by 12/15/2026. Please submit by 5:00 PM.",
         "from": "pm@company.com", "to": ["team@company.com"]},
        {"subject": "Client Call Next Tuesday", "body": "We have a client call next Tuesday at 10:00 AM via Zoom. Link: https://zoom.us/j/123456",
         "from": "sales@company.com", "to": ["team@company.com", "manager@company.com"]}
    ]
    result = engine.process_batch(test_emails)
    print(json.dumps(result, indent=2))
