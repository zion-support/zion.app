#!/usr/bin/env python3
"""V549 - Multi-Channel Orchestrator
Coordinates email + Slack + Teams + SMS for unified customer communication.
CRITICAL: Always enforces reply-all for multi-recipient emails.
"""
import json
from datetime import datetime
from typing import Dict, List

class MultiChannelOrchestrator:
    def __init__(self):
        self.reply_all_enforced = True
        self.channels = ["email", "slack", "teams", "sms"]
    
    def orchestrate_response(self, email: Dict, customer_preferences: Dict = None) -> Dict:
        """Orchestrate multi-channel response strategy"""
        urgency = self._assess_urgency(email)
        complexity = self._assess_complexity(email)
        preferred_channels = self._determine_channels(urgency, complexity, customer_preferences)
        
        return {
            "engine": "V549_Multi_Channel_Orchestrator",
            "timestamp": datetime.now().isoformat(),
            "primary_channel": preferred_channels[0],
            "secondary_channels": preferred_channels[1:],
            "urgency_level": urgency,
            "complexity_level": complexity,
            "channel_strategy": self._generate_strategy(preferred_channels, urgency, complexity),
            "response_timeline": self._estimate_timeline(urgency),
            "escalation_path": self._define_escalation(urgency, complexity),
            "reply_all_enforced": self.reply_all_enforced,
            "all_recipients": email.get("to", []) + email.get("cc", [])
        }
    
    def _assess_urgency(self, email: Dict) -> str:
        """Assess urgency level"""
        body = email.get("body", "").lower()
        subject = email.get("subject", "").lower()
        full_text = f"{subject} {body}"
        
        if any(w in full_text for w in ["urgent", "asap", "immediately", "critical", "emergency", "production down"]):
            return "critical"
        elif any(w in full_text for w in ["important", "soon", "quickly", "priority", "deadline"]):
            return "high"
        elif any(w in full_text for w in ["when possible", "no rush", "whenever", "flexible"]):
            return "low"
        return "normal"
    
    def _assess_complexity(self, email: Dict) -> str:
        """Assess complexity level"""
        body = email.get("body", "")
        word_count = len(body.split())
        has_attachments = bool(email.get("attachments"))
        technical_terms = any(w in body.lower() for w in ["api", "integration", "technical", "bug", "error"])
        
        if word_count > 300 or (has_attachments and technical_terms):
            return "high"
        elif word_count > 150 or technical_terms:
            return "medium"
        return "low"
    
    def _determine_channels(self, urgency: str, complexity: str, preferences: Dict = None) -> List[str]:
        """Determine optimal channel mix"""
        channels = []
        
        if urgency == "critical":
            channels.extend(["email", "slack", "sms"])
        elif urgency == "high":
            channels.extend(["email", "slack"])
        else:
            channels.append("email")
        
        if complexity == "high":
            if "teams" not in channels:
                channels.append("teams")
        
        # Apply customer preferences if available
        if preferences and "preferred_channels" in preferences:
            preferred = preferences["preferred_channels"]
            channels = [c for c in channels if c in preferred] or channels
        
        return channels
    
    def _generate_strategy(self, channels: List[str], urgency: str, complexity: str) -> Dict:
        """Generate channel-specific strategy"""
        strategy = {}
        
        for channel in channels:
            if channel == "email":
                strategy[channel] = {
                    "action": "Detailed response with documentation",
                    "tone": "professional" if complexity == "high" else "friendly",
                    "include_attachments": complexity == "high"
                }
            elif channel == "slack":
                strategy[channel] = {
                    "action": "Quick acknowledgment and status update",
                    "tone": "casual",
                    "thread": True
                }
            elif channel == "teams":
                strategy[channel] = {
                    "action": "Schedule call for complex discussion",
                    "tone": "collaborative",
                    "include_calendar_invite": complexity == "high"
                }
            elif channel == "sms":
                strategy[channel] = {
                    "action": "Urgent notification only",
                    "tone": "concise",
                    "max_length": 160
                }
        
        return strategy
    
    def _estimate_timeline(self, urgency: str) -> Dict:
        """Estimate response timeline"""
        timelines = {
            "critical": {"initial": "15 minutes", "resolution": "2 hours"},
            "high": {"initial": "1 hour", "resolution": "8 hours"},
            "normal": {"initial": "4 hours", "resolution": "24 hours"},
            "low": {"initial": "24 hours", "resolution": "72 hours"}
        }
        return timelines.get(urgency, timelines["normal"])
    
    def _define_escalation(self, urgency: str, complexity: str) -> List[Dict]:
        """Define escalation path"""
        path = []
        
        if urgency == "critical":
            path.append({"level": 1, "contact": "On-call engineer", "timeline": "15 minutes"})
            path.append({"level": 2, "contact": "Engineering manager", "timeline": "30 minutes"})
            path.append({"level": 3, "contact": "VP of Engineering", "timeline": "1 hour"})
        elif urgency == "high" or complexity == "high":
            path.append({"level": 1, "contact": "Support lead", "timeline": "1 hour"})
            path.append({"level": 2, "contact": "Customer Success Manager", "timeline": "4 hours"})
        else:
            path.append({"level": 1, "contact": "Support representative", "timeline": "4 hours"})
        
        return path

if __name__ == "__main__":
    orchestrator = MultiChannelOrchestrator()
    test = {"subject": "Urgent: Production API down", "body": "Our production system is completely down. Need immediate assistance with API integration.", "to": ["support@zion.com"], "cc": ["cto@client.com", "manager@client.com"]}
    print(json.dumps(orchestrator.orchestrate_response(test), indent=2))
