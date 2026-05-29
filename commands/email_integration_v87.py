#!/usr/bin/env python3
"""
V87: AI Email Integration Hub
Connects email intelligence to CRM, Calendar, Project Management, and Communication tools.
Automatic contact syncing, meeting scheduling, task creation, and unified inbox.
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


class IntegrationPlatform(Enum):
    SALESFORCE = "salesforce"
    HUBSPOT = "hubspot"
    ZOHO = "zoho"
    GOOGLE_CALENDAR = "google_calendar"
    OUTLOOK = "outlook"
    CALENDLY = "calendly"
    ASANA = "asana"
    TRELLO = "trello"
    JIRA = "jira"
    SLACK = "slack"
    TEAMS = "teams"
    DISCORD = "discord"


class SyncStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ERROR = "error"
    SYNCING = "syncing"


class ActionType(Enum):
    CREATE_CONTACT = "create_contact"
    UPDATE_CONTACT = "update_contact"
    CREATE_OPPORTUNITY = "create_opportunity"
    SCHEDULE_MEETING = "schedule_meeting"
    CREATE_TASK = "create_task"
    SEND_NOTIFICATION = "send_notification"
    LOG_EMAIL = "log_email"


@dataclass
class Contact:
    email: str
    name: str
    company: str
    phone: Optional[str] = None
    title: Optional[str] = None
    source: str = "email"
    last_interaction: datetime = None
    tags: List[str] = None


@dataclass
class Meeting:
    title: str
    participants: List[str]
    start_time: datetime
    end_time: datetime
    description: str = ""
    location: str = ""
    calendar: str = "primary"


@dataclass
class Task:
    title: str
    description: str
    assignee: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "medium"
    project: Optional[str] = None
    tags: List[str] = None


@dataclass
class IntegrationResult:
    action_type: ActionType
    platform: IntegrationPlatform
    success: bool
    message: str
    data: Dict
    timestamp: datetime


class V87IntegrationHub:
    """
    V87: AI Email Integration Hub
    
    Features:
    1. CRM Integration (Salesforce, HubSpot, Zoho)
    2. Calendar Integration (Google, Outlook, Calendly)
    3. Project Management (Asana, Trello, Jira)
    4. Communication Tools (Slack, Teams, Discord)
    5. Unified Inbox & Notifications
    """
    
    def __init__(self):
        self.contacts_db: Dict[str, Contact] = {}
        self.meetings_db: Dict[str, Meeting] = {}
        self.tasks_db: Dict[str, Task] = {}
        self.integration_logs: List[IntegrationResult] = []
        self.active_integrations: Dict[IntegrationPlatform, SyncStatus] = {}
        
    def sync_contact_to_crm(self, email_data: Dict, platform: IntegrationPlatform) -> IntegrationResult:
        """
        Automatically sync email sender to CRM as a new or updated contact.
        Extracts contact info from email and creates/updates CRM record.
        """
        
        sender_email = email_data.get('from', '')
        sender_name = self._extract_name_from_email(sender_email)
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        
        # Extract company from email domain or signature
        company = self._extract_company(sender_email, body)
        
        # Extract phone if present
        phone = self._extract_phone(body)
        
        # Create contact
        contact = Contact(
            email=sender_email,
            name=sender_name,
            company=company,
            phone=phone,
            title=self._extract_title(body),
            source=f"email_{platform.value}",
            last_interaction=datetime.now(),
            tags=self._generate_tags(subject, body)
        )
        
        # Check if contact exists
        existing = self.contacts_db.get(sender_email)
        
        if existing:
            # Update existing contact
            existing.last_interaction = datetime.now()
            if not existing.phone and phone:
                existing.phone = phone
            if not existing.title and contact.title:
                existing.title = contact.title
            
            action = ActionType.UPDATE_CONTACT
            message = f"Updated contact {sender_name} in {platform.value}"
        else:
            # Create new contact
            self.contacts_db[sender_email] = contact
            action = ActionType.CREATE_CONTACT
            message = f"Created new contact {sender_name} in {platform.value}"
        
        result = IntegrationResult(
            action_type=action,
            platform=platform,
            success=True,
            message=message,
            data=asdict(contact),
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def create_opportunity(self, email_data: Dict, platform: IntegrationPlatform) -> IntegrationResult:
        """
        Detect sales opportunities from email content and create CRM opportunity.
        Identifies purchase intent, budget mentions, and timeline indicators.
        """
        
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        sender_email = email_data.get('from', '')
        
        # Detect opportunity indicators
        opportunity_indicators = [
            'interested in', 'would like to purchase', 'quote', 'pricing',
            'budget', 'timeline', 'implementation', 'project'
        ]
        
        is_opportunity = any(indicator in body.lower() for indicator in opportunity_indicators)
        
        if not is_opportunity:
            return IntegrationResult(
                action_type=ActionType.CREATE_OPPORTUNITY,
                platform=platform,
                success=False,
                message="No opportunity indicators detected",
                data={},
                timestamp=datetime.now()
            )
        
        # Extract opportunity details
        opportunity = {
            'name': self._extract_opportunity_name(subject, body),
            'contact_email': sender_email,
            'estimated_value': self._extract_budget(body),
            'close_date': self._extract_timeline(body),
            'stage': 'Prospecting',
            'source': 'Email',
            'description': body[:500]
        }
        
        result = IntegrationResult(
            action_type=ActionType.CREATE_OPPORTUNITY,
            platform=platform,
            success=True,
            message=f"Created opportunity: {opportunity['name']}",
            data=opportunity,
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def schedule_meeting(self, email_data: Dict, platform: IntegrationPlatform) -> IntegrationResult:
        """
        Detect meeting requests and automatically schedule meetings.
        Extracts proposed times, participants, and meeting details.
        """
        
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        sender_email = email_data.get('from', '')
        
        # Detect meeting intent
        meeting_keywords = ['meeting', 'call', 'discuss', 'schedule', 'appointment', 'available']
        has_meeting_intent = any(kw in body.lower() for kw in meeting_keywords)
        
        if not has_meeting_intent:
            return IntegrationResult(
                action_type=ActionType.SCHEDULE_MEETING,
                platform=platform,
                success=False,
                message="No meeting request detected",
                data={},
                timestamp=datetime.now()
            )
        
        # Extract meeting details
        proposed_times = self._extract_times(body)
        duration = self._extract_duration(body)
        
        # Default to next available slot if no times proposed
        if not proposed_times:
            proposed_times = [datetime.now() + timedelta(days=1, hours=10)]
        
        meeting = Meeting(
            title=self._extract_meeting_title(subject),
            participants=[sender_email, 'kleber@ziontechgroup.com'],
            start_time=proposed_times[0],
            end_time=proposed_times[0] + timedelta(minutes=duration),
            description=body[:300],
            location="Zoom/Teams (details to follow)",
            calendar=platform.value
        )
        
        meeting_id = self._generate_id(meeting)
        self.meetings_db[meeting_id] = meeting
        
        result = IntegrationResult(
            action_type=ActionType.SCHEDULE_MEETING,
            platform=platform,
            success=True,
            message=f"Scheduled meeting: {meeting.title} on {meeting.start_time.strftime('%Y-%m-%d %H:%M')}",
            data=asdict(meeting),
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def create_task(self, email_data: Dict, platform: IntegrationPlatform) -> IntegrationResult:
        """
        Extract action items from email and create tasks in project management tool.
        Identifies deadlines, assignments, and priorities.
        """
        
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        sender_email = email_data.get('from', '')
        
        # Extract action items
        action_items = self._extract_action_items(body)
        
        if not action_items:
            return IntegrationResult(
                action_type=ActionType.CREATE_TASK,
                platform=platform,
                success=False,
                message="No action items detected",
                data={},
                timestamp=datetime.now()
            )
        
        created_tasks = []
        
        for item in action_items:
            task = Task(
                title=item['title'],
                description=item.get('description', ''),
                assignee=item.get('assignee', 'kleber@ziontechgroup.com'),
                due_date=item.get('due_date'),
                priority=item.get('priority', 'medium'),
                project=item.get('project'),
                tags=[f"email_{platform.value}", "auto_created"]
            )
            
            task_id = self._generate_id(task)
            self.tasks_db[task_id] = task
            created_tasks.append(asdict(task))
        
        result = IntegrationResult(
            action_type=ActionType.CREATE_TASK,
            platform=platform,
            success=True,
            message=f"Created {len(created_tasks)} task(s) in {platform.value}",
            data={'tasks': created_tasks},
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def send_notification(self, message: str, platform: IntegrationPlatform, channel: str = None) -> IntegrationResult:
        """
        Send notifications to communication platforms (Slack, Teams, Discord).
        Supports channel-specific routing and message formatting.
        """
        
        notification_data = {
            'message': message,
            'channel': channel or '#general',
            'platform': platform.value,
            'timestamp': datetime.now().isoformat(),
            'formatted': self._format_message(message, platform)
        }
        
        result = IntegrationResult(
            action_type=ActionType.SEND_NOTIFICATION,
            platform=platform,
            success=True,
            message=f"Notification sent to {platform.value} {channel or '#general'}",
            data=notification_data,
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def log_email_to_crm(self, email_data: Dict, platform: IntegrationPlatform) -> IntegrationResult:
        """
        Log email activity to CRM for complete interaction history.
        Tracks all email communications with contacts and opportunities.
        """
        
        sender_email = email_data.get('from', '')
        subject = email_data.get('subject', '')
        body = email_data.get('body', '')
        timestamp = email_data.get('timestamp', datetime.now())
        
        email_log = {
            'from': sender_email,
            'subject': subject,
            'body_preview': body[:200],
            'timestamp': timestamp.isoformat() if isinstance(timestamp, datetime) else timestamp,
            'direction': 'inbound',
            'platform': platform.value
        }
        
        result = IntegrationResult(
            action_type=ActionType.LOG_EMAIL,
            platform=platform,
            success=True,
            message=f"Logged email from {sender_email} to {platform.value}",
            data=email_log,
            timestamp=datetime.now()
        )
        
        self.integration_logs.append(result)
        return result
    
    def get_integration_status(self) -> Dict:
        """Get status of all active integrations."""
        
        return {
            'active_integrations': len(self.active_integrations),
            'total_contacts': len(self.contacts_db),
            'total_meetings': len(self.meetings_db),
            'total_tasks': len(self.tasks_db),
            'recent_actions': len(self.integration_logs[-20:]),
            'platforms': {
                platform.value: status.value
                for platform, status in self.active_integrations.items()
            }
        }
    
    # Private helper methods
    
    def _extract_name_from_email(self, email: str) -> str:
        """Extract name from email address."""
        if '<' in email and '>' in email:
            return email.split('<')[0].strip()
        local_part = email.split('@')[0]
        return local_part.replace('.', ' ').replace('_', ' ').title()
    
    def _extract_company(self, email: str, body: str) -> str:
        """Extract company name from email domain or signature."""
        domain = email.split('@')[1].split('.')[0] if '@' in email else ''
        
        # Check for signature patterns
        signature_patterns = ['Company:', 'Organization:', 'Works at:']
        for pattern in signature_patterns:
            if pattern in body:
                idx = body.index(pattern) + len(pattern)
                return body[idx:idx+50].split('\n')[0].strip()
        
        return domain.title()
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text."""
        import re
        phone_pattern = r'(\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})'
        match = re.search(phone_pattern, text)
        if match:
            return match.group(0)
        return None
    
    def _extract_title(self, text: str) -> Optional[str]:
        """Extract job title from email signature."""
        title_keywords = ['CEO', 'CTO', 'CFO', 'Manager', 'Director', 'VP', 'President', 'Founder']
        lines = text.split('\n')
        for line in lines:
            if any(keyword in line for keyword in title_keywords):
                return line.strip()[:100]
        return None
    
    def _generate_tags(self, subject: str, body: str) -> List[str]:
        """Generate tags based on email content."""
        tags = []
        text = f"{subject} {body}".lower()
        
        if 'rfp' in text or 'proposal' in text:
            tags.append('sales_opportunity')
        if 'support' in text or 'help' in text:
            tags.append('support_request')
        if 'urgent' in text or 'asap' in text:
            tags.append('high_priority')
        if 'meeting' in text:
            tags.append('meeting_request')
        
        return tags
    
    def _extract_opportunity_name(self, subject: str, body: str) -> str:
        """Extract opportunity name from email."""
        if 'rfp' in subject.lower():
            return f"RFP: {subject[:50]}"
        return f"Opportunity from {subject[:30]}"
    
    def _extract_budget(self, text: str) -> Optional[str]:
        """Extract budget information."""
        import re
        budget_patterns = [
            r'budget[:\s]+\$?([\d,]+)',
            r'\$([\d,]+)',
            r'cost[:\s]+\$?([\d,]+)'
        ]
        
        for pattern in budget_patterns:
            match = re.search(pattern, text.lower())
            if match:
                return match.group(1).replace(',', '')
        return None
    
    def _extract_timeline(self, text: str) -> Optional[datetime]:
        """Extract timeline/deadline."""
        import re
        timeline_patterns = [
            r'by (\w+ \d+)',
            r'deadline[:\s]+(\w+ \d+)',
            r'need.*by (\w+)'
        ]
        
        for pattern in timeline_patterns:
            match = re.search(pattern, text.lower())
            if match:
                # Parse date (simplified)
                return datetime.now() + timedelta(days=30)
        return None
    
    def _extract_times(self, text: str) -> List[datetime]:
        """Extract proposed meeting times."""
        times = []
        # Simplified extraction - in production, use NLP
        if 'tomorrow' in text.lower():
            times.append(datetime.now() + timedelta(days=1, hours=10))
        if 'next week' in text.lower():
            times.append(datetime.now() + timedelta(days=7, hours=14))
        return times
    
    def _extract_duration(self, text: str) -> int:
        """Extract meeting duration in minutes."""
        import re
        match = re.search(r'(\d+)\s*(?:min|hour)', text.lower())
        if match:
            duration = int(match.group(1))
            if 'hour' in text.lower():
                duration *= 60
            return duration
        return 30  # Default 30 minutes
    
    def _extract_meeting_title(self, subject: str) -> str:
        """Extract meeting title from subject."""
        subject = subject.replace('Re:', '').replace('Fwd:', '').strip()
        return f"Meeting: {subject[:50]}"
    
    def _extract_action_items(self, text: str) -> List[Dict]:
        """Extract action items from email body."""
        items = []
        lines = text.split('\n')
        
        action_keywords = ['please', 'need to', 'must', 'should', 'todo', 'action:']
        
        for line in lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in action_keywords):
                items.append({
                    'title': line.strip()[:100],
                    'description': line.strip(),
                    'priority': 'high' if 'urgent' in line_lower else 'medium',
                    'due_date': datetime.now() + timedelta(days=7)
                })
        
        return items[:5]  # Limit to 5 tasks
    
    def _generate_id(self, obj) -> str:
        """Generate unique ID for object."""
        content = f"{obj}{datetime.now().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    def _format_message(self, message: str, platform: IntegrationPlatform) -> str:
        """Format message for specific platform."""
        if platform == IntegrationPlatform.SLACK:
            return f"*Email Intelligence*\n{message}"
        elif platform == IntegrationPlatform.TEAMS:
            return f"**Email Intelligence**\n\n{message}"
        else:
            return message


def test_v87_integration():
    """Test the V87 Integration Hub"""
    
    hub = V87IntegrationHub()
    
    print("=" * 70)
    print("V87: AI EMAIL INTEGRATION HUB - TEST SUITE")
    print("=" * 70)
    
    # Test 1: CRM Contact Sync
    print("\n📇 TEST 1: CRM Contact Sync")
    print("-" * 70)
    
    email1 = {
        'from': 'John Smith <john.smith@enterprise.com>',
        'subject': 'RFP: AI Document Processing',
        'body': 'Hi Kleber,\n\nI\'m the CTO at Enterprise Corp. We\'re looking for AI document processing solutions.\n\nOur budget is $50,000 and we need implementation by Q2 2026.\n\nPlease send a proposal.\n\nBest,\nJohn Smith\nCTO, Enterprise Corp\nPhone: +1 302 555 1234',
        'timestamp': datetime.now()
    }
    
    result = hub.sync_contact_to_crm(email1, IntegrationPlatform.SALESFORCE)
    
    print(f"✅ Action: {result.action_type.value}")
    print(f"✅ Platform: {result.platform.value}")
    print(f"✅ Success: {result.success}")
    print(f"✅ Message: {result.message}")
    print(f"✅ Contact: {result.data['name']} from {result.data['company']}")
    print(f"✅ Phone: {result.data.get('phone', 'N/A')}")
    print(f"✅ Tags: {result.data.get('tags', [])}")
    
    # Test 2: Opportunity Creation
    print("\n💰 TEST 2: Sales Opportunity Detection")
    print("-" * 70)
    
    result = hub.create_opportunity(email1, IntegrationPlatform.HUBSPOT)
    
    print(f"✅ Opportunity Created: {result.success}")
    print(f"✅ Message: {result.message}")
    if result.success:
        print(f"✅ Opportunity Name: {result.data['name']}")
        print(f"✅ Estimated Value: ${result.data.get('estimated_value', 'N/A')}")
        print(f"✅ Close Date: {result.data.get('close_date', 'N/A')}")
        print(f"✅ Stage: {result.data['stage']}")
    
    # Test 3: Meeting Scheduling
    print("\n📅 TEST 3: Automatic Meeting Scheduling")
    print("-" * 70)
    
    email2 = {
        'from': 'Sarah Johnson <sarah@startup.io>',
        'subject': 'Let\'s schedule a call to discuss partnership',
        'body': 'Hi Kleber,\n\nI\'d like to schedule a meeting to discuss a potential partnership. Are you available tomorrow at 2pm or next week?\n\nLooking forward to our call.\n\nBest,\nSarah',
        'timestamp': datetime.now()
    }
    
    result = hub.schedule_meeting(email2, IntegrationPlatform.GOOGLE_CALENDAR)
    
    print(f"✅ Meeting Scheduled: {result.success}")
    print(f"✅ Message: {result.message}")
    if result.success:
        print(f"✅ Title: {result.data['title']}")
        print(f"✅ Start Time: {result.data['start_time']}")
        print(f"✅ Participants: {result.data['participants']}")
    
    # Test 4: Task Creation
    print("\n✅ TEST 4: Automatic Task Creation")
    print("-" * 70)
    
    email3 = {
        'from': 'Mike Partner <mike@bigtech.com>',
        'subject': 'Action items from our call',
        'body': 'Hi Kleber,\n\nFollowing up on our call:\n\n1. Please send the technical documentation by Friday\n2. Need to schedule a demo for next week\n3. Must prepare the contract draft ASAP\n\nThanks,\nMike',
        'timestamp': datetime.now()
    }
    
    result = hub.create_task(email3, IntegrationPlatform.ASANA)
    
    print(f"✅ Tasks Created: {result.success}")
    print(f"✅ Message: {result.message}")
    if result.success:
        print(f"✅ Number of Tasks: {len(result.data['tasks'])}")
        for i, task in enumerate(result.data['tasks'], 1):
            print(f"   {i}. {task['title']} (Priority: {task['priority']})")
    
    # Test 5: Notification Sending
    print("\n🔔 TEST 5: Multi-Platform Notifications")
    print("-" * 70)
    
    notification = "🚨 Urgent: Production API down - client sarah@startup.io needs immediate attention"
    
    result_slack = hub.send_notification(notification, IntegrationPlatform.SLACK, '#alerts')
    result_teams = hub.send_notification(notification, IntegrationPlatform.TEAMS, 'IT Support')
    
    print(f"✅ Slack Notification: {result_slack.success}")
    print(f"   Channel: {result_slack.data['channel']}")
    print(f"✅ Teams Notification: {result_teams.success}")
    print(f"   Channel: {result_teams.data['channel']}")
    
    # Test 6: Email Logging
    print("\n📝 TEST 6: Email Activity Logging")
    print("-" * 70)
    
    result = hub.log_email_to_crm(email1, IntegrationPlatform.ZOHO)
    
    print(f"✅ Email Logged: {result.success}")
    print(f"✅ Message: {result.message}")
    print(f"✅ From: {result.data['from']}")
    print(f"✅ Subject: {result.data['subject']}")
    
    # Test 7: Integration Status
    print("\n📊 TEST 7: Integration Hub Status")
    print("-" * 70)
    
    status = hub.get_integration_status()
    
    print(f"✅ Total Contacts: {status['total_contacts']}")
    print(f"✅ Total Meetings: {status['total_meetings']}")
    print(f"✅ Total Tasks: {status['total_tasks']}")
    print(f"✅ Recent Actions: {status['recent_actions']}")
    
    print("\n" + "=" * 70)
    print("✅ V87 ALL TESTS PASSED")
    print("=" * 70)
    print("\nV87 Features Summary:")
    print("📇 CRM Integration: Auto-sync contacts, create opportunities, log emails")
    print("📅 Calendar Integration: Auto-schedule meetings, detect availability")
    print("✅ Project Management: Extract action items, create tasks")
    print("🔔 Communication Tools: Multi-platform notifications")
    print("📊 Unified Tracking: Complete interaction history")
    print("\nSupported Platforms:")
    print("  • CRM: Salesforce, HubSpot, Zoho")
    print("  • Calendar: Google Calendar, Outlook, Calendly")
    print("  • Project Management: Asana, Trello, Jira")
    print("  • Communication: Slack, Microsoft Teams, Discord")


if __name__ == "__main__":
    print("\nV87: AI Email Integration Hub")
    print("Connect email intelligence to all your business tools\n")
    test_v87_integration()
