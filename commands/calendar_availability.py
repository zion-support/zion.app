#!/usr/bin/env python3
"""
Calendar Availability Checker - For email responders
Checks Google Calendar for available slots to include in booking replies
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

WORKSPACE = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE / 'commands'))

def get_availability_next_7_days():
    """Get available days in next 7 days from Google Calendar"""
    try:
        from google_workspace import gcal_list_events
        
        # Get events for next 7 days
        now = datetime.utcnow()
        end_date = now + timedelta(days=7)
        
        events = gcal_list_events(max_results=50)
        
        # Find busy days
        busy_days = set()
        for event in events:
            start = event.get('start', {})
            if 'dateTime' in start:
                event_date = start['dateTime'][:10]  # YYYY-MM-DD
                busy_days.add(event_date)
        
        # Find available days
        available = []
        for i in range(7):
            date = (now + timedelta(days=i)).strftime('%Y-%m-%d')
            if date not in busy_days:
                available.append(date)
        
        return available[:5]  # Return up to 5 available days
    except Exception as e:
        print(f"Calendar error: {e}")
        return []

def format_availability(available_days):
    """Format availability for email response"""
    if not available_days:
        return None
    
    day_names = {
        '0': 'Segunda', '1': 'Terça', '2': 'Quarta', '3': 'Quinta',
        '4': 'Sexta', '5': 'Sábado', '6': 'Domingo'
    }
    
    pt_dates = []
    for day in available_days:
        dt = datetime.strptime(day, '%Y-%m-%d')
        weekday = str(dt.weekday())
        pt_dates.append(f"{day_names.get(weekday, '')}, {day}")
    
    return pt_dates

if __name__ == '__main__':
    avail = get_availability_next_7_days()
    formatted = format_availability(avail)
    print(f"Available days: {formatted}")